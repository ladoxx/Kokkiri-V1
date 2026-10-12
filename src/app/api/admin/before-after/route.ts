import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { getStoredBeforeAfterItems, saveBeforeAfterItem } from "@/lib/data/before-after-store";

export async function GET() {
  const items = getStoredBeforeAfterItems();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "사례 제목은 필수 항목입니다." }, { status: 400 });
    }

    const created = saveBeforeAfterItem(body);
    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating before-after case:", error);
    return NextResponse.json({ error: error.message || "시공 전후 사례 등록 중 오류 발생" }, { status: 500 });
  }
}
