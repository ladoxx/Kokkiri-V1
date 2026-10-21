export interface DivisionRoutingConfig {
  enabled?: boolean;
  divisionName?: string;
  recipients?: string[];
  subjectTemplate?: string;
  customHeaderNote?: string;
}

export interface LeadRoutingSettings {
  // Single Unified Notification Email for ALL brands
  unifiedNotificationEmail: string; // e.g. "contact@kokkiri.com"
  additionalRecipients?: string; // Optional comma-separated CC recipients
  unifiedSubjectTemplate: string; // e.g. "[{brandName}] {customerName}님의 문의가 접수되었습니다"
  enableCustomerReplyTo: boolean;

  // Backwards compatibility fields
  masterBossEmail?: string;
  masterBccEnabled?: boolean;
  cleaning?: DivisionRoutingConfig;
  koto?: DivisionRoutingConfig;
  chokoAndGeneral?: DivisionRoutingConfig;

  updatedAt?: string;
}

export const DEFAULT_LEAD_ROUTING: LeadRoutingSettings = {
  // Unified single recipient email for all brands across the entire platform
  unifiedNotificationEmail: "contact@kokkiri.com",
  additionalRecipients: "",
  unifiedSubjectTemplate: "[{brandName}] {customerName}님의 문의가 접수되었습니다",
  enableCustomerReplyTo: true,

  masterBossEmail: "contact@kokkiri.com",
  masterBccEnabled: false,

  cleaning: {
    enabled: true,
    divisionName: "KOKKIRI 프리미엄 클리닝",
    recipients: ["contact@kokkiri.com"],
    subjectTemplate: "[KOKKIRI 클리닝] {customerName}님의 견적 문의가 접수되었습니다",
    customHeaderNote: "클리닝 전담 영업팀 즉시 응대 건",
  },

  koto: {
    enabled: true,
    divisionName: "KOTO AI 보안 & 시설 솔루션",
    recipients: ["contact@kokkiri.com"],
    subjectTemplate: "[KOTO AI보안/시설] {customerName}님의 실사 및 견적 요청",
    customHeaderNote: "AI CCTV 및 보안 관제 기술팀 배정 건",
  },

  chokoAndGeneral: {
    enabled: true,
    divisionName: "CHOKO 라이프케어 & 일반 문의",
    recipients: ["contact@kokkiri.com"],
    subjectTemplate: "[CHOKO/일반문의] {customerName}님의 제휴 및 고객 문의",
    customHeaderNote: "에코 커머스 및 본사 고객지원팀",
  },

  updatedAt: new Date().toISOString(),
};
