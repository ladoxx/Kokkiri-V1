import fs from "fs";
import path from "path";
import { SERVICES as INITIAL_SERVICES, ServiceItem } from "./initial-data";

const DATA_DIR = path.join(process.cwd(), "data");
const SERVICES_FILE = path.join(DATA_DIR, "services.json");

function ensureInitialized(): ServiceItem[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(SERVICES_FILE)) {
      const content = fs.readFileSync(SERVICES_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Write initial services if not yet created
    fs.writeFileSync(SERVICES_FILE, JSON.stringify(INITIAL_SERVICES, null, 2), "utf-8");
    return INITIAL_SERVICES;
  } catch (err) {
    console.error("Error initializing services store:", err);
    return INITIAL_SERVICES;
  }
}

export function getStoredServices(): ServiceItem[] {
  return ensureInitialized();
}

export function getServiceById(id: string): ServiceItem | undefined {
  const items = getStoredServices();
  return items.find((s) => s.id === id);
}

export function getServicesByBrand(brandSlug: "kokkiri" | "koto" | "choko"): ServiceItem[] {
  const items = getStoredServices();
  return items.filter((s) => s.brandSlug === brandSlug);
}

export function saveService(data: Partial<ServiceItem> & { title: string }): ServiceItem {
  const items = [...getStoredServices()];
  const existingIndex = data.id ? items.findIndex((s) => s.id === data.id) : -1;

  if (existingIndex >= 0) {
    // Update
    const current = items[existingIndex];
    const updated: ServiceItem = {
      ...current,
      ...data,
      brandSlug: data.brandSlug || current.brandSlug,
      slug: data.slug || current.slug,
      title: data.title || current.title,
      subtitle: data.subtitle !== undefined ? data.subtitle : current.subtitle,
      summary: data.summary !== undefined ? data.summary : current.summary,
      description: data.description !== undefined ? data.description : current.description,
      features: Array.isArray(data.features) ? data.features : current.features,
      processSteps: Array.isArray(data.processSteps) ? data.processSteps : current.processSteps,
      isFeatured: typeof data.isFeatured === "boolean" ? data.isFeatured : current.isFeatured,
      order: typeof data.order === "number" ? data.order : current.order,
    };
    items[existingIndex] = updated;
    fs.writeFileSync(SERVICES_FILE, JSON.stringify(items, null, 2), "utf-8");
    return updated;
  } else {
    // Create
    const id = data.id || `srv-${Date.now()}`;
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") ||
      `service-${Date.now()}`;

    const created: ServiceItem = {
      id,
      brandSlug: data.brandSlug || "koto",
      slug,
      title: data.title,
      subtitle: data.subtitle || "",
      summary: data.summary || "",
      description: data.description || "",
      features: Array.isArray(data.features) && data.features.length > 0 ? data.features : ["전문 기술진 현장 사전 진단", "맞춤형 시공 계획 및 사후 관리 보증"],
      processSteps: Array.isArray(data.processSteps) && data.processSteps.length > 0 ? data.processSteps : [
        { step: "01", title: "현장 진단 & 컨설팅", desc: "전문 엔지니어 현장 방문 및 최적 솔루션 도출" },
        { step: "02", title: "맞춤 시공 & 설치", desc: "표준 시공 가이드라인 준수 및 고품질 작업 진행" },
        { step: "03", title: "최종 검수 & 인도", desc: "고객 입회 하에 기능 점검 및 사후 관리 안내" },
      ],
      isFeatured: data.isFeatured ?? true,
      order: typeof data.order === "number" ? data.order : items.length + 1,
    };

    items.push(created);
    fs.writeFileSync(SERVICES_FILE, JSON.stringify(items, null, 2), "utf-8");
    return created;
  }
}

export function deleteService(id: string): boolean {
  const items = getStoredServices();
  const filtered = items.filter((s) => s.id !== id);
  if (filtered.length !== items.length) {
    fs.writeFileSync(SERVICES_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  }
  return false;
}
