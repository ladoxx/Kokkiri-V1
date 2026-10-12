import { NextRequest, NextResponse } from "next/server";
import { getStoredMediaItems, addMediaItem } from "@/lib/data/media-store";
import { getSession } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = (searchParams.get("q") || "").toLowerCase().trim();

    let items = getStoredMediaItems();

    if (category && category !== "all") {
      items = items.filter((i) => i.category === category);
    }

    if (query) {
      items = items.filter(
        (i) =>
          i.originalName.toLowerCase().includes(query) ||
          i.filename.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      media: items,
      total: items.length,
    });
  } catch (err: any) {
    console.error("[MEDIA GET ERROR]", err);
    return NextResponse.json(
      { error: "미디어 목록을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { url, name, category } = body;

    if (!url) {
      return NextResponse.json({ error: "이미지 URL이 필요합니다." }, { status: 400 });
    }

    const mediaItem = addMediaItem({
      id: `media-${Date.now()}`,
      url,
      filename: url.split("/").pop() || "image.jpg",
      originalName: name || "등록된 이미지",
      mimeType: "image/jpeg",
      size: 0,
      category: category || "general",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      mediaItem,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "미디어 등록 실패" },
      { status: 500 }
    );
  }
}
