import { prisma } from "../prisma";
import { NotificationChannel, NotificationStatus } from "@/lib/types/enums";
import { sendEmail, generateInquiryNotificationHtml, InquiryEmailPayload } from "./email";
import { sendKakaoAlimtalk, formatInquiryAlimtalkContent } from "./kakao";
import { resolveInquiryRouting } from "@/lib/data/lead-routing-store";

export interface CreateInquiryNotificationParams {
  inquiryId: string;
  customerName: string;
  company?: string | null;
  email: string;
  phone: string;
  inquiryType: string;
  serviceCategory?: string | null;
  location?: string | null;
  message: string;
  createdAt: Date;
}

export async function enqueueInquiryNotifications(params: CreateInquiryNotificationParams) {
  // Resolve division-specific lead routing rules (Cleaning, KOTO, CHOKO/General)
  const routing = resolveInquiryRouting({
    inquiryType: params.inquiryType,
    serviceCategory: params.serviceCategory,
    customerName: params.customerName,
    company: params.company,
    location: params.location,
  });

  const receiverEmails = routing.recipients;
  const bccEmails = routing.bcc;
  const replyTo = routing.enableCustomerReplyTo ? params.email : undefined;
  const emailSubject = routing.subject;

  const emailPayload: InquiryEmailPayload = {
    inquiryId: params.inquiryId,
    customerName: params.customerName,
    company: params.company,
    email: params.email,
    phone: params.phone,
    inquiryType: params.inquiryType,
    serviceCategory: params.serviceCategory,
    location: params.location,
    message: params.message,
    createdAt: params.createdAt,
    divisionName: routing.divisionName,
    headerNote: routing.headerNote,
    replyToCustomer: routing.enableCustomerReplyTo,
  };

  const emailHtml = generateInquiryNotificationHtml(emailPayload);

  const kakaoContent = formatInquiryAlimtalkContent({
    customerName: params.customerName,
    phone: params.phone,
    inquiryType: params.inquiryType,
    createdAt: params.createdAt,
  });

  const emailIdempotency = `email-inquiry-${params.inquiryId}`;
  const kakaoIdempotency = `kakao-inquiry-${params.inquiryId}`;

  // 1. Process or Enqueue SMTP Email with Intelligent Routing & Boss Master BCC
  try {
    const emailJob = await prisma.notificationJob.upsert({
      where: { idempotencyKey: emailIdempotency },
      update: {},
      create: {
        channel: NotificationChannel.EMAIL,
        inquiryId: params.inquiryId,
        recipient: receiverEmails.join(", "),
        subject: emailSubject,
        payload: {
          html: emailHtml,
          text: params.message,
          bcc: bccEmails,
          replyTo,
          division: routing.divisionKey,
        },
        status: NotificationStatus.PENDING,
        idempotencyKey: emailIdempotency,
      },
    });
    // Trigger immediate async execution
    await processJob(emailJob.id);
  } catch (err) {
    console.warn("[QUEUE] Prisma unavailable or error, sending email directly:", err);
    await sendEmail({
      to: receiverEmails,
      bcc: bccEmails.length > 0 ? bccEmails : undefined,
      replyTo,
      subject: emailSubject,
      html: emailHtml,
    });
  }

  // 2. Process or Enqueue Kakao Alimtalk
  try {
    const kakaoJob = await prisma.notificationJob.upsert({
      where: { idempotencyKey: kakaoIdempotency },
      update: {},
      create: {
        channel: NotificationChannel.KAKAO_ALIMTALK,
        inquiryId: params.inquiryId,
        recipient: params.phone,
        subject: "고객 상담 접수 알림톡",
        payload: { content: kakaoContent, templateCode: "INQUIRY_RECEIVED_01" },
        status: NotificationStatus.PENDING,
        idempotencyKey: kakaoIdempotency,
      },
    });
    // Trigger immediate async execution
    await processJob(kakaoJob.id);
  } catch (err) {
    console.warn("[QUEUE] Prisma unavailable or error, sending Kakao Alimtalk directly:", err);
    await sendKakaoAlimtalk({
      templateCode: "INQUIRY_RECEIVED_01",
      recipientPhone: params.phone,
      content: kakaoContent,
    });
  }
}

export async function processJob(jobId: string): Promise<boolean> {
  let job;
  try {
    job = await prisma.notificationJob.findUnique({ where: { id: jobId } });
  } catch {
    return false;
  }

  if (!job || job.status === NotificationStatus.SENT) {
    return true;
  }

  try {
    await prisma.notificationJob.update({
      where: { id: jobId },
      data: { status: NotificationStatus.PROCESSING },
    });

    let success = false;
    let errorMessage: string | undefined;

    if (job.channel === NotificationChannel.EMAIL) {
      const payload = job.payload as {
        html: string;
        text?: string;
        bcc?: string[];
        replyTo?: string;
      };
      const recipients = job.recipient.split(",").map((e) => e.trim());
      const result = await sendEmail({
        to: recipients,
        bcc: payload.bcc && payload.bcc.length > 0 ? payload.bcc : undefined,
        replyTo: payload.replyTo,
        subject: job.subject || "[KOKKIRI] 알림",
        html: payload.html,
        text: payload.text,
      });
      success = result.success;
      errorMessage = result.error;
    } else if (job.channel === NotificationChannel.KAKAO_ALIMTALK) {
      const payload = job.payload as { content: string; templateCode: string };
      const result = await sendKakaoAlimtalk({
        recipientPhone: job.recipient,
        templateCode: payload.templateCode,
        content: payload.content,
      });
      success = result.success;
      errorMessage = result.error;
    }

    if (success) {
      await prisma.notificationJob.update({
        where: { id: jobId },
        data: {
          status: NotificationStatus.SENT,
          sentAt: new Date(),
          errorMessage: null,
        },
      });

      await prisma.notificationLog.create({
        data: {
          jobId,
          channel: job.channel,
          status: NotificationStatus.SENT,
          details: "Successfully delivered",
        },
      });
      return true;
    } else {
      const nextRetryCount = job.retryCount + 1;
      const isFailed = nextRetryCount >= job.maxRetries;
      // Exponential backoff: 2^retryCount * 60 seconds
      const backoffMs = Math.pow(2, nextRetryCount) * 60 * 1000;
      const nextAttemptAt = new Date(Date.now() + backoffMs);

      await prisma.notificationJob.update({
        where: { id: jobId },
        data: {
          status: isFailed ? NotificationStatus.FAILED : NotificationStatus.RETRY_SCHEDULED,
          retryCount: nextRetryCount,
          nextAttemptAt,
          errorMessage: errorMessage || "Unknown error occurred",
        },
      });

      await prisma.notificationLog.create({
        data: {
          jobId,
          channel: job.channel,
          status: isFailed ? NotificationStatus.FAILED : NotificationStatus.RETRY_SCHEDULED,
          details: `Attempt ${nextRetryCount}/${job.maxRetries} failed: ${errorMessage}`,
        },
      });
      return false;
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    await prisma.notificationJob.update({
      where: { id: jobId },
      data: {
        status: NotificationStatus.FAILED,
        errorMessage: errorMsg,
      },
    }).catch(() => {});
    return false;
  }
}
