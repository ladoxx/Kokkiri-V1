import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { analyzeAndGenerateNaverSeo } from "@/lib/seo/agent/naver-seo-agent";
import { getStoredProducts, batchOptimizeAllStoredProducts } from "@/lib/data/products-store";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const products = getStoredProducts();
  const total = products.length;
  const optimizedCount = products.filter((p) => (p.seoScore || 0) >= 80).length;
  const avgScore =
    total > 0
      ? Math.round(products.reduce((acc, p) => acc + (p.seoScore || 0), 0) / total)
      : 0;

  return NextResponse.json({
    total,
    optimizedCount,
    avgScore,
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      metaTitle: p.metaTitle,
      metaDesc: p.metaDesc,
      seoScore: p.seoScore || 0,
      seoGeneratedAt: p.seoGeneratedAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const action = body.action || "generate";

    if (action === "batch-optimize") {
      const result = batchOptimizeAllStoredProducts();
      return NextResponse.json({
        success: true,
        message: `총 ${result.report.total}개 상품의 네이버 SEO가 성공적으로 일괄 최적화되었습니다.`,
        report: result.report,
        products: result.products,
      });
    }

    if (action === "generate") {
      const product = body.product;
      if (!product || !product.name) {
        return NextResponse.json(
          { error: "제품 정보(제품명)가 필요합니다." },
          { status: 400 }
        );
      }

      const result = analyzeAndGenerateNaverSeo(product, {
        preserveExisting: body.preserveExisting ?? false,
      });

      return NextResponse.json({
        success: true,
        data: result,
      });
    }

    return NextResponse.json({ error: "알 수 없는 요청 액션입니다." }, { status: 400 });
  } catch (error: any) {
    console.error("Error in Naver SEO Agent API:", error);
    return NextResponse.json(
      { error: error.message || "네이버 SEO 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
