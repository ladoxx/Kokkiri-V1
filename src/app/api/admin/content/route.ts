import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/auth";
import { getSiteContent, saveSiteContent } from "@/lib/data/content-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  const content = getSiteContent();
  return NextResponse.json({ success: true, content });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = saveSiteContent(body);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/cleaning");
      revalidatePath("/koto");
      revalidatePath("/choko");
      revalidatePath("/about");
      revalidatePath("/contact");
    } catch {
      // Non-fatal cache revalidation notice
    }

    return NextResponse.json({
      success: true,
      message: "사이트 콘텐츠 및 문구가 성공적으로 저장되었습니다.",
      content: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "콘텐츠 저장 중 오류 발생" },
      { status: 500 }
    );
  }
}
