import { NextRequest, NextResponse } from "next/server";
import { getMediaItemById, deleteMediaItem } from "@/lib/data/media-store";
import { getSession } from "@/lib/auth/auth";
import { unlink } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const item = getMediaItemById(id);

    if (!item) {
      return NextResponse.json({ error: "해당 미디어를 찾을 수 없습니다." }, { status: 404 });
    }

    // If file was uploaded to /uploads/..., remove physical file as well
    if (item.url.startsWith("/uploads/")) {
      try {
        const filePath = path.join(process.cwd(), "public", item.url.replace(/^\//, ""));
        await unlink(filePath);
      } catch (fileErr) {
        console.warn("Could not delete physical file:", fileErr);
      }
    }

    deleteMediaItem(id);

    return NextResponse.json({
      success: true,
      message: "미디어가 성공적으로 삭제되었습니다.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "미디어 삭제 실패" },
      { status: 500 }
    );
  }
}
