import { ProductItem } from "@/lib/data/initial-data";
import { SITE_CONFIG } from "@/lib/seo/config";

export interface SeoDiagnostic {
  criterion: string;
  status: "pass" | "warn" | "fail";
  score: number;
  maxScore: number;
  message: string;
}

export interface NaverSeoAnalysisResult {
  metaTitle: string;
  metaDesc: string;
  keywords: string[];
  seoScore: number;
  grade: "A+" | "A" | "B" | "C";
  diagnostics: SeoDiagnostic[];
  recommendations: string[];
  naverPreview: {
    title: string;
    snippetUrl: string;
    description: string;
    thumbnail: string;
  };
  productSchema: Record<string, any>;
  generatedAt: string;
}

/**
 * Clean & normalize product name for SEO keyword extraction
 */
function cleanProductName(name: string): string {
  return name.replace(/\([^)]*\)/g, "").trim();
}

/**
 * Intelligent Keyword Engine for Naver E-commerce
 */
function extractNaverKeywords(product: Partial<ProductItem>): string[] {
  const keywordsSet = new Set<string>();

  // 1. Mandatory Brand Keywords (Naver C-Rank & Trust Signal)
  keywordsSet.add("CHOKO");
  keywordsSet.add("초코");
  keywordsSet.add("KOKKIRI");
  keywordsSet.add("주식회사 코끼리");
  keywordsSet.add("코끼리몰");

  // 2. Product Name & Core Tokens
  if (product.name) {
    const cleaned = cleanProductName(product.name);
    keywordsSet.add(cleaned);

    const tokens = cleaned
      .split(/[\s,·\/\-_]+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 2);

    tokens.forEach((token) => keywordsSet.add(token));
  }

  // 3. Category Mapping Keywords
  if (product.category) {
    keywordsSet.add(product.category);
    if (/사료|펫|반려|도그/i.test(product.category)) {
      keywordsSet.add("비건사료");
      keywordsSet.add("반려견사료");
      keywordsSet.add("유기농사료");
      keywordsSet.add("알레르기사료");
      keywordsSet.add("강아지눈물사료");
      keywordsSet.add("식물성사료");
    } else if (/화장지|티슈|휴지|페이셜|타월/i.test(product.category)) {
      keywordsSet.add("대나무화장지");
      keywordsSet.add("친환경휴지");
      keywordsSet.add("무형광화장지");
      keywordsSet.add("먼지없는휴지");
      keywordsSet.add("생분해휴지");
      keywordsSet.add("일회용세안타월");
    } else if (/물티슈|위생/i.test(product.category)) {
      keywordsSet.add("프리미엄물티슈");
      keywordsSet.add("편백수물티슈");
      keywordsSet.add("아기물티슈");
      keywordsSet.add("친환경물티슈");
    } else if (/탈취|방향|피톤치드/i.test(product.category)) {
      keywordsSet.add("피톤치드탈취제");
      keywordsSet.add("자연유래탈취제");
      keywordsSet.add("친환경탈취제");
      keywordsSet.add("새집증후군제거");
    }
  }

  // 4. Feature & Spec Tokens
  if (Array.isArray(product.features)) {
    product.features.forEach((feature) => {
      if (/100%|식물성|비건|유기농|대나무|무형광|생분해|KC인증|피톤치드/i.test(feature)) {
        const matches = feature.match(/[가-힣a-zA-Z0-9]{2,10}/g);
        matches?.forEach((m) => {
          if (m.length >= 3 && m.length <= 8) keywordsSet.add(m);
        });
      }
    });
  }

  // 5. Commercial Purchasing Intent Tags for Naver Shopping
  keywordsSet.add("네이버스마트스토어");
  keywordsSet.add("친환경제품추천");
  keywordsSet.add("공식정품");

  return Array.from(keywordsSet).slice(0, 12);
}

/**
 * Generate Naver Search Advisor Optimized Title
 * Naver guideline: 20-38 characters. Front-load primary keyword. Suffix brand.
 */
function generateNaverTitle(product: Partial<ProductItem>): string {
  const name = cleanProductName(product.name || "CHOKO 친환경 제품");
  const brandSuffix = " | CHOKO 코끼리";

  // Check category prefix or hook
  let hook = "";
  if (/사료|펫/i.test(product.category || product.name || "")) {
    hook = "100% 식물성";
  } else if (/화장지|티슈/i.test(product.category || product.name || "")) {
    hook = "친환경 3겹";
  } else if (/타월/i.test(product.category || product.name || "")) {
    hook = "무자극 대나무";
  } else if (/물티슈/i.test(product.category || product.name || "")) {
    hook = "편백수 엠보싱";
  } else if (/탈취/i.test(product.category || product.name || "")) {
    hook = "자연유래 피톤치드";
  }

  // Combine title candidates
  let candidate = hook ? `${name} [${hook}]${brandSuffix}` : `${name}${brandSuffix}`;

  // If candidate is too long for Naver SERP (Naver cuts off at ~40 chars)
  if (candidate.length > 38) {
    candidate = `${name} | CHOKO`;
  }
  if (candidate.length > 38) {
    candidate = `${name.slice(0, 30)} | CHOKO`;
  }
  // Ensure minimum length
  if (candidate.length < 18) {
    candidate = `${name} - 친환경 라이프케어 | CHOKO`;
  }

  return candidate;
}

/**
 * Generate Naver Search Advisor Optimized Description
 * Naver guideline: 60-110 characters. Summarize benefits + trust badges + CTA.
 */
function generateNaverDescription(product: Partial<ProductItem>): string {
  const name = cleanProductName(product.name || "");
  const summary = product.summary || "";
  const featuresText = Array.isArray(product.features) && product.features.length > 0
    ? product.features.slice(0, 2).join(", ")
    : "지속 가능한 친환경 원료와 안전한 제조 공정";

  let cta = "공식 네이버 스마트스토어에서 빠른 배송으로 만나보세요.";

  let candidate = `${name}. ${featuresText}. ${cta}`;

  // Trim or expand to 65 - 110 characters
  if (candidate.length > 115) {
    candidate = `${summary || name}. ${cta}`;
  }
  if (candidate.length > 115) {
    candidate = candidate.slice(0, 110) + "...";
  }
  if (candidate.length < 55) {
    candidate = `주식회사 코끼리의 지속가능한 친환경 브랜드 CHOKO의 ${name}입니다. ${featuresText}. 공식 스토어에서 바로 구매하실 수 있습니다.`;
  }

  return candidate;
}

/**
 * Diagnostic Auditing based on Naver Search Advisor Criteria
 */
function auditNaverCompliance(
  product: Partial<ProductItem>,
  metaTitle: string,
  metaDesc: string,
  keywords: string[]
): { diagnostics: SeoDiagnostic[]; totalScore: number; recommendations: string[] } {
  const diagnostics: SeoDiagnostic[] = [];
  const recommendations: string[] = [];

  // 1. Title Length Check (20-40 characters) - 20 pts
  const titleLen = metaTitle.length;
  if (titleLen >= 18 && titleLen <= 40) {
    diagnostics.push({
      criterion: "네이버 최적화 제목 길이 (20~40자)",
      status: "pass",
      score: 20,
      maxScore: 20,
      message: `현재 ${titleLen}자로 네이버 모바일 및 PC 검색창에 잘림 없이 최적 노출됩니다.`,
    });
  } else if (titleLen > 40) {
    diagnostics.push({
      criterion: "네이버 최적화 제목 길이 (20~40자)",
      status: "warn",
      score: 12,
      maxScore: 20,
      message: `현재 ${titleLen}자로 모바일 네이버 검색에서 말줄임표(...)로 잘릴 수 있습니다.`,
    });
    recommendations.push("제목을 40자 이내로 간결화하여 모바일 가독성을 높이세요.");
  } else {
    diagnostics.push({
      criterion: "네이버 최적화 제목 길이 (20~40자)",
      status: "warn",
      score: 10,
      maxScore: 20,
      message: `현재 ${titleLen}자로 너무 짧습니다. 핵심 키워드를 보강하세요.`,
    });
    recommendations.push("제목에 주요 상품 특징이나 카테고리 키워드를 덧붙여주세요.");
  }

  // 2. Description Quality (50-120 characters) - 20 pts
  const descLen = metaDesc.length;
  if (descLen >= 50 && descLen <= 120) {
    diagnostics.push({
      criterion: "네이버 검색 스니펫 설명문 길이 (50~120자)",
      status: "pass",
      score: 20,
      maxScore: 20,
      message: `현재 ${descLen}자로 네이버 검색 요약 스니펫에 이상적인 길이입니다.`,
    });
  } else if (descLen > 120) {
    diagnostics.push({
      criterion: "네이버 검색 스니펫 설명문 길이 (50~120자)",
      status: "warn",
      score: 12,
      maxScore: 20,
      message: `현재 ${descLen}자로 네이버 스니펫 제한을 초과했습니다.`,
    });
    recommendations.push("설명문을 110자 이내로 축약하여 핵심 혜택 위주로 배치하세요.");
  } else {
    diagnostics.push({
      criterion: "네이버 검색 스니펫 설명문 길이 (50~120자)",
      status: "warn",
      score: 10,
      maxScore: 20,
      message: `현재 ${descLen}자로 다소 짧습니다. 상품 혜택과 구매 안내를 보강하세요.`,
    });
    recommendations.push("설명문에 친환경 인증 정보나 무료배송/공식몰 혜택을 추가하세요.");
  }

  // 3. Brand & Entity Inclusion (CHOKO, KOKKIRI) - 15 pts
  const hasBrand = /CHOKO|초코|코끼리/i.test(metaTitle);
  if (hasBrand) {
    diagnostics.push({
      criterion: "브랜드 키워드 포함 (CHOKO / 코끼리)",
      status: "pass",
      score: 15,
      maxScore: 15,
      message: "브랜드명이 제목에 정확히 반영되어 C-Rank 신뢰도가 상승합니다.",
    });
  } else {
    diagnostics.push({
      criterion: "브랜드 키워드 포함 (CHOKO / 코끼리)",
      status: "fail",
      score: 0,
      maxScore: 15,
      message: "제목에 공식 브랜드명(CHOKO)이 누락되었습니다.",
    });
    recommendations.push("제목 끝에 '| CHOKO' 또는 'CHOKO 공식몰'을 포함하세요.");
  }

  // 4. Keyword Richness (>= 5 keywords) - 15 pts
  if (keywords.length >= 6) {
    diagnostics.push({
      criterion: "타겟 검색 태그 구성 (6개 이상)",
      status: "pass",
      score: 15,
      maxScore: 15,
      message: `${keywords.length}개의 고밀도 네이버 쇼핑 및 검색 키워드가 구성되었습니다.`,
    });
  } else {
    diagnostics.push({
      criterion: "타겟 검색 태그 구성 (6개 이상)",
      status: "warn",
      score: 8,
      maxScore: 15,
      message: `키워드가 ${keywords.length}개로 적습니다.`,
    });
    recommendations.push("소비자 검색 의도(원료, 사용목적, 인증) 키워드를 추가하세요.");
  }

  // 5. High-resolution Main Image - 10 pts
  if (product.mainImage && product.mainImage.length > 5) {
    diagnostics.push({
      criterion: "네이버 오픈그래프/대표 썸네일 이미지",
      status: "pass",
      score: 10,
      maxScore: 10,
      message: "고화질 대표 이미지가 설정되어 네이버 검색 썸네일로 표출됩니다.",
    });
  } else {
    diagnostics.push({
      criterion: "네이버 오픈그래프/대표 썸네일 이미지",
      status: "fail",
      score: 0,
      maxScore: 10,
      message: "대표 이미지가 등록되지 않았습니다.",
    });
    recommendations.push("선명한 제품 사진을 대표 이미지로 지정하세요.");
  }

  // 6. Direct Sales Channel Integration (Naver SmartStore) - 10 pts
  if (product.naverUrl && product.naverUrl.includes("smartstore.naver.com")) {
    diagnostics.push({
      criterion: "네이버 스마트스토어 공식 연동",
      status: "pass",
      score: 10,
      maxScore: 10,
      message: "공식 네이버 스마트스토어 URL이 연동되어 네이버 쇼핑 색인 점수가 최상입니다.",
    });
  } else if (product.coupangUrl || product.naverUrl) {
    diagnostics.push({
      criterion: "네이버 스마트스토어 공식 연동",
      status: "warn",
      score: 6,
      maxScore: 10,
      message: "스토어 링크가 있으나 네이버 스마트스토어 공식 규격이 권장됩니다.",
    });
    recommendations.push("스마트스토어 상품 URL을 정확히 입력하면 구매 전환율이 크게 향상됩니다.");
  } else {
    diagnostics.push({
      criterion: "네이버 스마트스토어 공식 연동",
      status: "warn",
      score: 3,
      maxScore: 10,
      message: "외부 구매 링크(스마트스토어)가 아직 등록되지 않았습니다.",
    });
    recommendations.push("고객이 바로 구매할 수 있도록 스마트스토어 주소를 입력하세요.");
  }

  // 7. Schema.org Product Rich Data Readiness - 10 pts
  if (product.category && (product.features?.length || product.specs?.length)) {
    diagnostics.push({
      criterion: "Schema.org 구조화 데이터 (Product Rich Snippet)",
      status: "pass",
      score: 10,
      maxScore: 10,
      message: "카테고리 및 상세 스펙이 완비되어 JSON-LD 제품 구조화 데이터 생성이 가능합니다.",
    });
  } else {
    diagnostics.push({
      criterion: "Schema.org 구조화 데이터 (Product Rich Snippet)",
      status: "warn",
      score: 5,
      maxScore: 10,
      message: "카테고리 또는 세부 사양 정보가 부족합니다.",
    });
    recommendations.push("카테고리와 주요 스펙(원산지, 용량 등)을 입력하여 검색 품질을 높이세요.");
  }

  const totalScore = diagnostics.reduce((acc, cur) => acc + cur.score, 0);

  return { diagnostics, totalScore, recommendations };
}

/**
 * Main Agent Action: Analyze and synthesize optimal Naver SEO metadata for a product
 */
export function analyzeAndGenerateNaverSeo(
  product: Partial<ProductItem>,
  options?: { preserveExisting?: boolean }
): NaverSeoAnalysisResult {
  const metaTitle =
    options?.preserveExisting && product.metaTitle
      ? product.metaTitle
      : generateNaverTitle(product);

  const metaDesc =
    options?.preserveExisting && product.metaDesc
      ? product.metaDesc
      : generateNaverDescription(product);

  const keywords =
    options?.preserveExisting && Array.isArray(product.keywords) && product.keywords.length > 0
      ? product.keywords
      : extractNaverKeywords(product);

  const { diagnostics, totalScore, recommendations } = auditNaverCompliance(
    product,
    metaTitle,
    metaDesc,
    keywords
  );

  let grade: "A+" | "A" | "B" | "C" = "C";
  if (totalScore >= 95) grade = "A+";
  else if (totalScore >= 85) grade = "A";
  else if (totalScore >= 70) grade = "B";

  const slug = product.slug || "product-detail";
  const snippetUrl = `kokkiri.com > choko > products > ${slug}`;
  const thumbnail = product.mainImage || `${SITE_CONFIG.url}/brand/kokkiri-elephant-logo.png`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: metaTitle,
    description: metaDesc,
    image: thumbnail.startsWith("http") ? thumbnail : `${SITE_CONFIG.url}${thumbnail}`,
    sku: product.id || slug,
    brand: {
      "@type": "Brand",
      name: "CHOKO (주식회사 코끼리)",
    },
    ...(product.naverUrl ? { sameAs: [product.naverUrl] } : {}),
    offers: {
      "@type": "Offer",
      url: `${SITE_CONFIG.url}/choko/products/${slug}`,
      priceCurrency: "KRW",
      price: product.price ? String(product.price) : "0",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: SITE_CONFIG.fullName,
      },
    },
  };

  return {
    metaTitle,
    metaDesc,
    keywords,
    seoScore: totalScore,
    grade,
    diagnostics,
    recommendations,
    naverPreview: {
      title: metaTitle,
      snippetUrl,
      description: metaDesc,
      thumbnail,
    },
    productSchema,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Batch optimize all products for Naver SEO
 */
export function batchOptimizeProductsSeo(products: ProductItem[]): {
  optimized: ProductItem[];
  report: {
    total: number;
    avgScoreBefore: number;
    avgScoreAfter: number;
    gradeCounts: Record<string, number>;
  };
} {
  let scoreBeforeSum = 0;
  let scoreAfterSum = 0;
  const gradeCounts: Record<string, number> = { "A+": 0, A: 0, B: 0, C: 0 };

  const optimized = products.map((prod) => {
    scoreBeforeSum += prod.seoScore || 50;

    const analysis = analyzeAndGenerateNaverSeo(prod, { preserveExisting: false });
    scoreAfterSum += analysis.seoScore;
    gradeCounts[analysis.grade] = (gradeCounts[analysis.grade] || 0) + 1;

    return {
      ...prod,
      metaTitle: analysis.metaTitle,
      metaDesc: analysis.metaDesc,
      keywords: analysis.keywords,
      seoScore: analysis.seoScore,
      seoGeneratedAt: analysis.generatedAt,
    };
  });

  return {
    optimized,
    report: {
      total: products.length,
      avgScoreBefore: Math.round(scoreBeforeSum / (products.length || 1)),
      avgScoreAfter: Math.round(scoreAfterSum / (products.length || 1)),
      gradeCounts,
    },
  };
}
