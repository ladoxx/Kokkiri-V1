import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { getStoredServices, saveService } from "@/lib/data/services-store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand");
  let services = getStoredServices();
  if (brand && (brand === "kokkiri" || brand === "koto" || brand === "choko")) {
    services = services.filter((s) => s.brandSlug === brand);
  }
  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "서비스 제목은 필수 입력 항목입니다." }, { status: 400 });
    }

    const created = saveService(body);
    return NextResponse.json({ success: true, service: created }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating service:", error);
    return NextResponse.json({ error: error.message || "서비스 등록 중 오류 발생" }, { status: 500 });
  }
}
