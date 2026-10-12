import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { addMediaItem } from "@/lib/data/media-store";
import { getSession } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { error: "업로드할 이미지 파일을 선택해주세요." },
        { status: 400 }
      );
    }

    // Allowed image types
    const validMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
    ];

    if (!validMimeTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: "지원되지 않는 파일 형식입니다. JPG, PNG, WebP, GIF, SVG 이미지만 업로드 가능합니다." },
        { status: 400 }
      );
    }

    // 10MB size limit
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "파일 크기가 너무 큽니다. 10MB 이하의 이미지만 업로드 가능합니다." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate safe filename
    const ext = path.extname(file.name) || `.${file.type.split("/")[1] || "jpg"}`;
    const baseName = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_\-\uAC00-\uD7A3]/g, "_")
      .slice(0, 40);

    const uniqueFilename = `${Date.now()}_${baseName}${ext}`;
    const targetFilePath = path.join(uploadDir, uniqueFilename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(targetFilePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    const mediaItem = addMediaItem({
      id: `media-${Date.now()}`,
      url: publicUrl,
      filename: uniqueFilename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      category: category as any,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      mediaItem,
      message: "이미지가 성공적으로 업로드되었습니다.",
    });
  } catch (err: any) {
    console.error("[UPLOAD API ERROR]", err);
    return NextResponse.json(
      { error: err.message || "이미지 업로드 중 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
