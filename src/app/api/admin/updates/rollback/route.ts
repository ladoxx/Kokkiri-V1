import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { rollbackToRestorePoint } from "@/lib/data/updates-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const { snapshotId } = await req.json();
    if (!snapshotId) {
      return NextResponse.json({ error: "롤백할 스냅샷 ID가 누락되었습니다." }, { status: 400 });
    }

    const result = await rollbackToRestorePoint(snapshotId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "롤백 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
