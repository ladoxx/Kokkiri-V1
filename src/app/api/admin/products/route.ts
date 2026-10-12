import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { getStoredProducts, saveProduct } from "@/lib/data/products-store";

export async function GET() {
  const products = getStoredProducts();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "제품명은 필수 항목입니다." }, { status: 400 });
    }

    const created = saveProduct(body);
    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: error.message || "제품 등록 중 오류 발생" }, { status: 500 });
  }
}
