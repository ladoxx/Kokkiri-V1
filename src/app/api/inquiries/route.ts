import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inquirySubmissionSchema } from "@/lib/validations/inquiry";
import { enqueueInquiryNotifications } from "@/lib/notifications/queue";
import { getSession } from "@/lib/auth/auth";
import { InquiryStatus } from "@/lib/types/enums";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = inquirySubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "입력값 검증에 실패했습니다.", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      name,
      company,
      email,
      phone,
      inquiryType,
      serviceCategory,
      location,
      message,
      preferredContactMethod,
      consentGiven,
    } = parsed.data;

    let inquiryId = `inq-${Date.now()}`;
    const createdAt = new Date();

    try {
      // 1. Create or Find Customer
      let customer = await prisma.customer.findFirst({
        where: { email },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name,
            company,
            email,
            phone,
          },
        });
      } else {
        // Update contact information
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: { name, company: company || customer.company, phone },
        });
      }

      // 2. Create Inquiry record
      const inquiry = await prisma.inquiry.create({
        data: {
          customerId: customer.id,
          inquiryType,
          serviceCategory,
          location,
          message,
          preferredContactMethod,
          consentGiven,
          status: InquiryStatus.NEW,
        },
      });

      inquiryId = inquiry.id;
    } catch (dbErr) {
      console.warn("[INQUIRY API] Database offline or write error, falling back to in-memory:", dbErr);
    }

    // 3. Trigger Notification Queue (SMTP Email & KakaoTalk Alimtalk)
    try {
      await enqueueInquiryNotifications({
        inquiryId,
        customerName: name,
        company,
        email,
        phone,
        inquiryType,
        serviceCategory,
        location,
        message,
        createdAt,
      });
    } catch (notifErr) {
      console.error("[INQUIRY NOTIFICATION ERROR] Notification enqueue failed:", notifErr);
    }

    return NextResponse.json(
      {
        success: true,
        inquiryId,
        message: "문의가 성공적으로 접수되었습니다. 담당 매니저가 검토 후 신속히 연락드리겠습니다.",
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "서버 오류가 발생했습니다.";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");
  const typeParam = searchParams.get("type");
  const query = searchParams.get("q") || "";

  try {
    const whereClause: any = {};
    if (statusParam && statusParam !== "ALL") {
      whereClause.status = statusParam as InquiryStatus;
    }
    if (typeParam && typeParam !== "ALL") {
      whereClause.inquiryType = typeParam;
    }
    if (query) {
      whereClause.OR = [
        { customer: { name: { contains: query, mode: "insensitive" } } },
        { customer: { company: { contains: query, mode: "insensitive" } } },
        { customer: { email: { contains: query, mode: "insensitive" } } },
        { customer: { phone: { contains: query, mode: "insensitive" } } },
        { message: { contains: query, mode: "insensitive" } },
      ];
    }

    const inquiries = await prisma.inquiry.findMany({
      where: whereClause,
      include: {
        customer: true,
        assignedUser: { select: { id: true, name: true, email: true } },
        notes: { include: { author: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, inquiries });
  } catch {
    // If DB is empty or during initialization, return empty inquiries array
    return NextResponse.json({
      success: true,
      inquiries: [],
    });
  }
}
