export interface KakaoAlimtalkPayload {
  templateCode: string;
  recipientPhone: string;
  senderPhone?: string;
  content: string;
  buttons?: Array<{
    name: string;
    type: "WL" | "AL";
    url_mobile: string;
    url_pc?: string;
  }>;
}

export interface KakaoSendResult {
  success: boolean;
  messageId?: string;
  providerCode?: string;
  error?: string;
}

export async function sendKakaoAlimtalk(payload: KakaoAlimtalkPayload): Promise<KakaoSendResult> {
  const isTestMode = process.env.KAKAO_TEST_MODE !== "false";
  const apiUrl = process.env.KAKAO_API_URL || "https://api.bizmessage.kakao.com/v1";
  const apiKey = process.env.KAKAO_API_KEY;
  const senderKey = process.env.KAKAO_SENDER_KEY;
  const senderPhone = process.env.KAKAO_SENDER_PHONE || "02-1588-0000";

  // If in test mode or credentials are not yet configured by the business owner:
  if (isTestMode || !apiKey || !senderKey) {
    console.log(`[KAKAO ALIMTALK SANDBOX] Message queued to ${payload.recipientPhone}`);
    console.log(`[KAKAO ALIMTALK SANDBOX] Template: ${payload.templateCode}`);
    console.log(`[KAKAO ALIMTALK SANDBOX] Content: ${payload.content.substring(0, 100)}...`);
    return {
      success: true,
      messageId: `kakao-sandbox-${Date.now()}`,
      providerCode: "SANDBOX_SUCCESS",
    };
  }

  try {
    const response = await fetch(`${apiUrl}/send/alimtalk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Sender-Key": senderKey,
      },
      body: JSON.stringify({
        sender: senderPhone,
        receiver: payload.recipientPhone.replace(/[^0-9]/g, ""),
        template_code: payload.templateCode,
        message: payload.content,
        buttons: payload.buttons,
      }),
    });

    const resJson = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: resJson.message || `HTTP ${response.status}`,
        providerCode: resJson.code,
      };
    }

    return {
      success: true,
      messageId: resJson.message_id || resJson.msg_id || `msg-${Date.now()}`,
      providerCode: "SUCCESS",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[KAKAO ALIMTALK ERROR] Failed to send Alimtalk:", errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
}

export function formatInquiryAlimtalkContent(data: {
  customerName: string;
  phone: string;
  inquiryType: string;
  createdAt: Date | string;
}): string {
  const formattedDate = new Date(data.createdAt).toLocaleDateString("ko-KR");
  return `[KOKKIRI 고객 상담 접수 완료]
안녕하세요, ${data.customerName}님.
코끼리 비즈니스 플랫폼에 문의해 주셔서 대단히 감사합니다.

■ 문의 구분: ${data.inquiryType}
■ 접수 일자: ${formattedDate}
■ 연락처: ${data.phone}

담당 전문 매니저가 내용을 검토한 후 업무 시간(평일 09:00~18:00) 내에 신속히 유선 또는 이메일로 안내해 드리겠습니다.

감사합니다.
주식회사 코끼리 고객지원센터`;
}
