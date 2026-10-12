import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { resetSiteNavigation } from "@/lib/data/navigation-store";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  const restored = resetSiteNavigation();
  return NextResponse.json({
    success: true,
    message: "메뉴 설정이 기본값으로 초기화되었습니다.",
    navigation: restored,
  });
}
