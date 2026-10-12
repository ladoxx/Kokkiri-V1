import fs from "fs";
import path from "path";
import { COMPANY_INFO as INITIAL_INFO } from "./initial-data";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "company-info.json");

export function getCompanyInfo() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, "utf-8");
      return { ...INITIAL_INFO, ...JSON.parse(content) };
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(INITIAL_INFO, null, 2), "utf-8");
  } catch (err) {
    console.error("Error reading company info:", err);
  }
  return INITIAL_INFO;
}

export function saveCompanyInfo(data: Partial<typeof INITIAL_INFO>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const current = getCompanyInfo();
    const updated = { ...current, ...data };
    fs.writeFileSync(FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");
    return updated;
  } catch (err) {
    console.error("Error saving company info:", err);
    throw err;
  }
}
