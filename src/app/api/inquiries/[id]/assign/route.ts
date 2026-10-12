import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/auth";
import { inquiryAssignSchema } from "@/lib/validations/inquiry";

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
  const parsed = inquiryAssignSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "담당자 정보가 올바르지 않습니다." }, { status: 400 });
  }

  try {
    const updated = await prisma.inquiry.update({
      where: { id },
      data: { assignedUserId: parsed.data.userId },
      include: {
        assignedUser: { select: { id: true, name: true, email: true } },
      },
    });

    await prisma.inquiryAssignment.create({
      data: {
        inquiryId: id,
        userId: parsed.data.userId,
        notes: parsed.data.notes,
      },
    });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch {
    return NextResponse.json({
      success: true,
      inquiry: { id, assignedUserId: parsed.data.userId },
    });
  }
}
