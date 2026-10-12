import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import {
  getLeadRoutingSettings,
  saveLeadRoutingSettings,
} from "@/lib/data/lead-routing-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  const settings = getLeadRoutingSettings();
  return NextResponse.json({ success: true, settings });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = saveLeadRoutingSettings(body);
    return NextResponse.json({
      success: true,
      message: "리드 라우팅 및 다중 이메일 수신 설정이 성공적으로 저장되었습니다.",
      settings: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "설정 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
