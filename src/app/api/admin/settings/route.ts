import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

    try {
      revalidatePath("/", "layout");
      revalidatePath("/about");
      revalidatePath("/contact");
      revalidatePath("/privacy");
      revalidatePath("/terms");
    } catch {
      // Non-fatal if called outside request cache context
    }

    return NextResponse.json({ success: true, company: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "설정 저장 실패" }, { status: 500 });
  }
}
