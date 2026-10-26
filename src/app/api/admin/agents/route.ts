import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { runAdminCodeInspectorAgent } from "@/lib/agents/admin-agents";
import { batchOptimizeAllStoredProducts } from "@/lib/data/products-store";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const report = await runAdminCodeInspectorAgent();
    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error("Admin Agent Inspection Error:", error);
    return NextResponse.json(
      { error: error?.message || "에이전트 검사 중 오류 발생" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const action = body.action || "inspect";

    if (action === "inspect") {
      const report = await runAdminCodeInspectorAgent();
      return NextResponse.json({
        success: true,
        message: "시스템 전체 코드 및 상태 검사가 완료되었습니다.",
        report,
      });
    }

    if (action === "optimize-seo") {
      const result = batchOptimizeAllStoredProducts();
      return NextResponse.json({
        success: true,
        message: `총 ${result.report.total}개 상품의 네이버 SEO가 성공적으로 일괄 최적화되었습니다.`,
        report: result.report,
      });
    }

    if (action === "verify-db") {
      const userCount = await prisma.user.count();
      const productCount = await prisma.product.count();
      return NextResponse.json({
        success: true,
        message: `데이터베이스 연결 정상 확인 완료 (사용자 ${userCount}명, 제품 ${productCount}개)`,
        stats: { userCount, productCount },
      });
    }

    return NextResponse.json({ error: "알 수 없는 요청 액션입니다." }, { status: 400 });
  } catch (error: any) {
    console.error("Admin Agent Action Error:", error);
    return NextResponse.json(
      { error: error?.message || "에이전트 작업 실행 중 오류 발생" },
      { status: 500 }
    );
  }
}
