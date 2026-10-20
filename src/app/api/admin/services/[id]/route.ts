import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { getServiceById, saveService, deleteService } from "@/lib/data/services-store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const service = getServiceById(id);
  if (!service) {
    return NextResponse.json({ error: "서비스를 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({ service });
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
  const existing = getServiceById(id);
  if (!existing) {
    return NextResponse.json({ error: "서비스를 찾을 수 없습니다." }, { status: 404 });
  }

  try {
    const body = await req.json();
    const updated = saveService({ ...body, id });
    return NextResponse.json({ success: true, service: updated });
  } catch (error: any) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: error.message || "서비스 수정 중 오류 발생" }, { status: 500 });
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
  const deleted = deleteService(id);
  if (!deleted) {
    return NextResponse.json({ error: "해당 서비스를 찾을 수 없거나 삭제에 실패했습니다." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "서비스가 성공적으로 삭제되었습니다." });
}
