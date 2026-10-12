import fs from "fs";
import path from "path";
import { SiteNavigationSettings, DEFAULT_NAVIGATION } from "../types/cms";

const DATA_DIR = path.join(process.cwd(), "data");
const NAV_FILE = path.join(DATA_DIR, "site-navigation.json");

export function getSiteNavigation(): SiteNavigationSettings {
  try {
    if (fs.existsSync(NAV_FILE)) {
      const data = fs.readFileSync(NAV_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed && Array.isArray(parsed.categories)) {
        return {
          ...DEFAULT_NAVIGATION,
          ...parsed,
        };
      }
    }
  } catch (err) {
    console.error("Error reading site navigation file:", err);
  }
  return DEFAULT_NAVIGATION;
}

export function saveSiteNavigation(
  settings: Partial<SiteNavigationSettings>
): SiteNavigationSettings {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const current = getSiteNavigation();
    const updated: SiteNavigationSettings = {
      ...current,
      ...settings,
      categories: settings.categories || current.categories,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(NAV_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return updated;
  } catch (err) {
    console.error("Error saving site navigation file:", err);
    throw err;
  }
}

export function resetSiteNavigation(): SiteNavigationSettings {
  try {
    if (fs.existsSync(NAV_FILE)) {
      fs.unlinkSync(NAV_FILE);
    }
  } catch (err) {
    console.error("Error resetting site navigation:", err);
  }
  return DEFAULT_NAVIGATION;
}
