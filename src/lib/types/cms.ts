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

export interface HomeAboutSectionContent {
  pillBadge: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  linkText: string;
  linkHref: string;
  point1Title: string;
  point1Desc: string;
  point2Title: string;
  point2Desc: string;
  point3Title: string;
  point3Desc: string;
  point4Title: string;
  point4Desc: string;
}

export interface BrandPageContent {
  pillBadge: string;
  headline: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  sectionTitle: string;
  faqs: { question: string; answer: string }[];
}

export interface ChokoPageContent {
  pillBadge: string;
  headline: string;
  description: string;
  ctaText: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
}

export interface AboutPageContent {
  pillBadge: string;
  headline: string;
  subtitle: string;
  valuesTitle: string;
  value1Title: string;
  value1Desc: string;
  value2Title: string;
  value2Desc: string;
  value3Title: string;
  value3Desc: string;
  ctaText: string;
}

export interface ContactPageContent {
  pillBadge: string;
  title: string;
  description: string;
  cardTitle: string;
  formTitle: string;
  formSubtitle: string;
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
  homeAbout: HomeAboutSectionContent;
  cleaning: BrandPageContent;
  koto: BrandPageContent;
  choko: ChokoPageContent;
  about: AboutPageContent;
  contact: ContactPageContent;
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
  homeAbout: {
    pillBadge: "About KOKKIRI",
    title: "공간을 깊이 이해하고, 가치를 지속시키는 파트너",
    paragraph1: "주식회사 코끼리는 기업 공간의 위생 클리닝부터 AI 지능형 보안 카메라 & 스마트 시설 솔루션, 그리고 친환경 소비재 브랜드에 이르기까지 전문화된 세 가지 핵심 사업 영역을 유기적으로 연결합니다.",
    paragraph2: "단순한 청소와 관리를 넘어, 공간을 이용하는 사람들의 건강과 업무 생산성, 그리고 고객사의 자산 가치를 지속 가능하게 보존하는 체계적인 관리 프로토콜을 지향합니다.",
    linkText: "코끼리 비즈니스 철학 더 알아보기",
    linkHref: "/about",
    point1Title: "전문 직영 관리제",
    point1Desc: "하청에 의존하지 않는 정규 교육 수료 전문 인력과 전담 현장 매니저 중심의 책임 시공제",
    point2Title: "친환경 안전 프로토콜",
    point2Desc: "인체 무해 인증 세제 및 탄소 배출 저감 장비 활용으로 실내 공기질과 안전 동시 확보",
    point3Title: "지속 가능한 자산 보호",
    point3Desc: "초기 마감재의 내구성을 보호하는 정밀 코팅 및 사후 유지보수 연계 솔루션",
    point4Title: "디지털 품질 리포팅",
    point4Desc: "작업 전후 체크리스트와 공정 사진이 포함된 투명한 월간 업무 보고서 디지털 제공",
  },
  cleaning: {
    pillBadge: "KOKKIRI Corporate Cleaning",
    headline: "공간의 품격을 완성하는 프리미엄 클리닝 솔루션",
    description: "코끼리는 단순한 청소를 넘어, 공간의 자산 가치를 보존하고 임직원과 고객 모두에게 안전하고 쾌적한 위생 환경을 제공합니다.",
    primaryCtaText: "클리닝 무료 상담 & 문의하기",
    secondaryCtaText: "서비스 전체보기",
    sectionTitle: "코끼리 전문 클리닝 분야",
    faqs: [
      {
        question: "정기 클리닝은 어떻게 진행되나요?",
        answer: "사전 무료 현장 실사를 통해 공간 구조, 바닥 마감재 및 오염도를 진단한 후 최적의 주기(일간/주간/월간)와 맞춤 작업 공정표를 수립하여 전담 직영 매니저가 체계적으로 진행합니다.",
      },
      {
        question: "병원이나 클리닉 등 의료 시설 청소도 가능한가요?",
        answer: "네, 가능합니다. 코끼리는 병의원 위생 가이드라인에 맞춘 무독성 친환경 소독 약품과 HEPA 필터 집진 장비를 사용하여 진료실, 대기실, 검사실 위생 환경을 철저히 케어합니다.",
      },
      {
        question: "클리닝 서비스가 가능한 지역은 어디인가요?",
        answer: "파주, 문산, 운정, 일산, 고양, 김포, 서울 및 경기도 수도권 전역에 전문 직영 인력이 신속하게 방문 실사 및 정기 클리닝을 제공합니다.",
      },
      {
        question: "현장 방문 실사와 견적 산출은 무료인가요?",
        answer: "네, 100% 무료입니다. 온라인 또는 대표번호로 신청해 주시면 담당 매니저가 직접 사업장을 방문하여 실측 후 24시간 이내에 세부 견적서를 발송해 드립니다.",
      },
    ],
  },
  koto: {
    pillBadge: "KOTO AI Security & Facility Solutions",
    headline: "인공지능과 첨단 기술로 자산의 완벽한 보안을 실현합니다",
    description: "딥러닝 AI 지능형 보안 카메라(CCTV) 설계·시공부터 24시간 전문 보안 경비, 기업 조경 관리, 외곽 보안 펜스까지 안전하고 체계적인 시설 솔루션을 제공합니다.",
    primaryCtaText: "AI CCTV & 시설 무료 견적 신청",
    secondaryCtaText: "KOTO 솔루션 전체보기",
    sectionTitle: "KOTO 핵심 보안 & 시설 솔루션",
    faqs: [
      {
        question: "AI 보안 카메라(CCTV)의 주요 기능은 무엇인가요?",
        answer: "단순 녹화를 넘어 딥러닝 AI 기반으로 침입, 배회, 쓰러짐, 화재 연기 등을 실시간 감지하여 관제 센터와 스마트폰으로 즉각 알림을 전송하는 지능형 시스템입니다.",
      },
      {
        question: "기업 사옥 및 공장 외곽 펜스 시공도 가능한가요?",
        answer: "네, 메쉬 펜스, 능형망, 보안용 전동 슬라이딩 게이트 등 산업 및 상업 시설 외곽 경계 방범 펜스를 전문 시공합니다.",
      },
      {
        question: "기업 정원 및 조경 유지관리는 어떤 주기로 진행되나요?",
        answer: "사계절 수목 전정, 잔디 예초, 제초 작업, 수목 병충해 방제 등 조경 기사 자격증 보유 인력이 사업장 환경에 맞춰 연간 정기 관리 플랜을 제공합니다.",
      },
      {
        question: "현장 실사와 시공 견적은 무료인가요?",
        answer: "네, 수도권 전역 전문 엔지니어가 직접 방문하여 카메라 화각, 조경 상태, 펜스 라인을 정밀 실측한 후 100% 무료로 상세 견적서를 작성해 드립니다.",
      },
    ],
  },
  choko: {
    pillBadge: "CHOKO Eco Lifecare Brand",
    headline: "지속 가능한 내일을 위한 건강한 친환경 라이프케어",
    description: "100% 천연 대나무 롤 화장지 & 일회용 페이셜 타월, 반려견을 위한 비건 영양 포뮬러 사료, 편백 피톤치드 공간 탈취제로 당신과 지구를 위한 지속 가능한 일상을 만듭니다.",
    ctaText: "전체 에코 제품 카탈로그 보기",
    pillar1Title: "100% 대나무 펄프 & 섬유",
    pillar1Desc: "나무 벌목 없이 빠르게 자라는 대나무만을 사용하여 산림을 보호하고 자연 생분해되는 친환경 원자재를 고집합니다.",
    pillar2Title: "100% 비건 클린 포뮬러",
    pillar2Desc: "동물성 원료와 인공 첨가물을 철저히 배제하고, 수의 영양학 기준을 충족하는 식물성 단백질 슈퍼푸드로 설계합니다.",
    pillar3Title: "무형광·무표백 안심 기준",
    pillar3Desc: "유해 화학물질을 일체 첨가하지 않아 민감한 피부의 가족과 반려동물 모두 안심하고 사용할 수 있는 위생 기준을 엄격히 적용합니다.",
  },
  about: {
    pillBadge: "Company Philosophy",
    headline: "공간의 품격을 높이고 지속 가능한 내일을 만듭니다",
    subtitle: "코끼리는 프리미엄 클리닝과 첨단 AI 스마트 보안 및 공간 관리를 넘어, 고객의 소중한 비즈니스 공간이 최상의 가치와 생산성을 발휘할 수 있도록 돕는 통합 공간 솔루션 파트너입니다.",
    valuesTitle: "코끼리가 지켜가는 3대 핵심 가치",
    value1Title: "철저한 표준과 안전",
    value1Desc: "검증된 전문 직영 인력과 산업 안전 보건 프로토콜을 엄격히 준수하여 무사고·무결점 관리를 원칙으로 합니다.",
    value2Title: "책임감 있는 파트너십",
    value2Desc: "고객사의 업무 환경과 운영 특성을 깊이 분석하여 가장 효율적이고 경제적인 맞춤 관리 솔루션을 장기적으로 제안합니다.",
    value3Title: "지속 가능한 환경 경영",
    value3Desc: "친환경 생분해 약품과 탄소 저감형 설비를 우선 도입하여 사람과 자연이 함께 숨 쉬는 건강한 공간을 지향합니다.",
    ctaText: "맞춤 솔루션 상담 & 문의하기",
  },
  contact: {
    pillBadge: "Contact & Support",
    title: "고객센터 & 상담 문의",
    description: "서비스 상담, 제휴 문의, 채용 관련 등 궁금하신 점을 남겨주시면 담당 부서에서 신속하고 정확하게 안내해 드립니다.",
    cardTitle: "고객 상담 안내",
    formTitle: "온라인 문의 접수",
    formSubtitle: "문의 내용을 남겨주시면 담당자가 검토 후 등록하신 연락처 또는 이메일로 답변드립니다.",
  },
  updatedAt: new Date().toISOString(),
};
