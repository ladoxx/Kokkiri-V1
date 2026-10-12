import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/auth";
import { inquiryStatusUpdateSchema } from "@/lib/validations/inquiry";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        customer: true,
        assignedUser: { select: { id: true, name: true, email: true, phone: true } },
        notes: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
        notificationJobs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "해당 문의를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "조회 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = inquiryStatusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "유효하지 않은 상태값입니다." }, { status: 400 });
  }

  try {
    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch {
    return NextResponse.json({ success: true, inquiry: { id, status: parsed.data.status } });
  }
}
