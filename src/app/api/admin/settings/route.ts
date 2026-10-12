import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { getCompanyInfo, saveCompanyInfo } from "@/lib/data/company-store";

export async function GET() {
  const info = getCompanyInfo();
  return NextResponse.json({ company: info });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = saveCompanyInfo(body);
    return NextResponse.json({ success: true, company: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "설정 저장 실패" }, { status: 500 });
  }
}
