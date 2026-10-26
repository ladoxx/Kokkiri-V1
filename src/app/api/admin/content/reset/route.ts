import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/auth";
import { resetSiteContent } from "@/lib/data/content-store";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  const restored = resetSiteContent();

  try {
    revalidatePath("/", "layout");
  } catch {
    // Non-fatal
  }

  return NextResponse.json({
    success: true,
    message: "사이트 콘텐츠 및 문구가 기본값으로 복원되었습니다.",
    content: restored,
  });
}
