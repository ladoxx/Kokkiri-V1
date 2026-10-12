import fs from "fs";
import path from "path";
import { UiSettings, DEFAULT_UI_SETTINGS } from "@/lib/types/ui-settings";

export * from "@/lib/types/ui-settings";

const SETTINGS_FILE = path.join(process.cwd(), "data", "ui-settings.json");

export function getUiSettings(): UiSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
      return { ...DEFAULT_UI_SETTINGS, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error("Error reading UI settings:", err);
  }
  return DEFAULT_UI_SETTINGS;
}

export function saveUiSettings(newSettings: Partial<UiSettings>): UiSettings {
  try {
    const current = getUiSettings();
    const updated = { ...current, ...newSettings };
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return updated;
  } catch (err) {
    console.error("Error saving UI settings:", err);
    throw err;
  }
}
