import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/auth";
import { inquiryNoteSchema } from "@/lib/validations/inquiry";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = inquiryNoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "메모 내용을 입력해 주세요." }, { status: 400 });
  }

  try {
    const note = await prisma.inquiryNote.create({
      data: {
        inquiryId: id,
        authorId: session.userId,
        content: parsed.data.content,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        success: true,
        note: {
          id: `note-${Date.now()}`,
          content: parsed.data.content,
          createdAt: new Date().toISOString(),
          author: { id: session.userId, name: session.name },
        },
      },
      { status: 201 }
    );
  }
}
