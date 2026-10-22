import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { checkSystemUpdates } from "@/lib/data/updates-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const updateInfo = await checkSystemUpdates();
    return NextResponse.json({ success: true, ...updateInfo });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "업데이트 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
