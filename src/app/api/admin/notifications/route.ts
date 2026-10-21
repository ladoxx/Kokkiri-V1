import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/auth";
import { processJob } from "@/lib/notifications/queue";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const jobs = await prisma.notificationJob.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        logs: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });

    return NextResponse.json({ success: true, jobs });
  } catch {
    // If DB is empty or during initialization, return empty jobs array
    return NextResponse.json({
      success: true,
      jobs: [],
    });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { jobId } = await req.json();
  if (!jobId) {
    return NextResponse.json({ error: "Job ID가 필요합니다." }, { status: 400 });
  }

  const ok = await processJob(jobId);
  return NextResponse.json({ success: ok, message: ok ? "재전송되었습니다." : "재전송 처리에 실패했습니다." });
}
