export interface BrandItem {
  id: string;
  slug: "kokkiri" | "koto" | "choko";
  name: string;
  nameKo: string;
  slogan: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  surfaceColor: string;
  accentColor: string;
  badge: string;
  heroHeadline: string;
  heroSubheadline: string;
}

export interface ServiceItem {
  id: string;
  brandSlug: "kokkiri" | "koto" | "choko";
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  features: string[];
  processSteps: { step: string; title: string; desc: string }[];
  isFeatured: boolean;
  order: number;
}

export interface ProjectItem {
  id: string;
  brandSlug: "kokkiri" | "koto";
  title: string;
  category: string;
  client: string;
  location: string;
  completedDate: string;
  summary: string;
  description: string;
  results: string[];
  coverImage: string;
  isFeatured: boolean;
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  mainImage: string;
  galleryImages: string[];
  naverUrl: string;
  coupangUrl: string;
  isFeatured: boolean;
  price?: number | string;
  metaTitle?: string;
  metaDesc?: string;
  keywords?: string[];
  seoScore?: number;
  seoGeneratedAt?: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readTime: string;
}

export const BRANDS: BrandItem[] = [
  {
    id: "brand-kokkiri",
    slug: "kokkiri",
    name: "KOKKIRI",
    nameKo: "코끼리",
    slogan: "공간의 가치를 높이는 프리미엄 클리닝 솔루션",
    description:
      "상업 공간, 오피스, 대형 빌딩 및 특수 시설을 위한 기업 맞춤형 전문 클리닝 서비스입니다. 체계적인 위생 관리 프로토콜과 친환경 전문 장비를 기반으로 공간의 품격을 완성합니다.",
    primaryColor: "#173F30",
    secondaryColor: "#477B56",
    surfaceColor: "#F8F8F4",
    accentColor: "#65A377",
    badge: "Corporate & Cleaning",
    heroHeadline: "공간의 가치를 높이는\n새로운 기준, 코끼리",
    heroSubheadline:
      "체계적인 정기 클리닝부터 대규모 사옥 관리까지, 기업 공간에 최적화된 맞춤형 위생 솔루션을 제안합니다.",
  },
  {
    id: "brand-koto",
    slug: "koto",
    name: "KOTO",
    nameKo: "코토",
    slogan: "신뢰와 첨단 기술 기반의 AI 보안 카메라 & 시설 솔루션",
    description:
      "AI 지능형 보안 카메라(CCTV) 설계 및 구축, 전문 보안 경비, 조경 식재 및 정원 유지관리, 펜스 시공까지 기업 자산의 안전과 외곽 보안을 책임지는 테크니컬 브랜드입니다.",
    primaryColor: "#243A50",
    secondaryColor: "#526B80",
    surfaceColor: "#F2F5F7",
    accentColor: "#3E82B8",
    badge: "AI Security & Facility",
    heroHeadline: "자산의 지속성과 안전을 지키는\nAI 보안 & 전문 시설 솔루션, KOTO",
    heroSubheadline:
      "AI 지능형 CCTV 설치 및 구축, 전문 보안 경비, 프리미엄 조경 및 펜스 시공까지 일원화된 통합 솔루션을 제공합니다.",
  },
  {
    id: "brand-choko",
    slug: "choko",
    name: "CHOKO",
    nameKo: "초코",
    slogan: "자연과 일상이 공존하는 지속 가능한 라이프케어",
    description:
      "비건 반려견 사료, 친환경 대나무 화장지, 대나무 일회용 타월, 프리미엄 물티슈 및 자연 유래 탈취제 등 지구와 일상 모두를 배려하는 에코 라이프스타일 소비재 브랜드입니다.",
    primaryColor: "#8C6C43",
    secondaryColor: "#5E7652",
    surfaceColor: "#F4EFE5",
    accentColor: "#B89366",
    badge: "Eco & Lifestyle Products",
    heroHeadline: "자연을 담은 순수한 일상,\n지속 가능한 에코 라이프케어 CHOKO",
    heroSubheadline:
      "지구를 생각하는 대나무 소재 제품군과 건강한 비건 펫케어로 당신과 가족의 하루를 더 쾌적하게 가꿉니다.",
  },
];

export const SERVICES: ServiceItem[] = [
  // KOKKIRI SERVICES
  {
    id: "srv-commercial-cleaning",
    brandSlug: "kokkiri",
    slug: "commercial-cleaning",
    title: "상업 공간 정기 클리닝",
    subtitle: "Commercial Space Cleaning",
    summary: "리테일, 쇼룸, 복합 상업시설을 위한 맞춤형 정기 위생 관리 프로그램입니다.",
    description:
      "고객의 방문이 빈번한 상업 공간은 브랜드 첫인상을 결정짓습니다. 코끼리는 고유한 공간 동선과 바닥재 특성을 분석하여 최적의 주기별 클리닝 스케줄을 수립하고 전담 매니저 체제로 안정적인 퀄리티를 유지합니다.",
    features: [
      "매장 오픈 전/마감 후 비영업 시간 맞춤 케어",
      "고급 대리석, 에폭시, 타일 등 바닥재 전용 약제 사용",
      "주기별 심층 왁스코팅 및 정기 고압세척",
      "월간 품질 점검 리포트 및 전담 CS 매니저 배정",
    ],
    processSteps: [
      { step: "01", title: "현장 실사 및 진단", desc: "공간 면적, 바닥 마감재, 유동인구 특성 정밀 분석" },
      { step: "02", title: "맞춤 플랜 수립", desc: "일일/주간/월간 단위 세부 작업 프로세스 설계" },
      { step: "03", title: "전문 인력 투입", desc: "본사 직무 교육을 이수한 숙련된 전담 위생 전문가 투입" },
      { step: "04", title: "품질 검수 & 리포트", desc: "체크리스트 기반 디지털 모니터링 및 주기별 보고서 제공" },
    ],
    isFeatured: true,
    order: 1,
  },
  {
    id: "srv-office-cleaning",
    brandSlug: "kokkiri",
    slug: "office-cleaning",
    title: "오피스 & 사옥 정기 클리닝",
    subtitle: "Corporate Office Cleaning",
    summary: "임직원의 업무 집중도와 건강을 고려한 친환경 스마트 오피스 위생 솔루션입니다.",
    description:
      "현대적인 오피스는 쾌적한 실내 공기와 정돈된 환경이 생산성에 직결됩니다. 코끼리는 친환경 무독성 인증 세제와 미세먼지 차단 HEPA 필터 장비를 도입하여 업무에 지장이 없는 최적의 시간대에 무소음 정숙 관리를 진행합니다.",
    features: [
      "개인 업무 데스크 및 공용 회의실 집중 케어",
      "탕비실, 카페테리아, 화장실 살균 소독 시스템",
      "공기질 개선을 위한 고성능 HEPA 공조 클리닝",
      "분리수거 및 폐기물 전문 집하 관리",
    ],
    processSteps: [
      { step: "01", title: "오피스 프로파일링", desc: "부서별 배치 및 보안 구역, 업무 스케줄 확인" },
      { step: "02", title: "비인가 구역 보안 서약", desc: "보안 유지 서약서 체결 및 출입증 발급 절차 준수" },
      { step: "03", title: "정숙 위생 케어", desc: "심야 또는 조기 출근 시간대 무소음·친환경 케어 진행" },
      { step: "04", title: "만족도 피드백", desc: "월간 담당자 인터뷰 및 개선 사항 즉각 반영" },
    ],
    isFeatured: true,
    order: 2,
  },
  {
    id: "srv-building-cleaning",
    brandSlug: "kokkiri",
    slug: "building-cleaning",
    title: "빌딩 & 대형 건물 종합 클리닝",
    subtitle: "Building & Facility Care",
    summary: "중대형 빌딩의 로비, 외벽, 계단, 지하주차장 등 공용 공간의 완벽한 유지보수입니다.",
    description:
      "건물의 장기적인 자산 가치 유지를 위해 외벽 로프 작업부터 지하 주차장 물청소, 에스컬레이터 및 엘리베이터 정밀 세척까지 산업안전보건 기준을 엄격히 준수하는 전문 장비팀이 투입됩니다.",
    features: [
      "고층 외벽 유리창 및 석재 패널 로프 클리닝",
      "지하주차장 탑승식 습식 바닥 청소차 운용",
      "비상계단 및 옥상 방수층 보호 청소",
      "산업안전보건법 기준 안전 관리 책임자 상주",
    ],
    processSteps: [
      { step: "01", title: "안전 진단", desc: "고소 작업 및 특수 장비 투입을 위한 안전성 평가" },
      { step: "02", title: "공용 구역 통제 안내", desc: "입주사 불편 최소화를 위한 사전 통제 공지" },
      { step: "03", title: "고성능 중장비 가동", desc: "산업용 바닥세정기 및 특수 고압세척 장비 가동" },
      { step: "04", title: "최종 검수 및 승인", desc: "고객사 현장 관리 책임자 입회 하에 작업 완료 확인" },
    ],
    isFeatured: true,
    order: 3,
  },
  {
    id: "srv-facility-cleaning",
    brandSlug: "kokkiri",
    slug: "facility-cleaning",
    title: "특수 시설 & 준공 클리닝",
    subtitle: "Specialized & Post-Construction",
    summary: "신축/리모델링 준공 청소, 전산실, 물류센터 등 고난도 특수 공간 전문 클리닝입니다.",
    description:
      "인테리어 공사 후 발생하는 미세 시멘트 분진, 페인트 자국, 실리콘 잔여물을 완벽히 제거하는 준공 클리닝과 정전기 방지 바닥 케어가 필요한 데이터센터 및 물류센터 특화 솔루션을 제공합니다.",
    features: [
      "준공 후 입주 전 분진 99.9% 포집 제거",
      "전산실·서버룸 무정전 바닥 정밀 세척 및 왁싱",
      "물류센터 에폭시 바닥 라인마킹 및 기름때 제거",
      "새집증후군 방지 피톤치드 광촉매 살균 소독",
    ],
    processSteps: [
      { step: "01", title: "현장 오염도 측정", desc: "분진 및 유해 물질 농도 측정 및 작업 계획 수립" },
      { step: "02", title: "보호 보양 작업", desc: "주요 마감재 및 센서 장비 손상 방지 보양재 시공" },
      { step: "03", title: "단계별 분진 제거", desc: "상부 배관부터 하부 바닥까지 입체적 클리닝" },
      { step: "04", title: "공간 살균 케어", desc: "인체 무해 친환경 소독 및 최종 실내 공기질 확인" },
    ],
    isFeatured: false,
    order: 4,
  },

  // KOTO SERVICES
  {
    id: "srv-ai-cctv",
    brandSlug: "koto",
    slug: "facility-management",
    title: "AI 보안 카메라 & 스마트 CCTV 설치",
    subtitle: "AI Security Camera & Smart CCTV System",
    summary: "초고화질 AI 딥러닝 기반 침입·이상 행동 감지 및 24시간 실시간 스마트폰 모니터링 스마트 CCTV 시스템 구축입니다.",
    description:
      "단순 녹화를 넘어 최첨단 AI 영상 분석 알고리즘을 탑재하여 침입, 이상 배회, 화재 연기, 쓰러짐 등 위험 요소를 실시간으로 감지하고 관제 센터 및 스마트폰으로 즉시 알림을 전송하는 차세대 보안 솔루션입니다. 사옥, 공장, 물류창고, 상가 등 현장 맞춤형 사각지대 제로 카메라 설계와 정밀 배선 시공을 제공합니다.",
    features: [
      "AI 딥러닝 영상 분석 (침입·배회·이상 행동 실시간 감지)",
      "4K Ultra HD 초고화질 적외선(IR) 야간 투시 카메라 시공",
      "스마트폰 전용 앱 실시간 원격 모니터링 및 위험 즉각 푸시 알림",
      "클라우드 & 대용량 NVR 암호화 보안 녹화 저장 시스템",
    ],
    processSteps: [
      { step: "01", title: "현장 보안 진단", desc: "사각지대 정밀 분석 및 최적 카메라 화각 설계" },
      { step: "02", title: "AI 시스템 설계", desc: "초고화질 AI 카메라 및 PoE NVR 네트워크 맞춤 구성" },
      { step: "03", title: "전문 배선 및 설치", desc: "깔끔한 은폐 배선 공사 및 고성능 보안 카메라 정밀 시공" },
      { step: "04", title: "AI 감지 세팅 및 인계", desc: "스마트폰 앱 연동, 실시간 알림 테스트 후 고객 인계" },
    ],
    isFeatured: true,
    order: 5,
  },
  {
    id: "srv-security",
    brandSlug: "koto",
    slug: "security",
    title: "보안 & 시설 경비 서비스",
    subtitle: "Corporate Security & Patrol",
    summary: "자산과 인명의 안전을 책임지는 철저한 출입 통제 및 24시간 전문 보안 경비 시스템입니다.",
    description:
      "공식 허가를 획득한 전문 경비 지도사의 엄격한 교육 체계를 거친 보안 요원들이 사업장 내외의 위해 요소를 사전에 차단하고 내방객에게 품격 있는 안내 서비스를 제공합니다.",
    features: [
      "사업장 정문 출입 보안 및 내방객 신원 확인 시스템",
      "주차 관제 및 사내 차량 유도 발렛 시스템 지원",
      "CCTV 관제 및 심야 취약 구역 순찰 강화",
      "화재·침입 등 비상사태 대응 행동 매뉴얼 상시 훈련",
    ],
    processSteps: [
      { step: "01", title: "보안 취약점 진단", desc: "외곽 펜스, 비상구, 사각지대 종합 보안 평가" },
      { step: "02", title: "보안 인력 배치 계획", desc: "거점별 경비 초소 및 동선별 순찰 주기 편성" },
      { step: "03", title: "직무 & 서비스 교육", desc: "보안 법규 준수, 응급처치(CPR), 고객 응대 교육" },
      { step: "04", title: "스마트 일지 기록", desc: "실시간 순찰 태그 및 디지털 출입 관리 시스템 운용" },
    ],
    isFeatured: true,
    order: 6,
  },
  {
    id: "srv-landscaping",
    brandSlug: "koto",
    slug: "landscaping",
    title: "기업 조경 & 정원 유지관리",
    subtitle: "Commercial Landscape & Green Care",
    summary: "사옥 정원, 옥상 녹화, 조경 수목의 사계절 맞춤 전정 및 병충해 방제 관리입니다.",
    description:
      "건축물의 품격을 완성하는 조경 공간을 건강하고 아름답게 유지합니다. 전문 조경 기사의 체계적인 수목 전지, 잔디 깎기, 계절별 시비 및 병해충 방제로 사계절 내내 푸르른 녹지 공간을 보장합니다.",
    features: [
      "수종별 최적 생육 시기 맞춤 수목 전정(가지치기)",
      "천연 잔디 제초, 에어레이션 및 정기 예초 작업",
      "친환경 식물 보호제를 활용한 정기 병충해 방제",
      "사계절 초화류 식재 및 화단 계절 테마 연출",
    ],
    processSteps: [
      { step: "01", title: "수목 건강 진단", desc: "토양 산도, 수세(樹勢), 병충해 감염 여부 진단" },
      { step: "02", title: "연간 조경 캘린더", desc: "봄 시비, 여름 예초, 가을 전정, 겨울 보온 계획 수립" },
      { step: "03", title: "조경 전문팀 시공", desc: "전문 장비와 숙련된 정원사를 통한 정밀 작업" },
      { step: "04", title: "가뭄·태풍 대비 관리", desc: "자동 관수 시스템 점검 및 지주목 보강 작업" },
    ],
    isFeatured: true,
    order: 7,
  },
  {
    id: "srv-fence",
    brandSlug: "koto",
    slug: "fence",
    title: "보안 펜스 & 외곽 차단 시공",
    subtitle: "Perimeter Fencing & Barrier Systems",
    summary: "사업장 경계 보호 및 자산 보안을 위한 고내구성 산업용·디자인 펜스 설계 및 시공입니다.",
    description:
      "공장 부지, 물류창고, 공공시설 및 고급 주거단지 외곽의 경계를 명확히 하고 무단 침입을 차단하는 메쉬 펜스, 아트 펜스, 방음벽 및 자동 게이트 설치와 유지보수를 원스톱으로 지원합니다.",
    features: [
      "고내식 용융 아연 도금 및 분체 도장 펜스 시공",
      "사업장 용도별 맞춤형 디자인 (메쉬, 주물, 보안 펜스)",
      "차량 및 보행자용 전동 슬라이딩 게이트 연동",
      "기존 노후 펜스 철거 및 신속 보수 교체 지원",
    ],
    processSteps: [
      { step: "01", title: "지형 측량 및 설계", desc: "경계선 확인 및 지반 강도에 따른 기초 공법 결정" },
      { step: "02", title: "자재 선별 및 가공", desc: "기후 조건에 견디는 정품 규격 강재 및 부자재 준비" },
      { step: "03", title: "기초 타설 및 조립", desc: "콘크리트 기초 앵커링 및 수평·수직 정밀 조립" },
      { step: "04", title: "품질 검사 및 인계", desc: "흔들림 테스트, 도장 피막 검사 후 준공 보고서 교부" },
    ],
    isFeatured: false,
    order: 8,
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "prj-pangyo-tech",
    brandSlug: "kokkiri",
    title: "판교 IT 복합 캠퍼스 정기 클리닝 & 위생 통합 관리",
    category: "오피스 클리닝",
    client: "판교 글로벌 IT 테크 센터",
    location: "경기도 성남시 분당구",
    completedDate: "2025.12 - 현재 진행형",
    summary: "연면적 45,000㎡ 대규모 테크 사옥의 2,000여 명 임직원을 위한 24시간 스마트 위생 관리",
    description:
      "24시간 서버 가동 및 교대 근무가 이루어지는 판교 IT 캠퍼스의 특성을 반영하여, 부서별 탄력적 클리닝 프로토콜을 도입했습니다. 무소음 청소 장비와 친환경 세제를 적용하여 업무 방해 제로를 달성했습니다.",
    results: [
      "임직원 실내 위생 환경 만족도 96.8% 기록",
      "HEPA 필터 클리닝 시스템 도입으로 실내 미세먼지 42% 저감",
      "재활용 폐기물 분리 선별률 92% 달성",
    ],
    coverImage: "/images/projects/project-office-tech.jpg",
    isFeatured: true,
  },
  {
    id: "prj-gangnam-tower",
    brandSlug: "kokkiri",
    title: "강남 테헤란로 프라임 오피스 빌딩 준공 및 종합 관리",
    category: "빌딩 종합 관리",
    client: "강남 G-프라임 타워",
    location: "서울특별시 강남구 테헤란로",
    completedDate: "2025.08",
    summary: "지하 6층~지상 28층 신축 프라임 오피스 준공 후 입주사 전담 정기 케어 수주",
    description:
      "신축 건축 후 잔류하는 시멘트 미세분진을 3단계 흡진 시스템으로 완벽히 제거하고, 프리미엄 천연 대리석 로비와 통유리 파사드의 광택을 복원하는 특수 마감 작업을 성공적으로 완수했습니다.",
    results: [
      "준공 승인 직후 14일 만에 28개 층 완전 무분진 검수 통과",
      "이탈리아산 천연 대리석 크리스탈라이징 보호 코팅 시공",
      "주요 금융 입주사 8개사 장기 서비스 계약 연계",
    ],
    coverImage: "/images/projects/project-building-tower.jpg",
    isFeatured: true,
  },
  {
    id: "prj-incheon-logistics",
    brandSlug: "koto",
    title: "인천 첨단 물류 허브 AI 지능형 CCTV & 보안 관제 시스템 구축",
    category: "AI 보안 카메라",
    client: "인천 메가 물류 코어",
    location: "인천광역시 서구 청라동",
    completedDate: "2025.04 - 현재",
    summary: "대지면적 80,000㎡ 초대형 자동화 물류센터 외곽 사각지대 제로 4K AI 지능형 CCTV 시스템 구축",
    description:
      "일일 수천 대의 화물 차량이 오가는 첨단 물류 허브에 AI 딥러닝 영상 분석 카메라를 설치하고, 야간 침입 감지 및 스마트폰 즉각 경보 시스템을 연동한 최첨단 통합 보안 솔루션을 성공적으로 구축했습니다.",
    results: [
      "사각지대 0% 전 구역 4K AI 적외선 스마트 CCTV 감시망 확보",
      "야간 무단 침입 실시간 감지 및 관제 경보율 99.8% 달성",
      "차량 번호판 자동 인식으로 출입 관제 효율 40% 향상",
    ],
    coverImage: "/images/projects/project-logistics-hub.jpg",
    isFeatured: true,
  },
  {
    id: "prj-yongin-rd-landscape",
    brandSlug: "koto",
    title: "용인 바이오 R&D 연구단지 힐링 수목 조경 & 보안 펜스",
    category: "조경 및 펜스",
    client: "용인 미래의학 연구단지",
    location: "경기도 용인시 처인구",
    completedDate: "2025.10",
    summary: "연구원 힐링 테마 정원 조성, 소나무 전정 및 2.4km 외곽 보안 펜스 완공",
    description:
      "연구원들의 창의적 휴식을 위한 산책로와 테마 정원을 조성하고, 연구 보안을 위해 외곽 경계 2.4km 전 구간에 침입 방지 감지 센서가 내장된 고내구성 분체도장 메쉬 펜스를 정밀 시공했습니다.",
    results: [
      "수령 30년 이상 주요 조경수 120주 보존 전정 완료",
      "외곽 침입 감지 연동형 고강도 보안 펜스 2.4km 완공",
      "사계절 자생 야생화 군락지 조성으로 친환경 인증 획득",
    ],
    coverImage: "/images/projects/project-landscape-park.jpg",
    isFeatured: true,
  },
];

export const PRODUCTS: ProductItem[] = [
  {
    id: "prod-vegan-dog-food",
    slug: "vegan-dog-food",
    name: "초코 퓨어 플랜트 비건 도그 사료 (1.8kg)",
    category: "비건 펫푸드",
    summary: "육류 알레르기 걱정 없는 100% 식물성 단백질과 유기농 슈퍼푸드로 설계된 프리미엄 비건 사료",
    description:
      "눈물 자국, 식이 알레르기, 피부 가려움으로 고민하는 반려견을 위해 수의 영양학 전문가와 함께 완성했습니다. GMO Free 렌틸콩, 완두콩, 귀리, 유기농 아마씨를 황금 비율로 배합하여 균형 잡힌 아미노산과 필수 오메가 지방산을 공급합니다.",
    features: [
      "100% 식물성 클린 포뮬러 (동물성 원료 0%)",
      "AAFCO(미국사료협회) 전 연령 영양 기준 충족",
      "눈물 자국 및 알레르기 유발 물질 철저 배제",
      "소화 흡수를 돕는 생유산균 5종 및 프리바이오틱스 함유",
    ],
    specs: [
      { label: "원산지", value: "대한민국" },
      { label: "중량", value: "1.8kg (300g 소포장 x 6팩)" },
      { label: "주원료", value: "완두단백, 발아귀리, 렌틸콩, 아마씨유, 맥주효모" },
      { label: "조단백질", value: "24.0% 이상" },
      { label: "조지방", value: "12.0% 이상" },
    ],
    mainImage: "/images/products/choko-vegan-dog-food.jpg",
    galleryImages: [
      "/images/products/choko-vegan-dog-food-1.jpg",
      "/images/products/choko-vegan-dog-food-2.jpg",
    ],
    naverUrl: "https://smartstore.naver.com/kokkiri/products/choko-dog-food",
    coupangUrl: "https://www.coupang.com/vp/products/choko-dog-food",
    isFeatured: true,
  },
  {
    id: "prod-bamboo-toilet-paper",
    slug: "bamboo-toilet-paper",
    name: "초코 포레스트 무형광 100% 대나무 롤 화장지 (30롤)",
    category: "친환경 위생용품",
    summary: "나무를 베지 않는 100% 대나무 펄프로 만든 무형광·무표백·무먼지 3겹 프리미엄 화장지",
    description:
      "하루 1미터씩 자라는 대나무만을 사용하여 산림을 보호합니다. 화학 표백제, 인공 색소, 합성 향료, 포름알데히드를 일체 사용하지 않아 민감한 아기와 피부 질환이 있는 분도 안심하고 사용할 수 있습니다.",
    features: [
      "FSC 인증 100% 천연 대나무 펄프 사용",
      "먼지 날림 제로 공법으로 비염 환자 안심",
      "형광증백제, 인공향료, 표백제 무첨가 (4-FREE)",
      "엠보싱 3겹 원단으로 도톰하고 부드러운 흡수력",
    ],
    specs: [
      { label: "규격", value: "3겹 30m x 30롤" },
      { label: "원료", value: "천연 대나무 펄프 100%" },
      { label: "안전 인증", value: "KC 위생용품 안전기준 적합" },
      { label: "특징", value: "물에 잘 녹는 친환경 생분해성" },
    ],
    mainImage: "/images/products/choko-bamboo-paper.jpg",
    galleryImages: [
      "/images/products/choko-bamboo-paper-1.jpg",
      "/images/products/choko-bamboo-paper-2.jpg",
    ],
    naverUrl: "https://smartstore.naver.com/kokkiri/products/choko-bamboo-paper",
    coupangUrl: "https://www.coupang.com/vp/products/choko-bamboo-paper",
    isFeatured: true,
  },
  {
    id: "prod-bamboo-towels",
    slug: "bamboo-towels",
    name: "초코 에코 프리미엄 대나무 일회용 타월 (80매)",
    category: "친환경 위생용품",
    summary: "세균 번식 걱정 없는 위생적인 페이셜 & 바디 케어를 위한 초극세 대나무 섬유 일회용 타월",
    description:
      "습한 욕실의 젖은 수건에서 번식하는 세균 문제를 해결합니다. 대나무 고유의 천연 항균성을 유지한 두툼한 엠보싱 원단으로 피부 마찰 자극 없이 물기를 산뜻하게 흡수합니다.",
    features: [
      "자연 항균 및 소취 기능을 지닌 대나무 섬유",
      "도톰한 80gsm 고중량 원단으로 찢어짐 없는 흡수력",
      "비건 및 오코텍스 1등급(OEKO-TEX) 섬유 인증",
      "자연에서 100% 생분해되는 에코 프렌들리",
    ],
    specs: [
      { label: "수량", value: "80매입 (롤형/박스형)" },
      { label: "크기", value: "200mm x 200mm" },
      { label: "평량", value: "80g/m²" },
      { label: "용도", value: "세안 후 물기 제거, 여행 및 헬스장 휴대용" },
    ],
    mainImage: "/images/products/choko-bamboo-towel.jpg",
    galleryImages: [
      "/images/products/choko-bamboo-towel-1.jpg",
    ],
    naverUrl: "https://smartstore.naver.com/kokkiri/products/choko-bamboo-towel",
    coupangUrl: "https://www.coupang.com/vp/products/choko-bamboo-towel",
    isFeatured: true,
  },
  {
    id: "prod-wet-wipes",
    slug: "wet-wipes",
    name: "초코 마일드 센서티브 대나무 생분해 물티슈 (70매 x 10팩)",
    category: "친환경 위생용품",
    summary: "플라스틱 프리 원단과 7단계 정제수로 만든 아기와 반려동물 모두를 위한 안심 물티슈",
    description:
      "미세플라스틱을 방출하는 합성 폴리에스터 원단 대신 100% 대나무 원사로 직조하여 흙으로 돌아갑니다. 마시는 물 수준의 7단계 카본 정제수만을 담아 연약한 피부에도 부드럽게 작용합니다.",
    features: [
      "플라스틱 원사 0% 생분해 대나무 원단",
      "식품의약품안전처 CGMP 적합 시설 제조",
      "피부 저자극 테스트 무자극 판정 (독일 더마테스트 Excellent)",
      "제주 편백잎 추출물 함유로 은은한 자연 진정 효과",
    ],
    specs: [
      { label: "용량", value: "70매 x 10팩 (캡형)" },
      { label: "원단", value: "100% 대나무 레이온 원단 (75gsm)" },
      { label: "주요 성분", value: "초순수 7단계 정제수, 편백수, 유기농 글리세린" },
    ],
    mainImage: "/images/products/choko-wet-wipes.jpg",
    galleryImages: [
      "/images/products/choko-wet-wipes-1.jpg",
    ],
    naverUrl: "https://smartstore.naver.com/kokkiri/products/choko-wet-wipes",
    coupangUrl: "https://www.coupang.com/vp/products/choko-wet-wipes",
    isFeatured: false,
  },
  {
    id: "prod-odor-control",
    slug: "odor-control",
    name: "초코 클린스페이스 피톤치드 자연유래 다목적 탈취제 (500ml)",
    category: "생활 케어",
    summary: "인공 향료로 냄새를 덮지 않고 악취 분자를 근본적으로 분해하는 친환경 공간 탈취 스프레이",
    description:
      "강원도 편백 피톤치드 오일과 감 추출 탄닌 성분이 암모니아, 트리메틸아민 등 악취 원인을 99% 이상 탈취합니다. 반려동물 배변 구역, 신발장, 패브릭 소파 및 차량 실내에 안심하고 분사하세요.",
    features: [
      "국가공인기관 99.6% 탈취력 검증",
      "유해 화학물질 12종 불검출 (가습기 살균제 성분 등 ZERO)",
      "알코올 프리 제형으로 가죽이나 고급 섬유 손상 방지",
      "반려동물 후각 스트레스 없는 은은한 자연 숲 향",
    ],
    specs: [
      { label: "용량", value: "500ml 스프레이형" },
      { label: "성분", value: "편백오일, 감추출물, 감초추출물, 정제수" },
      { label: "안전 확인", value: "안전확인대상생활화학제품 승인완료" },
    ],
    mainImage: "/images/products/choko-odor-control.jpg",
    galleryImages: [
      "/images/products/choko-odor-control-1.jpg",
    ],
    naverUrl: "https://smartstore.naver.com/kokkiri/products/choko-odor-control",
    coupangUrl: "https://www.coupang.com/vp/products/choko-odor-control",
    isFeatured: true,
  },
];

export const NEWS_LIST: NewsItem[] = [
  {
    id: "news-01",
    slug: "kokkiri-sustainability-certification",
    title: "코끼리, 2026년 친환경 위생 관리 솔루션 및 ESG 인증 획득",
    category: "기업 소식",
    excerpt: "지속 가능한 공간 관리를 위한 무독성 케미컬 전환 및 탄소 저감형 산업 장비 도입 성과 발표",
    content:
      "주식회사 코끼리는 2026년 상반기 전 사업장에 걸쳐 친환경 위생 솔루션을 성공적으로 안착시켰습니다. 클리닝 및 공간 케어 전반에 걸쳐 유해 화학물질 제로화를 달성하고, 탄소 배출을 획기적으로 줄인 최신 배터리 구동형 산업용 청소 장비를 전면 배치했습니다.",
    publishedAt: "2026.03.15",
    readTime: "3분",
  },
  {
    id: "news-02",
    slug: "koto-ai-security-cctv-launch",
    title: "KOTO, 딥러닝 AI 지능형 보안 카메라 & 4K 실시간 관제 시스템 공급 확대",
    category: "기술 혁신",
    excerpt: "사각지대 없는 4K 영상 분석과 24시간 침입·화재 이상 감지를 결합한 첨단 스마트 CCTV 솔루션",
    content:
      "KOTO 사업부는 대형 오피스 빌딩 및 복합 물류 시설의 안전성을 극대화하기 위해 딥러닝 영상 분석 기반의 AI 스마트 CCTV 관제 시스템을 본격 공급합니다. 사람과 차량 객체 정밀 감지, 침입·배회·화재 연기 실시간 알림을 통해 사업장 보안을 획기적으로 강화합니다.",
    publishedAt: "2026.02.20",
    readTime: "4분",
  },
  {
    id: "news-03",
    slug: "choko-naver-coupang-expansion",
    title: "CHOKO, 네이버 스마트스토어 및 쿠팡 로켓배송 친환경 라인업 확장",
    category: "브랜드 소식",
    excerpt: "100% 대나무 펄프 생활용품과 비건 펫케어 신제품 공식 런칭 및 프로모션 안내",
    content:
      "라이프케어 브랜드 CHOKO는 고객들의 접근성을 높이기 위해 공식 네이버 스마트스토어와 쿠팡 플랫폼을 통해 대나무 화장지, 생분해 물티슈, 비건 반려견 사료의 유통을 강화했습니다. 정기 배송 및 다양한 혜택을 온라인 공식 채널에서 만나보실 수 있습니다.",
    publishedAt: "2026.01.10",
    readTime: "2분",
  },
];

export const COMPANY_INFO = {
  name: "주식회사 코끼리 (KOKKIRI Co., Ltd.)",
  ceo: "김코끼 (대표자)",
  businessNumber: "123-45-67890",
  address: "서울특별시 강남구 테헤란로 123 코끼리타워 8층",
  phone: "02-1588-0000",
  email: "contact@kokkiri.com",
  quoteEmail: "quote@kokkiri.com",
  operatingHours: "평일 09:00 - 18:00 (주말 및 공휴일 휴무)",
  emergencyPhone: "010-9999-8888 (24시간 비상 시설 대응)",
};
