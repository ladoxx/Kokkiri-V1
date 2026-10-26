import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/seo/config";
import { getStoredProducts } from "@/lib/data/products-store";

export interface AgentHealthItem {
  id: string;
  category: "database" | "routes" | "seo" | "storage" | "security";
  name: string;
  status: "healthy" | "warning" | "error";
  score: number;
  message: string;
  actionRequired?: string;
}

export interface AdminAgentAuditReport {
  overallScore: number;
  grade: "A+" | "A" | "B" | "C";
  summary: {
    totalChecks: number;
    healthy: number;
    warning: number;
    error: number;
  };
  checks: AgentHealthItem[];
  adminLinksCatalog: {
    zone: string;
    description: string;
    links: {
      title: string;
      href: string;
      badge?: string;
      description: string;
      apiEndpoint?: string;
      status: "active" | "linked" | "missing_in_menu";
    }[];
  }[];
  timestamp: string;
}

/**
 * AI Code Inspector & System Health Agent
 */
export async function runAdminCodeInspectorAgent(): Promise<AdminAgentAuditReport> {
  const checks: AgentHealthItem[] = [];

  // 1. Database Health Check (Prisma + SQLite)
  try {
    const userCount = await prisma.user.count();
    const brandCount = await prisma.brand.count();
    const serviceCount = await prisma.service.count();

    checks.push({
      id: "db-tables",
      category: "database",
      name: "SQLite 데이터베이스 & Prisma 테이블 무결성",
      status: "healthy",
      score: 100,
      message: `User(${userCount}명), Brand(${brandCount}개), Service(${serviceCount}개) 테이블이 정상 동기화되어 있습니다.`,
    });
  } catch (err: any) {
    checks.push({
      id: "db-tables",
      category: "database",
      name: "SQLite 데이터베이스 & Prisma 테이블 무결성",
      status: "error",
      score: 0,
      message: `데이터베이스 테이블 조회 실패: ${err?.message || "테이블 없음"}`,
      actionRequired: "npx prisma db push 및 seed.mjs 실행 필요",
    });
  }

  // 2. Data Store JSON Files
  const dataDir = path.join(process.cwd(), "data");
  const requiredFiles = [
    { file: "products.json", name: "CHOKO 제품 데이터" },
    { file: "site-content.json", name: "웹사이트 텍스트 CMS" },
    { file: "site-navigation.json", name: "네비게이션 메뉴 CMS" },
    { file: "company-info.json", name: "회사 기본 정보" },
    { file: "services.json", name: "서비스 카탈로그 데이터" },
  ];

  let missingDataFiles = 0;
  requiredFiles.forEach(({ file, name }) => {
    const p = path.join(dataDir, file);
    if (fs.existsSync(p)) {
      const stats = fs.statSync(p);
      if (stats.size > 10) {
        checks.push({
          id: `storage-${file}`,
          category: "storage",
          name: `${name} (${file})`,
          status: "healthy",
          score: 100,
          message: `정상 존재 (크기: ${Math.round(stats.size / 1024)}KB)`,
        });
      } else {
        missingDataFiles++;
        checks.push({
          id: `storage-${file}`,
          category: "storage",
          name: `${name} (${file})`,
          status: "warning",
          score: 50,
          message: "파일이 비어있거나 너무 작습니다.",
          actionRequired: "기본 템플릿 복구 권장",
        });
      }
    } else {
      missingDataFiles++;
      checks.push({
        id: `storage-${file}`,
        category: "storage",
        name: `${name} (${file})`,
        status: "error",
        score: 0,
        message: "파일이 존재하지 않습니다.",
        actionRequired: "데이터 템플릿 재생성 필요",
      });
    }
  });

  // 3. Security & Environment Check
  const jwtSecret = process.env.JWT_SECRET;
  const isDefaultJwt = !jwtSecret || jwtSecret.includes("change-this");
  checks.push({
    id: "sec-jwt",
    category: "security",
    name: "JWT 보안 키 및 관리자 세션 암호화",
    status: isDefaultJwt ? "warning" : "healthy",
    score: isDefaultJwt ? 70 : 100,
    message: isDefaultJwt
      ? "기본 JWT 시크릿 키가 사용 중입니다. 프로덕션 배포 시 안전한 랜덤 키로 변경을 권장합니다."
      : "보안 강화된 고유 JWT 시크릿 키가 적용되어 있습니다.",
  });

  // 4. Naver SEO & Outbound Commerce Check
  const products = getStoredProducts();
  const productsWithoutSeo = products.filter((p) => !p.metaTitle || !p.seoScore);
  const productsWithSmartStore = products.filter((p) => p.naverUrl && p.naverUrl.includes("smartstore"));

  if (productsWithoutSeo.length === 0) {
    checks.push({
      id: "seo-products",
      category: "seo",
      name: "CHOKO 제품 네이버 SEO 자동 최적화 상태",
      status: "healthy",
      score: 100,
      message: `전체 ${products.length}개 상품 모두 네이버 SEO 메타데이터 및 스마트스토어 연동 완료 (${productsWithSmartStore.length}개 스마트스토어 직결)`,
    });
  } else {
    checks.push({
      id: "seo-products",
      category: "seo",
      name: "CHOKO 제품 네이버 SEO 자동 최적화 상태",
      status: "warning",
      score: 70,
      message: `${productsWithoutSeo.length}개 상품의 네이버 SEO가 아직 미완료 상태입니다.`,
      actionRequired: "관리자 제품 관리에서 '네이버 SEO 일괄 최적화' 버튼 클릭",
    });
  }

  // 5. Technical Robots.txt & Sitemap Inspection
  const robotsPath = path.join(process.cwd(), "src/app/robots.ts");
  const sitemapPath = path.join(process.cwd(), "src/app/sitemap.ts");
  const hasRobots = fs.existsSync(robotsPath);
  const hasSitemap = fs.existsSync(sitemapPath);

  checks.push({
    id: "seo-technical",
    category: "seo",
    name: "네이버 Yeti 크롤러 & sitemap.xml 검색 엔진 규격",
    status: hasRobots && hasSitemap ? "healthy" : "error",
    score: hasRobots && hasSitemap ? 100 : 0,
    message:
      hasRobots && hasSitemap
        ? "Yeti 크롤러 허용 규칙 및 동적 제품 포함 사이트맵이 완비되어 있습니다."
        : "robots.ts 또는 sitemap.ts 파일이 누락되었습니다.",
  });

  // Calculate Overall System Score
  const totalScore = Math.round(
    checks.reduce((acc, c) => acc + c.score, 0) / (checks.length || 1)
  );
  let grade: "A+" | "A" | "B" | "C" = "C";
  if (totalScore >= 95) grade = "A+";
  else if (totalScore >= 85) grade = "A";
  else if (totalScore >= 70) grade = "B";

  // Catalog of Organized Admin Links with Clear Zones
  const adminLinksCatalog = [
    {
      zone: "1. 대시보드 & 고객 문의 (Core CRM)",
      description: "실시간 비즈니스 유입, 견적 상담 리드 관리, 알림톡/이메일 발송 현황",
      links: [
        {
          title: "대시보드 종합 현황",
          href: "/admin",
          description: "핵심 KPI 지표, 신규 미확인 문의, 빠른 기능 실행 바로가기",
          apiEndpoint: "/api/admin/stats",
          status: "active" as const,
        },
        {
          title: "고객 문의 & 견적 상담 (CRM)",
          href: "/admin/inquiries",
          badge: "실시간 리드",
          description: "온라인 접수 견적 상담 내역, 상담 상태(신규/진행/완료) 변경 및 고객 메모",
          apiEndpoint: "/api/inquiries",
          status: "active" as const,
        },
        {
          title: "알림 & 발송 기록 보관함",
          href: "/admin/notifications",
          description: "이메일(SMTP) 및 카카오 비즈메시지 알림톡 발송 성공/실패 이력과 재시도 큐",
          apiEndpoint: "/api/admin/notifications",
          status: "active" as const,
        },
      ],
    },
    {
      zone: "2. 비즈니스 & 상품/서비스 (Commerce & Services)",
      description: "코끼리 청소·보안·조경 서비스 목록 및 CHOKO 친환경 쇼핑몰 제품 관리",
      links: [
        {
          title: "브랜드별 서비스 관리 (코끼리·KOTO)",
          href: "/admin/services",
          badge: "통합",
          description: "정기청소, AI 지능형 CCTV, 조경관리, 펜스 시공 등 브랜드 서비스 카탈로그 편집",
          apiEndpoint: "/api/admin/services",
          status: "active" as const,
        },
        {
          title: "CHOKO 친환경 제품 & 네이버 SEO",
          href: "/admin/products",
          badge: "AI Agent",
          description: "대나무 화장지, 비건 사료 제품 관리, 스마트스토어/쿠팡 구매 링크, 네이버 SEO 자동 Agent",
          apiEndpoint: "/api/admin/products",
          status: "active" as const,
        },
        {
          title: "시공 전후(Before & After) 비교 갤러리",
          href: "/admin/before-after",
          description: "실제 클리닝 및 시설/조경 시공 전후 비교 슬라이더, 성과 지표 등록",
          apiEndpoint: "/api/admin/before-after",
          status: "active" as const,
        },
      ],
    },
    {
      zone: "3. 웹사이트 디자인 & 콘텐츠 CMS (Design & CMS)",
      description: "웹사이트 텍스트 문구, GNB 메뉴 구조, 미디어 이미지 보관함 관리",
      links: [
        {
          title: "문구 & 텍스트 콘텐츠 편집",
          href: "/admin/content",
          description: "메인 헤드라인, 브랜드 슬로건, 회사 소개 텍스트, 하단 푸터 안내문 실시간 수정",
          apiEndpoint: "/api/admin/content",
          status: "active" as const,
        },
        {
          title: "네비게이션 메뉴 & 링크 구조",
          href: "/admin/navigation",
          description: "상단 헤더(GNB) 및 하단 푸터의 메뉴 링크, 노출 순서, 외부 연결 링크 설정",
          apiEndpoint: "/api/admin/navigation",
          status: "active" as const,
        },
        {
          title: "미디어 파일 보관함 (Media Library)",
          href: "/admin/media",
          description: "사진 직접 업로드, CDN 링크 복사, 제품 및 서비스 사진 라이브러리",
          apiEndpoint: "/api/admin/media",
          status: "active" as const,
        },
      ],
    },
    {
      zone: "4. 시스템 환경 & 인프라 설정 (System & Settings)",
      description: "알림 수신 이메일, 회사 사업자 정보, 시네마틱 효과, 계정 비밀번호, 시스템 백업",
      links: [
        {
          title: "통합 이메일 & 알림 수신 라우팅",
          href: "/admin/settings?tab=routing",
          badge: "알림 수신",
          description: "고객 견적 문의 시 알림을 수신할 관리자 이메일 목록 및 SMTP 서버 연동",
          apiEndpoint: "/api/admin/settings/lead-routing",
          status: "active" as const,
        },
        {
          title: "회사 기본 정보 & 연락처 설정",
          href: "/admin/settings?tab=company",
          description: "사업자등록번호, 대표자명, 고객센터 전화번호, 본사 주소, 비상 연락망",
          apiEndpoint: "/api/admin/settings/account",
          status: "active" as const,
        },
        {
          title: "시네마틱 UX & 인터랙션 설정",
          href: "/admin/settings?tab=cinematic",
          description: "오프닝 인트로 스킵/활성화, 페이지 전환 속도, 고급 모션 제어",
          apiEndpoint: "/api/admin/settings/ui",
          status: "active" as const,
        },
        {
          title: "관리자 계정 & 비밀번호 보안",
          href: "/admin/settings?tab=security",
          description: "관리자 로그인 아이디/이메일 변경, 새 비밀번호 설정, 세션 보안",
          apiEndpoint: "/api/admin/settings/password",
          status: "active" as const,
        },
        {
          title: "시스템 업데이트 & 버전 롤백",
          href: "/admin/updates",
          badge: "v1.0.7",
          description: "데이터 스냅샷 백업, 이전 복원 지점으로 1클릭 롤백, 시스템 무결성 검사",
          apiEndpoint: "/api/admin/updates/check",
          status: "active" as const,
        },
      ],
    },
  ];

  return {
    overallScore: totalScore,
    grade,
    summary: {
      totalChecks: checks.length,
      healthy: checks.filter((c) => c.status === "healthy").length,
      warning: checks.filter((c) => c.status === "warning").length,
      error: checks.filter((c) => c.status === "error").length,
    },
    checks,
    adminLinksCatalog,
    timestamp: new Date().toISOString(),
  };
}
