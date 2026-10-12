import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { getSmtpConfig, saveSmtpConfig, verifySmtpConnection, SmtpConfig } from "@/lib/config/smtp-store";
import { sendEmail } from "@/lib/notifications/email";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const config = getSmtpConfig();
  // Return masked password for security
  return NextResponse.json({
    config: {
      ...config,
      passMasked: config.pass ? "••••••••••••" : "",
      hasPassword: !!config.pass,
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, config, sendTestTo } = body;

    const current = getSmtpConfig();
    const updatedConfig: Partial<SmtpConfig> = {
      host: config.host || current.host,
      port: Number(config.port) || current.port,
      secure: typeof config.secure === "boolean" ? config.secure : current.secure,
      user: config.user || current.user,
      from: config.from || current.from,
      adminNotificationEmail: config.adminNotificationEmail || current.adminNotificationEmail,
      kakaoApiKey: config.kakaoApiKey ?? current.kakaoApiKey,
      kakaoSenderKey: config.kakaoSenderKey ?? current.kakaoSenderKey,
      kakaoTestMode: config.kakaoTestMode ?? current.kakaoTestMode,
    };

    // If a new password was typed (and not the mask string), update password
    if (config.pass && config.pass !== "••••••••••••") {
      updatedConfig.pass = config.pass;
    }

    if (action === "verify") {
      const verifyResult = await verifySmtpConnection(updatedConfig);
      return NextResponse.json(verifyResult);
    }

    if (action === "send_test") {
      // First save or test
      const target = sendTestTo || updatedConfig.adminNotificationEmail || session.email;
      const testResult = await sendEmail({
        to: target,
        subject: "[KOKKIRI] SMTP 연동 테스트 메일입니다.",
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #202622; background: #f8f8f4; border-radius: 12px;">
            <h2 style="color: #173F30; margin-top: 0;">[KOKKIRI] SMTP 연동 테스트 성공</h2>
            <p>관리자 센터에서 설정한 SMTP 서버를 통해 성공적으로 발송된 확인 메일입니다.</p>
            <div style="margin: 16px 0; padding: 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
              <div><strong>발송 호스트:</strong> ${updatedConfig.host}:${updatedConfig.port}</div>
              <div><strong>발신 계정:</strong> ${updatedConfig.user}</div>
              <div><strong>발송 시각:</strong> ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</div>
            </div>
            <p style="color: #477B56; font-weight: bold;">✓ 실시간 고객 문의 접수 시 해당 설정으로 관리자 알림이 즉시 전송됩니다.</p>
          </div>
        `,
      });
      return NextResponse.json(testResult);
    }

    // Default action: save
    const saved = saveSmtpConfig(updatedConfig);
    return NextResponse.json({
      success: true,
      message: "SMTP 및 알림 연동 설정이 성공적으로 저장되었습니다.",
      config: {
        ...saved,
        passMasked: saved.pass ? "••••••••••••" : "",
        hasPassword: !!saved.pass,
      },
    });
  } catch (error: any) {
    console.error("Error updating SMTP settings:", error);
    return NextResponse.json(
      { success: false, error: error.message || "설정 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
