import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { getUiSettings, saveUiSettings } from "@/lib/data/ui-settings-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = getUiSettings();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = saveUiSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "설정 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
