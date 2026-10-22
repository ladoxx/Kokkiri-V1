import { describe, it, expect } from "vitest";
import { inquirySubmissionSchema, adminLoginSchema } from "../validations/inquiry";
import {
  generateToken,
  verifyToken,
  hasMinimumRole,
  canManageUsers,
  canManageSettings,
} from "../auth/auth";
import { RoleType } from "@/lib/types/enums";
import { formatInquiryAlimtalkContent } from "../notifications/kakao";

describe("Validation Schemas", () => {
  it("should validate a valid inquiry submission", () => {
    const input = {
      name: "홍길동",
      company: "(주)테크솔루션",
      email: "hong@example.com",
      phone: "010-1234-5678",
      inquiryType: "클리닝 견적 문의",
      serviceCategory: "오피스 & 사옥 정기 클리닝",
      location: "서울 강남구 테헤란로",
      message: "사옥 이전으로 인한 3개 층 정기 클리닝 견적을 요청드립니다.",
      preferredContactMethod: "PHONE" as const,
      consentGiven: true,
    };
    const result = inquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should reject submission without privacy consent", () => {
    const input = {
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-1234-5678",
      inquiryType: "기타 문의",
      message: "짧지 않은 문의 내용을 10자 이상 작성합니다.",
      consentGiven: false,
    };
    const result = inquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject message shorter than 10 characters", () => {
    const input = {
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-1234-5678",
      inquiryType: "기타 문의",
      message: "짧은글",
      consentGiven: true,
    };
    const result = inquirySubmissionSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should validate admin login payload", () => {
    const valid = adminLoginSchema.safeParse({
      email: "admin@kokkiri.com",
      password: "KokkiriAdmin2026!#",
    });
    expect(valid.success).toBe(true);
  });
});

describe("Authentication & RBAC Logic", () => {
  it("should sign and verify JWT tokens correctly", () => {
    const payload = {
      userId: "user-123",
      email: "admin@kokkiri.com",
      name: "최고 관리자",
      role: RoleType.SUPER_ADMIN,
    };
    const token = generateToken(payload);
    expect(typeof token).toBe("string");

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.role).toBe(RoleType.SUPER_ADMIN);
  });

  it("should evaluate role hierarchy correctly", () => {
    expect(hasMinimumRole(RoleType.SUPER_ADMIN, RoleType.ADMIN)).toBe(true);
    expect(hasMinimumRole(RoleType.ADMIN, RoleType.SUPER_ADMIN)).toBe(false);
    expect(hasMinimumRole(RoleType.STAFF, RoleType.MANAGER)).toBe(false);
    expect(hasMinimumRole(RoleType.MANAGER, RoleType.STAFF)).toBe(true);

    expect(canManageUsers(RoleType.SUPER_ADMIN)).toBe(true);
    expect(canManageUsers(RoleType.ADMIN)).toBe(false);

    expect(canManageSettings(RoleType.ADMIN)).toBe(true);
    expect(canManageSettings(RoleType.STAFF)).toBe(false);
  });
});

describe("Notification Formatting", () => {
  it("should format KakaoTalk Alimtalk message accurately with Korean placeholders", () => {
    const message = formatInquiryAlimtalkContent({
      customerName: "이순신",
      phone: "010-9876-5432",
      inquiryType: "AI 보안 카메라 & CCTV 설치 견적",
      createdAt: new Date("2026-03-01T10:00:00Z"),
    });

    expect(message).toContain("이순신");
    expect(message).toContain("010-9876-5432");
    expect(message).toContain("AI 보안 카메라 & CCTV 설치 견적");
    expect(message).toContain("주식회사 코끼리");
  });
});

describe("Smart Lead Routing & Multi-Recipient System", () => {
  it("should accurately route cleaning inquiries to the cleaning division with boss BCC", async () => {
    const { resolveInquiryRouting } = await import("../data/lead-routing-store");
    const routing = resolveInquiryRouting({
      inquiryType: "클리닝 견적 문의",
      serviceCategory: "프리미엄 오피스 정기 클리닝",
      customerName: "강감찬",
      company: "(주)강남타워",
    });

    expect(routing.divisionKey).toBe("cleaning");
    expect(routing.divisionName).toContain("클리닝");
    expect(routing.subject).toContain("강감찬");
    expect(routing.recipients.length).toBeGreaterThan(0);
    expect(routing.enableCustomerReplyTo).toBe(true);
  });

  it("should accurately route AI CCTV and security inquiries to KOTO division", async () => {
    const { resolveInquiryRouting } = await import("../data/lead-routing-store");
    const routing = resolveInquiryRouting({
      inquiryType: "AI 보안 카메라 & CCTV 설치 견적",
      serviceCategory: "4K AI 지능형 CCTV 16대",
      customerName: "을지문덕",
      company: "물류허브센터",
    });

    expect(routing.divisionKey).toBe("koto");
    expect(routing.divisionName).toContain("KOTO");
    expect(routing.subject).toContain("을지문덕");
  });

  it("should accurately route CHOKO and general inquiries to CHOKO/general division", async () => {
    const { resolveInquiryRouting } = await import("../data/lead-routing-store");
    const routing = resolveInquiryRouting({
      inquiryType: "CHOKO 제품 대량 구매/제휴",
      customerName: "홍길동",
    });

    expect(routing.divisionKey).toBe("chokoAndGeneral");
    expect(routing.divisionName).toContain("CHOKO");
    expect(routing.subject).toContain("홍길동");
  });
});

describe("Site Navigation & Content CMS Stores", () => {
  it("should load and manipulate site navigation categories", async () => {
    const { getSiteNavigation, saveSiteNavigation } = await import("../data/navigation-store");
    const nav = getSiteNavigation();
    expect(nav.categories).toBeDefined();
    expect(nav.categories.length).toBeGreaterThanOrEqual(5);

    // Verify finding categories
    const aboutCat = nav.categories.find((c) => c.id === "about");
    expect(aboutCat).toBeDefined();
    expect(aboutCat?.label).toBe("회사 소개");

    // Test saving modification
    const updated = {
      ...nav,
      categories: nav.categories.map((c) => (c.id === "about" ? { ...c, label: "기업 소개" } : c)),
    };
    saveSiteNavigation(updated);
    const reloaded = getSiteNavigation();
    expect(reloaded.categories.find((c) => c.id === "about")?.label).toBe("기업 소개");

    // Restore original label
    saveSiteNavigation(nav);
  });

  it("should load and manipulate site content hero and brands", async () => {
    const { getSiteContent, saveSiteContent } = await import("../data/content-store");
    const content = getSiteContent();
    expect(content.hero).toBeDefined();
    expect(content.hero.titleLine1).toBeDefined();
    expect(content.brands.kokkiri).toBeDefined();
    expect(content.brands.koto).toBeDefined();
    expect(content.brands.choko).toBeDefined();

    // Test modifying hero title
    const origTitle = content.hero.titleLine1;
    const modified = {
      ...content,
      hero: {
        ...content.hero,
        titleLine1: "프리미엄 공간 솔루션",
      },
    };
    saveSiteContent(modified);
    const reloaded = getSiteContent();
    expect(reloaded.hero.titleLine1).toBe("프리미엄 공간 솔루션");

    // Restore original content
    saveSiteContent(content);
    expect(getSiteContent().hero.titleLine1).toBe(origTitle);
  });

  it("should create snapshots and check system updates", async () => {
    const { createRestorePoint, listRestorePoints, deleteRestorePoint, checkSystemUpdates } = await import("../data/updates-store");
    
    // Check system updates info
    const updateInfo = await checkSystemUpdates();
    expect(updateInfo).toBeDefined();
    expect(updateInfo.currentVersion).toBeDefined();
    expect(updateInfo.currentCommit).toBeDefined();

    // Create a test snapshot
    const snapshot = createRestorePoint("manual", "테스트 복원 지점");
    expect(snapshot.id).toBeDefined();
    expect(snapshot.type).toBe("manual");
    expect(snapshot.filesCount).toBeGreaterThan(0);

    // List snapshots
    const points = listRestorePoints();
    expect(points.some((p) => p.id === snapshot.id)).toBe(true);

    // Clean up test snapshot
    deleteRestorePoint(snapshot.id);
  });
});
