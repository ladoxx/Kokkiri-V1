export interface DivisionRoutingConfig {
  enabled: boolean;
  divisionName: string;
  recipients: string[]; // Array of clean email strings
  subjectTemplate: string; // e.g., "[KOKKIRI 클리닝 견적] {customerName}님의 문의가 접수되었습니다"
  customHeaderNote?: string;
}

export interface LeadRoutingSettings {
  // Master Boss Email: receives BCC / copy on EVERY lead submission without exception
  masterBossEmail: string;
  masterBccEnabled: boolean;

  // Global reply-to setting: true means customer's email is Reply-To so staff can directly hit reply
  enableCustomerReplyTo: boolean;

  // 1. KOKKIRI Cleaning
  cleaning: DivisionRoutingConfig;

  // 2. KOTO AI Security & Facility
  koto: DivisionRoutingConfig;

  // 3. CHOKO & General Corporate Inquiry
  chokoAndGeneral: DivisionRoutingConfig;

  updatedAt?: string;
}

export const DEFAULT_LEAD_ROUTING: LeadRoutingSettings = {
  masterBossEmail: "admin@kokkiri.com",
  masterBccEnabled: true,
  enableCustomerReplyTo: true,

  cleaning: {
    enabled: true,
    divisionName: "KOKKIRI 프리미엄 클리닝",
    recipients: ["cleaning@kokkiri.com", "admin@kokkiri.com"],
    subjectTemplate: "[KOKKIRI 클리닝] {customerName}님의 견적 문의가 접수되었습니다",
    customHeaderNote: "클리닝 전담 영업팀 즉시 응대 건",
  },

  koto: {
    enabled: true,
    divisionName: "KOTO AI 보안 & 시설 솔루션",
    recipients: ["koto@kokkiri.com", "security@kokkiri.com", "admin@kokkiri.com"],
    subjectTemplate: "[KOTO AI보안/시설] {customerName}님의 실사 및 견적 요청",
    customHeaderNote: "AI CCTV 및 보안 관제 기술팀 배정 건",
  },

  chokoAndGeneral: {
    enabled: true,
    divisionName: "CHOKO 라이프케어 & 일반 문의",
    recipients: ["choko@kokkiri.com", "admin@kokkiri.com"],
    subjectTemplate: "[CHOKO/일반문의] {customerName}님의 제휴 및 고객 문의",
    customHeaderNote: "에코 커머스 및 본사 고객지원팀",
  },

  updatedAt: new Date().toISOString(),
};
