import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { sendEmail } from "@/lib/notifications/email";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { targetEmail } = await req.json();
  const recipient = targetEmail || session.email;

  const result = await sendEmail({
    to: recipient,
    subject: "[KOKKIRI] SMTP 발송 테스트 메일입니다.",
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #202622;">
        <h2 style="color: #173F30;">[KOKKIRI] SMTP 알림 시스템 테스트</h2>
        <p>코끼리 관리자 센터에서 정상적으로 발송된 테스트 이메일입니다.</p>
        <p>발송 시각: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</p>
        <p>수신자: <strong>${recipient}</strong></p>
        <div style="margin-top: 20px; padding: 12px; background: #e8f5e9; border-radius: 6px; color: #173F30; font-weight: bold;">
          ✓ SMTP 서버와의 통신이 원활합니다.
        </div>
      </div>
    `,
  });

  if (result.success) {
    return NextResponse.json({ success: true, message: `${recipient} (으)로 테스트 메일이 발송되었습니다.` });
  } else {
    return NextResponse.json({ success: false, error: result.error || "발송 실패" }, { status: 500 });
  }
}
