import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

// Auto-heal: If SQLite database file is missing or 0 bytes, populate from template
try {
  const dbUrl = process.env.DATABASE_URL || "";
  if (dbUrl.startsWith("file:")) {
    const rawPath = dbUrl.replace("file:", "");
    const resolvedPath = path.isAbsolute(rawPath)
      ? rawPath
      : path.join(process.cwd(), "prisma", "kokkiri.db");
    const templatePath = path.join(process.cwd(), "prisma-template", "kokkiri.db");

    const needsInit = !fs.existsSync(resolvedPath) || fs.statSync(resolvedPath).size < 5000;
    if (needsInit && fs.existsSync(templatePath)) {
      console.log(`[PRISMA AUTO-HEAL] Initializing SQLite database from template: ${resolvedPath}`);
      fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
      fs.copyFileSync(templatePath, resolvedPath);
    }
  }
} catch (err) {
  // Non-fatal warning if in non-filesystem environments
  if (process.env.NODE_ENV === "development") {
    console.warn("[PRISMA INIT] Database auto-heal check notice:", err);
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
