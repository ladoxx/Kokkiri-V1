import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import {
  getSiteNavigation,
  saveSiteNavigation,
} from "@/lib/data/navigation-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  const nav = getSiteNavigation();
  return NextResponse.json({ success: true, navigation: nav });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = saveSiteNavigation(body);
    return NextResponse.json({
      success: true,
      message: "네비게이션 메뉴 구성이 성공적으로 저장되었습니다.",
      navigation: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "메뉴 저장 중 오류 발생" },
      { status: 500 }
    );
  }
}
