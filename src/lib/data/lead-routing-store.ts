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
      return {
        ...DEFAULT_LEAD_ROUTING,
        ...parsed,
        cleaning: { ...DEFAULT_LEAD_ROUTING.cleaning, ...(parsed.cleaning || {}) },
        koto: { ...DEFAULT_LEAD_ROUTING.koto, ...(parsed.koto || {}) },
        chokoAndGeneral: { ...DEFAULT_LEAD_ROUTING.chokoAndGeneral, ...(parsed.chokoAndGeneral || {}) },
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
      cleaning: updates.cleaning
        ? { ...current.cleaning, ...updates.cleaning }
        : current.cleaning,
      koto: updates.koto
        ? { ...current.koto, ...updates.koto }
        : current.koto,
      chokoAndGeneral: updates.chokoAndGeneral
        ? { ...current.chokoAndGeneral, ...updates.chokoAndGeneral }
        : current.chokoAndGeneral,
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
 * Determine which team receives the inquiry based on category/type keywords
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

  if (
    searchStr.includes("클리닝") ||
    searchStr.includes("청소") ||
    searchStr.includes("cleaning") ||
    searchStr.includes("준공") ||
    searchStr.includes("오피스") ||
    searchStr.includes("사옥")
  ) {
    divisionKey = "cleaning";
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
  } else {
    divisionKey = "chokoAndGeneral";
  }

  const divisionConfig = settings[divisionKey];

  // Clean recipients
  let recipients = (divisionConfig.recipients || [])
    .map((e) => e.trim())
    .filter((e) => e.length > 3 && e.includes("@"));

  // Fallback if empty
  if (recipients.length === 0) {
    recipients = [settings.masterBossEmail || "admin@kokkiri.com"];
  }

  // Master boss BCC
  const bcc: string[] = [];
  if (settings.masterBccEnabled && settings.masterBossEmail) {
    const bossEmail = settings.masterBossEmail.trim();
    if (bossEmail && !recipients.includes(bossEmail)) {
      bcc.push(bossEmail);
    }
  }

  // Generate subject from template
  let subject = divisionConfig.subjectTemplate || "[KOKKIRI 문의] {customerName}님의 문의 접수";
  subject = subject
    .replace(/\{customerName\}/g, params.customerName || "고객")
    .replace(/\{serviceCategory\}/g, params.serviceCategory || params.inquiryType || "")
    .replace(/\{inquiryType\}/g, params.inquiryType || "")
    .replace(/\{company\}/g, params.company || "")
    .replace(/\{location\}/g, params.location || "");

  return {
    divisionKey,
    divisionName: divisionConfig.divisionName,
    recipients,
    bcc,
    subject,
    enableCustomerReplyTo: settings.enableCustomerReplyTo,
    headerNote: divisionConfig.customHeaderNote,
  };
}
