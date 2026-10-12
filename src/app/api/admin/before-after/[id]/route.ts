import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { getBeforeAfterItemById, saveBeforeAfterItem, deleteBeforeAfterItem } from "@/lib/data/before-after-store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = getBeforeAfterItemById(id);
  if (!item) {
    return NextResponse.json({ error: "해당 사례를 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({ item });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const existing = getBeforeAfterItemById(id);
  if (!existing) {
    return NextResponse.json({ error: "해당 사례를 찾을 수 없습니다." }, { status: 404 });
  }

  try {
    const body = await req.json();
    const updated = saveBeforeAfterItem({ ...body, id });
    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    console.error("Error updating before-after case:", error);
    return NextResponse.json({ error: error.message || "시공 전후 수정 중 오류 발생" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const deleted = deleteBeforeAfterItem(id);
  if (!deleted) {
    return NextResponse.json({ error: "해당 사례를 찾을 수 없거나 삭제에 실패했습니다." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "시공 전후 사례가 성공적으로 삭제되었습니다." });
}
