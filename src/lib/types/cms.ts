export interface NavSubItem {
  id: string;
  label: string;
  href: string;
  desc?: string;
  badge?: string;
  visible: boolean;
}

export interface NavCategoryItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
  visible: boolean;
  items: NavSubItem[];
}

export interface SiteNavigationSettings {
  categories: NavCategoryItem[];
  updatedAt?: string;
}

export interface HeroSectionContent {
  pillBadge: string;
  titleLine1: string;
  titleLine2Highlight: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  stat3Label: string;
  stat3Value: string;
}

export interface BrandCardContent {
  title: string;
  categoryBadge: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export interface SiteContentSettings {
  hero: HeroSectionContent;
  brandSectionTitle: string;
  brandSectionSubtitle: string;
  brands: {
    kokkiri: BrandCardContent;
    koto: BrandCardContent;
    choko: BrandCardContent;
  };
  updatedAt?: string;
}

export const DEFAULT_NAVIGATION: SiteNavigationSettings = {
  categories: [
    {
      id: "about",
      label: "회사 소개",
      href: "/about",
      visible: true,
      items: [
        { id: "about-sub-1", label: "기업 소개 & 철학", href: "/about", desc: "코끼리의 3대 핵심 가치와 연혁", visible: true },
        { id: "about-sub-2", label: "3대 브랜드 생태계", href: "/brands", desc: "KOKKIRI, KOTO, CHOKO 통합 솔루션", visible: true },
        { id: "about-sub-3", label: "뉴스 & 공지사항", href: "/news", desc: "기업 소식, ESG 인증 현황", visible: true },
      ],
    },
    {
      id: "cleaning",
      label: "클리닝 KOKKIRI",
      href: "/cleaning",
      badge: "Cleaning",
      visible: true,
      items: [
        { id: "cl-1", label: "상업 공간 정기 클리닝", href: "/cleaning/services", desc: "리테일, 쇼룸, 복합 상업시설 위생 관리", visible: true },
        { id: "cl-2", label: "오피스 & 사옥 정기 클리닝", href: "/cleaning/services", desc: "친환경 HEPA 필터 및 무소음 정숙 케어", visible: true },
        { id: "cl-3", label: "빌딩 & 대형 건물 종합 클리닝", href: "/cleaning/services", desc: "외벽 로프, 지하주차장 습식 머신 세척", visible: true },
        { id: "cl-4", label: "특수 시설 & 준공 클리닝", href: "/cleaning/services", desc: "인테리어 후 분진 99.9% 포집 제거", visible: true },
        { id: "cl-5", label: "클리닝 시공 실적 & 전후비교", href: "/cleaning/projects", desc: "판교 테크 캠퍼스 등 Before/After 사례", badge: "Before/After", visible: true },
        { id: "cl-6", label: "클리닝 상담 및 문의", href: "/contact", desc: "전문 클리닝 무료 상담 및 서비스 문의", visible: true },
      ],
    },
    {
      id: "koto",
      label: "AI보안·시설 KOTO",
      href: "/koto",
      badge: "AI Security",
      visible: true,
      items: [
        { id: "koto-1", label: "AI 보안 카메라 & 스마트 CCTV", href: "/koto/facility-management", desc: "4K AI 딥러닝 이상 감지 및 실시간 스마트폰 관제", badge: "AI CCTV", visible: true },
        { id: "koto-2", label: "전문 보안 & 시설 경비", href: "/koto/security", desc: "24시간 출입 관제 및 야간 순찰 방범", visible: true },
        { id: "koto-3", label: "기업 조경 & 정원 유지관리", href: "/koto/landscaping", desc: "사계절 수목 전정, 잔디 예초, 병충해 방제", visible: true },
        { id: "koto-4", label: "보안 펜스 & 게이트 시공", href: "/koto/fence", desc: "산업용 메쉬 펜스, 전동 슬라이딩 게이트", visible: true },
        { id: "koto-5", label: "KOTO 프로젝트 & 전후비교", href: "/koto/projects", desc: "인천 물류 허브 등 시공 전후 사례", badge: "Before/After", visible: true },
        { id: "koto-6", label: "AI CCTV & 보안 상담 문의", href: "/contact", desc: "AI CCTV 및 보안 시설 무료 상담 문의", visible: true },
      ],
    },
    {
      id: "choko",
      label: "에코제품 CHOKO",
      href: "/choko",
      badge: "Eco Shop",
      visible: true,
      items: [
        { id: "choko-1", label: "비건 반려견 도그 사료", href: "/choko/products/vegan-dog-food", desc: "100% 식물성 단백질 알레르기 케어", visible: true },
        { id: "choko-2", label: "100% 대나무 롤 화장지", href: "/choko/products/bamboo-toilet-paper", desc: "무형광·무표백 3겹 프리미엄 화장지", visible: true },
        { id: "choko-3", label: "대나무 일회용 타월", href: "/choko/products/bamboo-towels", desc: "항균 대나무 섬유 안심 페이셜 타월", visible: true },
        { id: "choko-4", label: "편백 피톤치드 공간 탈취제", href: "/choko/products/odor-control", desc: "악취 분자 99.6% 자연 유래 탈취", visible: true },
        { id: "choko-5", label: "CHOKO 전체 카탈로그", href: "/choko/products", desc: "네이버 스마트스토어 & 쿠팡 공식 구매", visible: true },
      ],
    },
    {
      id: "projects",
      label: "실적 & 전후비교",
      href: "/projects",
      badge: "NEW",
      visible: true,
      items: [],
    },
    {
      id: "contact",
      label: "문의하기",
      href: "/contact",
      visible: true,
      items: [],
    },
  ],
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_SITE_CONTENT: SiteContentSettings = {
  hero: {
    pillBadge: "KOKKIRI · KOTO · CHOKO 통합 비즈니스 플랫폼",
    titleLine1: "공간의 가치를 높이는",
    titleLine2Highlight: "새로운 기준",
    subtitle: "청소부터 AI 스마트 보안·시설 솔루션까지, 더 나은 공간과 지속 가능한 가치를 만들어갑니다. 기업 맞춤형 위생 케어, 딥러닝 AI CCTV 구축 및 시설 솔루션을 하나의 플랫폼에서 경험하세요.",
    primaryCtaText: "문의하기",
    primaryCtaHref: "/contact",
    secondaryCtaText: "시공 전후 비교 보기",
    secondaryCtaHref: "/projects#before-after",
    stat1Label: "누적 관리 면적",
    stat1Value: "1,200,000㎡+",
    stat2Label: "고객 재계약률",
    stat2Value: "98.6%",
    stat3Label: "시설 무재해 기록",
    stat3Value: "600일+",
  },
  brandSectionTitle: "전문 영역별 3대 브랜드 솔루션",
  brandSectionSubtitle: "클리닝 전문 코끼리, AI 스마트 보안 & 시설 KOTO, 지속 가능한 에코 라이프케어 CHOKO가 상호 시너지를 발휘합니다.",
  brands: {
    kokkiri: {
      title: "프리미엄 클리닝 코끼리",
      categoryBadge: "KOKKIRI CLEANING",
      subtitle: "사옥 · 오피스 · 상업공간 딥 케어",
      description: "인체 무해 친환경 약품과 특수 집진 장비를 활용하여 눈에 보이지 않는 미세 오염까지 완벽히 제거하는 기업 전문 클리닝 솔루션입니다.",
      buttonText: "클리닝 솔루션 둘러보기",
      buttonHref: "/cleaning",
    },
    koto: {
      title: "AI 보안 & 스마트 시설 솔루션",
      categoryBadge: "KOTO AI SECURITY",
      subtitle: "4K AI 지능형 CCTV · 보안 경비 · 조경 · 펜스",
      description: "딥러닝 이상 감지 AI CCTV부터 24시간 보안 경비, 기업 정원 수목 관리, 산업용 펜스 시공까지 기업 시설의 안전과 가치를 지킵니다.",
      buttonText: "KOTO 시설 솔루션 둘러보기",
      buttonHref: "/koto",
    },
    choko: {
      title: "지속 가능한 에코 라이프케어",
      categoryBadge: "CHOKO ECO LIFECARE",
      subtitle: "대나무 롤 화장지 · 비건 펫푸드 · 자연 탈취제",
      description: "100% 천연 대나무 섬유 생활용품과 비건 펫푸드로 일상에 건강한 친환경 가치를 전하는 코끼리의 친환경 소비재 브랜드입니다.",
      buttonText: "CHOKO 공식 스토어 가기",
      buttonHref: "/choko",
    },
  },
  updatedAt: new Date().toISOString(),
};
