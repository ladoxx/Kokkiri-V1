import fs from "fs";
import path from "path";
import { LeadRoutingSettings, DEFAULT_LEAD_ROUTING } from "../types/lead-routing";

const DATA_DIR = path.join(process.cwd(), "data");
const ROUTING_FILE = path.join(DATA_DIR, "lead-routing.json");

export function getLeadRoutingSettings(): LeadRoutingSettings {
  try {
    if (fs.existsSync(ROUTING_FILE)) {
      const data = fs.readFileSync(ROUTING_FILE, "utf-8");
      const parsed = JSON.parse(data);
      const unifiedEmail =
        parsed.unifiedNotificationEmail ||
        parsed.masterBossEmail ||
        parsed.cleaning?.recipients?.[0] ||
        DEFAULT_LEAD_ROUTING.unifiedNotificationEmail;

      return {
        ...DEFAULT_LEAD_ROUTING,
        ...parsed,
        unifiedNotificationEmail: unifiedEmail,
        unifiedSubjectTemplate:
          parsed.unifiedSubjectTemplate || DEFAULT_LEAD_ROUTING.unifiedSubjectTemplate,
        additionalRecipients: parsed.additionalRecipients || "",
        enableCustomerReplyTo:
          parsed.enableCustomerReplyTo !== undefined
            ? parsed.enableCustomerReplyTo
            : DEFAULT_LEAD_ROUTING.enableCustomerReplyTo,
      };
    }
  } catch (err) {
    console.error("Error reading lead-routing file:", err);
  }
  return DEFAULT_LEAD_ROUTING;
}

export function saveLeadRoutingSettings(
  updates: Partial<LeadRoutingSettings>
): LeadRoutingSettings {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const current = getLeadRoutingSettings();
    const updated: LeadRoutingSettings = {
      ...current,
      ...updates,
      unifiedNotificationEmail: (updates.unifiedNotificationEmail || current.unifiedNotificationEmail || "contact@kokkiri.com").trim(),
      unifiedSubjectTemplate: updates.unifiedSubjectTemplate || current.unifiedSubjectTemplate,
      additionalRecipients: updates.additionalRecipients !== undefined ? updates.additionalRecipients : current.additionalRecipients,
      enableCustomerReplyTo: updates.enableCustomerReplyTo !== undefined ? updates.enableCustomerReplyTo : current.enableCustomerReplyTo,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(ROUTING_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return updated;
  } catch (err) {
    console.error("Error saving lead-routing file:", err);
    throw err;
  }
}

export interface ResolvedRouting {
  divisionKey: "cleaning" | "koto" | "chokoAndGeneral";
  divisionName: string;
  recipients: string[];
  bcc: string[];
  subject: string;
  enableCustomerReplyTo: boolean;
  headerNote?: string;
}

/**
 * Determine single unified notification recipient for all brands
 * while dynamically labeling which brand/service the lead is for.
 */
export function resolveInquiryRouting(params: {
  inquiryType: string;
  serviceCategory?: string | null;
  customerName: string;
  company?: string | null;
  location?: string | null;
}): ResolvedRouting {
  const settings = getLeadRoutingSettings();
  const searchStr = `${params.inquiryType || ""} ${params.serviceCategory || ""}`.toLowerCase();

  let divisionKey: "cleaning" | "koto" | "chokoAndGeneral" = "chokoAndGeneral";
  let brandName = "CHOKO 에코 라이프케어";

  if (
    searchStr.includes("클리닝") ||
    searchStr.includes("청소") ||
    searchStr.includes("cleaning") ||
    searchStr.includes("준공") ||
    searchStr.includes("오피스") ||
    searchStr.includes("사옥")
  ) {
    divisionKey = "cleaning";
    brandName = "KOKKIRI 프리미엄 클리닝";
  } else if (
    searchStr.includes("cctv") ||
    searchStr.includes("보안") ||
    searchStr.includes("카메라") ||
    searchStr.includes("경비") ||
    searchStr.includes("조경") ||
    searchStr.includes("펜스") ||
    searchStr.includes("시설") ||
    searchStr.includes("koto")
  ) {
    divisionKey = "koto";
    brandName = "KOTO AI 보안·시설 솔루션";
  } else {
    divisionKey = "chokoAndGeneral";
    brandName = "CHOKO 에코 라이프케어 & 일반 문의";
  }

  // SINGLE UNIFIED RECIPIENT EMAIL FOR ALL BRANDS
  const primaryEmail = (settings.unifiedNotificationEmail || settings.masterBossEmail || "contact@kokkiri.com").trim();

  const recipientsList: string[] = [primaryEmail];

  // Optional extra recipients
  if (settings.additionalRecipients) {
    const extra = settings.additionalRecipients
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.length > 3 && e.includes("@"));
    for (const e of extra) {
      if (!recipientsList.includes(e)) {
        recipientsList.push(e);
      }
    }
  }

  const recipients = recipientsList.filter((e) => e.length > 3 && e.includes("@"));

  // Dynamic Subject line
  const template = settings.unifiedSubjectTemplate || "[{brandName}] {customerName}님의 문의가 접수되었습니다";
  const subject = template
    .replace(/\{brandName\}/g, brandName)
    .replace(/\{customerName\}/g, params.customerName || "고객")
    .replace(/\{serviceCategory\}/g, params.serviceCategory || params.inquiryType || "")
    .replace(/\{inquiryType\}/g, params.inquiryType || "")
    .replace(/\{company\}/g, params.company || "")
    .replace(/\{location\}/g, params.location || "");

  return {
    divisionKey,
    divisionName: brandName,
    recipients: recipients.length > 0 ? recipients : ["contact@kokkiri.com"],
    bcc: [],
    subject,
    enableCustomerReplyTo: settings.enableCustomerReplyTo ?? true,
    headerNote: `[${brandName}] 통합 고객 문의 접수`,
  };
}
