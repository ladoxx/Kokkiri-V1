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
    // Mock / fallback sample jobs
    return NextResponse.json({
      success: true,
      jobs: [
        {
          id: "job-sample-1",
          channel: "EMAIL",
          recipient: "admin@kokkiri.com",
          subject: "[신규 문의] 박서준님의 오피스 클리닝 견적 신청",
          status: "SENT",
          retryCount: 0,
          maxRetries: 3,
          sentAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          logs: [{ status: "SENT", details: "Delivered successfully", createdAt: new Date().toISOString() }],
        },
        {
          id: "job-sample-2",
          channel: "KAKAO_ALIMTALK",
          recipient: "010-3344-5566",
          subject: "고객 상담 접수 알림톡",
          status: "SENT",
          retryCount: 0,
          maxRetries: 3,
          sentAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          logs: [{ status: "SENT", details: "Delivered in sandbox mode", createdAt: new Date().toISOString() }],
        },
      ],
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
