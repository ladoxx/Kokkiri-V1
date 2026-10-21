import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { resolveInquiryRouting, getLeadRoutingSettings } from "@/lib/data/lead-routing-store";
import { sendEmail, generateInquiryNotificationHtml } from "@/lib/notifications/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const brand = body?.brand || body?.divisionKey || "kokkiri";

    let sampleType = "클리닝 정기 관리 견적 문의";
    let sampleCategory = "사옥 및 오피스 정기 클리닝";
    let sampleCustomer = "테스트 고객 (주식회사 샘플 타워)";
    let sampleMessage = "통합 이메일 알림 테스트 발송입니다. 모든 브랜드 문의가 단일 수신처로 정상 도달하는지 확인합니다.";

    if (brand === "koto") {
      sampleType = "4K AI 지능형 CCTV 보안 및 시설 견적";
      sampleCategory = "스마트 AI CCTV 16채널 및 24H 관제";
      sampleCustomer = "테스트 고객 (물류센터 시설팀)";
    } else if (brand === "choko") {
      sampleType = "CHOKO 에코 라이프케어 대량 구매/제휴";
      sampleCategory = "100% 대나무 롤 화장지 및 비건 펫푸드 B2B 공급";
      sampleCustomer = "테스트 고객 (리테일 파트너스)";
    }

    const routing = resolveInquiryRouting({
      inquiryType: sampleType,
      serviceCategory: sampleCategory,
      customerName: sampleCustomer,
      company: "주식회사 샘플 기업",
      location: "서울특별시 강남구 테헤란로 123",
    });

    const emailHtml = generateInquiryNotificationHtml({
      inquiryId: `test-${Date.now()}`,
      customerName: sampleCustomer,
      company: "주식회사 샘플 기업",
      email: "test.customer@sample.com",
      phone: "010-1234-5678",
      inquiryType: sampleType,
      serviceCategory: sampleCategory,
      location: "서울특별시 강남구 테헤란로 123",
      message: sampleMessage,
      createdAt: new Date(),
      divisionName: routing.divisionName,
      headerNote: routing.headerNote,
      replyToCustomer: routing.enableCustomerReplyTo,
    });

    const replyTo = routing.enableCustomerReplyTo ? "test.customer@sample.com" : undefined;

    const emailResult = await sendEmail({
      to: routing.recipients,
      bcc: routing.bcc && routing.bcc.length > 0 ? routing.bcc : undefined,
      replyTo,
      subject: `[테스트 발송] ${routing.subject}`,
      html: emailHtml,
    });

    const settings = getLeadRoutingSettings();

    return NextResponse.json({
      success: emailResult.success,
      message: emailResult.success
        ? `[${routing.divisionName}] 테스트 알림이 단일 수신처(${routing.recipients.join(", ")})로 성공적으로 발송되었습니다.`
        : `발송 오류: ${emailResult.error}`,
      details: {
        recipients: routing.recipients,
        subject: `[테스트 발송] ${routing.subject}`,
        configuredEmail: settings.unifiedNotificationEmail,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "테스트 발송 처리 실패" },
      { status: 500 }
    );
  }
}
