import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { getProductById, saveProduct, deleteProduct } from "@/lib/data/products-store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "제품을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({ product });
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
  const existing = getProductById(id);
  if (!existing) {
    return NextResponse.json({ error: "제품을 찾을 수 없습니다." }, { status: 404 });
  }

  try {
    const body = await req.json();
    const updated = saveProduct({ ...body, id });
    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: error.message || "제품 수정 중 오류 발생" }, { status: 500 });
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
  const deleted = deleteProduct(id);
  if (!deleted) {
    return NextResponse.json({ error: "해당 제품을 찾을 수 없거나 삭제에 실패했습니다." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "제품이 성공적으로 삭제되었습니다." });
}
