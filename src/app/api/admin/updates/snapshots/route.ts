import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import {
  listRestorePoints,
  createRestorePoint,
  deleteRestorePoint,
} from "@/lib/data/updates-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const snapshots = listRestorePoints();
    return NextResponse.json({ success: true, snapshots });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "스냅샷 목록 조회 실패" },
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
    const body = await req.json().catch(() => ({}));
    const note = body.note || "관리자 수동 백업";
    const snapshot = createRestorePoint("manual", note);
    return NextResponse.json({
      success: true,
      message: `성공적으로 새로운 복원 지점(${snapshot.id})이 생성되었습니다.`,
      snapshot,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "스냅샷 생성 실패" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "삭제할 스냅샷 ID가 누락되었습니다." }, { status: 400 });
    }

    const deleted = deleteRestorePoint(id);
    return NextResponse.json({
      success: deleted,
      message: deleted ? "복원 지점이 성공적으로 삭제되었습니다." : "해당 복원 지점을 찾을 수 없습니다.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "스냅샷 삭제 실패" },
      { status: 500 }
    );
  }
}
