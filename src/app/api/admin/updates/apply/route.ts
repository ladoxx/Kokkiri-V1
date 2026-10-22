import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { applySystemUpdate } from "@/lib/data/updates-store";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const result = await applySystemUpdate();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "업데이트 적용 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
