import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { resolveInquiryRouting } from "@/lib/data/lead-routing-store";
import { sendEmail, generateInquiryNotificationHtml } from "@/lib/notifications/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const { divisionKey } = await req.json();

    let sampleType = "클리닝 견적 문의";
    let sampleCategory = "프리미엄 오피스 정기 클리닝 (600m²)";
    let sampleCustomer = "테스트 고객 (주식회사 샘플)";
    let sampleMessage = "스마트 리드 라우팅 테스트입니다. 담당 부서 및 대표님(Master BCC)에게 정상 도달하는지 확인합니다.";

    if (divisionKey === "koto") {
      sampleType = "AI 보안 카메라 & CCTV 설치 견적";
      sampleCategory = "4K AI 지능형 CCTV 16대 및 24H 관제";
      sampleCustomer = "테스트 고객 (물류센터 시설팀)";
      sampleMessage = "KOTO AI 보안 라우팅 테스트입니다. 현장 기술팀과 대표님에게 정상 도달하는지 확인합니다.";
    } else if (divisionKey === "chokoAndGeneral") {
      sampleType = "CHOKO 제품 대량 구매/제휴";
      sampleCategory = "대나무 화장지 및 비건 펫푸드 B2B 공급";
      sampleCustomer = "테스트 고객 (리테일 제휴팀)";
      sampleMessage = "CHOKO 라이프케어 라우팅 테스트입니다. 커머스 담당자와 대표님에게 정상 도달하는지 확인합니다.";
    }

    const routing = resolveInquiryRouting({
      inquiryType: sampleType,
      serviceCategory: sampleCategory,
      customerName: sampleCustomer,
      company: "주식회사 샘플 테크",
      location: "서울특별시 강남구 테헤란로 123",
    });

    const emailHtml = generateInquiryNotificationHtml({
      inquiryId: `test-${Date.now()}`,
      customerName: sampleCustomer,
      company: "주식회사 샘플 테크",
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
      bcc: routing.bcc.length > 0 ? routing.bcc : undefined,
      replyTo,
      subject: `[테스트 발송] ${routing.subject}`,
      html: emailHtml,
    });

    return NextResponse.json({
      success: emailResult.success,
      message: emailResult.success
        ? `[${routing.divisionName}] 테스트 알림이 발송되었습니다.`
        : `발송 오류: ${emailResult.error}`,
      details: {
        recipients: routing.recipients,
        bcc: routing.bcc,
        replyTo,
        subject: `[테스트 발송] ${routing.subject}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "테스트 발송 처리 실패" },
      { status: 500 }
    );
  }
}
