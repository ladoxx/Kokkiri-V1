import fs from "fs";
import path from "path";
import { BeforeAfterItem } from "@/components/ui/BeforeAfterSlider";
import { BEFORE_AFTER_ITEMS as INITIAL_ITEMS } from "./before-after-data";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "before-after.json");

function ensureInitialized(): BeforeAfterItem[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(INITIAL_ITEMS, null, 2), "utf-8");
    return INITIAL_ITEMS;
  } catch (err) {
    console.error("Error initializing before-after store:", err);
    return INITIAL_ITEMS;
  }
}

export function getStoredBeforeAfterItems(): BeforeAfterItem[] {
  return ensureInitialized();
}

export function getBeforeAfterItemById(id: string): BeforeAfterItem | undefined {
  const items = getStoredBeforeAfterItems();
  return items.find((item) => item.id === id);
}

export function saveBeforeAfterItem(data: Partial<BeforeAfterItem> & { title: string }): BeforeAfterItem {
  const items = [...getStoredBeforeAfterItems()];
  const existingIndex = data.id ? items.findIndex((i) => i.id === data.id) : -1;

  if (existingIndex >= 0) {
    const current = items[existingIndex];
    const updated: BeforeAfterItem = {
      ...current,
      ...data,
      brandSlug: data.brandSlug || current.brandSlug,
      title: data.title || current.title,
      category: data.category || current.category,
      client: data.client !== undefined ? data.client : current.client,
      description: data.description || current.description,
      beforeLabel: data.beforeLabel || current.beforeLabel,
      afterLabel: data.afterLabel || current.afterLabel,
      beforeImage: data.beforeImage || current.beforeImage,
      afterImage: data.afterImage || current.afterImage,
      metric: data.metric || current.metric,
      beforeDetails: data.beforeDetails || current.beforeDetails,
      afterDetails: data.afterDetails || current.afterDetails,
    };
    items[existingIndex] = updated;
    fs.writeFileSync(FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
    return updated;
  } else {
    const id = data.id || `ba-${Date.now()}`;
    const created: BeforeAfterItem = {
      id,
      brandSlug: data.brandSlug || "kokkiri",
      title: data.title,
      category: data.category || "특수 시공",
      client: data.client || "고객사 비공개",
      description: data.description || "",
      beforeLabel: data.beforeLabel || "시공 전 오염 상태",
      afterLabel: data.afterLabel || "시공 후 복원 완료",
      beforeImage: data.beforeImage || "/images/projects/project-office-tech.jpg",
      afterImage: data.afterImage || "/images/projects/project-building-gangnam.jpg",
      metric: data.metric || "시공 품질 만족도 99%",
      beforeDetails: data.beforeDetails || ["오염 발생 및 마모"],
      afterDetails: data.afterDetails || ["전문 정밀 세척 및 코팅"],
    };
    items.unshift(created);
    fs.writeFileSync(FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
    return created;
  }
}

export function deleteBeforeAfterItem(id: string): boolean {
  const items = getStoredBeforeAfterItems();
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length !== items.length) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  }
  return false;
}
