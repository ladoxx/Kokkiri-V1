import fs from "fs";
import path from "path";
import { SiteContentSettings, DEFAULT_SITE_CONTENT } from "../types/cms";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "site-content.json");

export function getSiteContent(): SiteContentSettings {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const data = fs.readFileSync(CONTENT_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed && parsed.hero) {
        return {
          ...DEFAULT_SITE_CONTENT,
          ...parsed,
          hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero || {}) },
          brands: {
            kokkiri: { ...DEFAULT_SITE_CONTENT.brands.kokkiri, ...(parsed.brands?.kokkiri || {}) },
            koto: { ...DEFAULT_SITE_CONTENT.brands.koto, ...(parsed.brands?.koto || {}) },
            choko: { ...DEFAULT_SITE_CONTENT.brands.choko, ...(parsed.brands?.choko || {}) },
          },
        };
      }
    }
  } catch (err) {
    console.error("Error reading site content file:", err);
  }
  return DEFAULT_SITE_CONTENT;
}

export function saveSiteContent(
  settings: Partial<SiteContentSettings>
): SiteContentSettings {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const current = getSiteContent();
    const updated: SiteContentSettings = {
      ...current,
      ...settings,
      hero: settings.hero ? { ...current.hero, ...settings.hero } : current.hero,
      brandSectionTitle: settings.brandSectionTitle ?? current.brandSectionTitle,
      brandSectionSubtitle: settings.brandSectionSubtitle ?? current.brandSectionSubtitle,
      brands: settings.brands
        ? {
            kokkiri: { ...current.brands.kokkiri, ...(settings.brands.kokkiri || {}) },
            koto: { ...current.brands.koto, ...(settings.brands.koto || {}) },
            choko: { ...current.brands.choko, ...(settings.brands.choko || {}) },
          }
        : current.brands,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(CONTENT_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return updated;
  } catch (err) {
    console.error("Error saving site content file:", err);
    throw err;
  }
}

export function resetSiteContent(): SiteContentSettings {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      fs.unlinkSync(CONTENT_FILE);
    }
  } catch (err) {
    console.error("Error resetting site content:", err);
  }
  return DEFAULT_SITE_CONTENT;
}
