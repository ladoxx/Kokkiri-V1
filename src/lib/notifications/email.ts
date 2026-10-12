import nodemailer from "nodemailer";
import { getSmtpConfig } from "@/lib/config/smtp-store";

export interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}

export interface InquiryEmailPayload {
  inquiryId: string;
  customerName: string;
  company?: string | null;
  email: string;
  phone: string;
  inquiryType: string;
  serviceCategory?: string | null;
  location?: string | null;
  message: string;
  createdAt: Date | string;
  divisionName?: string;
  headerNote?: string;
  replyToCustomer?: boolean;
}

export function createMailTransporter() {
  const cfg = getSmtpConfig();

  if (!cfg.host || !cfg.user || !cfg.pass) {
    // Development or unconfigured fallback test transporter
    return null;
  }

  return nodemailer.createTransport({
    host: cfg.host,
    port: Number(cfg.port) || 587,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
    connectionTimeout: 8000,
  });
}

export function generateInquiryNotificationHtml(data: InquiryEmailPayload): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kokkiri.com";
  const adminUrl = `${siteUrl}/admin/inquiries/${data.inquiryId}`;
  const formattedDate = new Date(data.createdAt).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', 'Malgun Gothic', sans-serif; background-color: #f8f8f4; margin: 0; padding: 24px; color: #202622; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #173F30; color: #ffffff; padding: 24px 32px; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.85; }
    .content { padding: 32px; }
    .badge { display: inline-block; padding: 4px 10px; background: #e8f5e9; color: #173F30; border-radius: 6px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .table th { text-align: left; padding: 10px 12px; font-size: 13px; color: #64748b; background: #f8fafc; border-bottom: 1px solid #e2e8f0; width: 120px; }
    .table td { padding: 10px 12px; font-size: 14px; color: #1e293b; border-bottom: 1px solid #e2e8f0; }
    .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; margin-bottom: 24px; }
    .btn-container { text-align: center; margin-top: 30px; }
    .btn { display: inline-block; background: #173F30; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; }
    .footer { background: #f1f5f9; padding: 16px 32px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>[KOKKIRI] 새로운 고객 문의 접수 알림</h1>
      <p>코끼리 비즈니스 플랫폼에 신규 견적 및 상담 요청이 등록되었습니다.</p>
    </div>
    <div class="content">
      <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 16px; flex-wrap: wrap;">
        <span class="badge" style="margin-bottom: 0;">${data.inquiryType}</span>
        ${
          data.divisionName
            ? `<span style="display: inline-block; padding: 4px 10px; background: #e0f2fe; color: #0369a1; border-radius: 6px; font-size: 13px; font-weight: 700;">부서: ${data.divisionName}</span>`
            : ""
        }
      </div>
      ${
        data.headerNote
          ? `<div style="background: #fefce8; border-left: 4px solid #eab308; padding: 10px 14px; font-size: 13px; color: #713f12; margin-bottom: 18px; border-radius: 4px;"><strong>[배정 알림]</strong> ${data.headerNote}</div>`
          : ""
      }
      <table class="table">
        <tr><th>고객 성명</th><td><strong>${data.customerName}</strong></td></tr>
        ${data.company ? `<tr><th>회사/상호명</th><td>${data.company}</td></tr>` : ""}
        <tr><th>연락처</th><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>
        <tr><th>이메일</th><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
        ${data.serviceCategory ? `<tr><th>관심 서비스</th><td>${data.serviceCategory}</td></tr>` : ""}
        ${data.location ? `<tr><th>지역/현장 위치</th><td>${data.location}</td></tr>` : ""}
        <tr><th>접수 일시</th><td>${formattedDate}</td></tr>
      </table>
      <div style="font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 8px;">문의 상세 내용:</div>
      <div class="message-box">${data.message}</div>
      <div class="btn-container">
        <a href="${adminUrl}" class="btn" target="_blank">관리자 센터에서 즉시 확인하기</a>
      </div>
      ${
        data.replyToCustomer
          ? `<div style="margin-top: 18px; font-size: 12px; color: #0284c7; text-align: center; background: #f0f9ff; padding: 8px; border-radius: 6px;">💡 <strong>안내:</strong> 본 메일에 직접 [답장]하시면 문의 고객(${data.email})에게 바로 답변이 전송됩니다.</div>`
          : ""
      }
    </div>
    <div class="footer">
      본 메일은 KOKKIRI 비즈니스 플랫폼 스마트 리드 라우팅 시스템에서 자동 발송되었습니다.<br/>
      보안 및 개인정보 보호를 위해 담당자만 열람하시기 바랍니다.
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const transporter = createMailTransporter();
  const cfg = getSmtpConfig();
  const from = cfg.from || process.env.SMTP_FROM || "KOKKIRI 알림센터 <notification@kokkiri.com>";

  if (!transporter) {
    // In dev / test environment without active credentials, simulate successful delivery with structured logging
    console.log(`[SMTP TEST/SIMULATION] To: ${Array.isArray(options.to) ? options.to.join(", ") : options.to}`);
    if (options.cc) console.log(`[SMTP TEST/SIMULATION] CC: ${Array.isArray(options.cc) ? options.cc.join(", ") : options.cc}`);
    if (options.bcc) console.log(`[SMTP TEST/SIMULATION] BCC: ${Array.isArray(options.bcc) ? options.bcc.join(", ") : options.bcc}`);
    if (options.replyTo) console.log(`[SMTP TEST/SIMULATION] Reply-To: ${options.replyTo}`);
    console.log(`[SMTP TEST/SIMULATION] Subject: ${options.subject}`);
    return {
      success: true,
      messageId: `simulated-${Date.now()}`,
    };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      replyTo: options.replyTo,
      subject: options.subject,
      html: options.html,
      text: options.text || options.subject,
    });
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[SMTP ERROR] Failed to send email:", errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
}
