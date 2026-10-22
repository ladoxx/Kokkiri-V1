import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { getUpdateSettings, saveUpdateSettings } from "@/lib/data/updates-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const settings = getUpdateSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "설정 조회 실패" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const saved = saveUpdateSettings(body);
    return NextResponse.json({
      success: true,
      message: "업데이트 및 Coolify 연동 설정이 저장되었습니다.",
      settings: saved,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "설정 저장 실패" },
      { status: 500 }
    );
  }
}
