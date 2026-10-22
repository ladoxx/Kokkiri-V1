import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { RestorePoint, UpdateSettings, SystemUpdateInfo } from "@/lib/types/updates";
import packageJson from "../../../package.json";

const DATA_DIR = path.resolve(process.cwd(), "data");
const BACKUPS_DIR = path.resolve(DATA_DIR, "backups");
const RESTORE_POINTS_FILE = path.resolve(DATA_DIR, "restore-points.json");
const SETTINGS_FILE = path.resolve(DATA_DIR, "update-settings.json");
const VERSION_INFO_FILE = path.resolve(DATA_DIR, "version-info.json");

const DEFAULT_SETTINGS: UpdateSettings = {
  coolifyWebhookUrl: "",
  gitRepo: "ladoxx/Kokkiri-V1",
  branch: "main",
  autoBackupBeforeUpdate: true,
};

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
}

export function getUpdateSettings(): UpdateSettings {
  ensureDirs();
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), "utf8");
    return DEFAULT_SETTINGS;
  }
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, "utf8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveUpdateSettings(settings: Partial<UpdateSettings>): UpdateSettings {
  ensureDirs();
  const current = getUpdateSettings();
  const updated: UpdateSettings = {
    ...current,
    ...settings,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf8");
  return updated;
}

export function listRestorePoints(): RestorePoint[] {
  ensureDirs();
  if (!fs.existsSync(RESTORE_POINTS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(RESTORE_POINTS_FILE, "utf8");
    const points: RestorePoint[] = JSON.parse(raw);
    return points.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

export function saveRestorePoints(points: RestorePoint[]) {
  ensureDirs();
  fs.writeFileSync(RESTORE_POINTS_FILE, JSON.stringify(points, null, 2), "utf8");
}

function getLocalGitInfo(): {
  available: boolean;
  commit: string;
  date: string;
  message: string;
  branch: string;
} {
  try {
    const commit = execSync("git rev-parse --short HEAD", {
      encoding: "utf8",
      timeout: 3000,
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();

    const message = execSync("git log -1 --format=%s", {
      encoding: "utf8",
      timeout: 3000,
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();

    const date = execSync("git log -1 --format=%cd --date=iso", {
      encoding: "utf8",
      timeout: 3000,
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();

    let branch = "main";
    try {
      branch = execSync("git rev-parse --abbrev-ref HEAD", {
        encoding: "utf8",
        timeout: 3000,
        stdio: ["pipe", "pipe", "ignore"],
      }).trim();
    } catch {}

    return { available: true, commit, date, message, branch };
  } catch {
    // Fallback if git is not in PATH or not a git repo
    let fallbackCommit = "8f0c03b";
    let fallbackDate = new Date().toISOString();
    let fallbackMessage = "Latest production release";

    if (fs.existsSync(VERSION_INFO_FILE)) {
      try {
        const info = JSON.parse(fs.readFileSync(VERSION_INFO_FILE, "utf8"));
        if (info.commit) fallbackCommit = info.commit;
        if (info.date) fallbackDate = info.date;
        if (info.message) fallbackMessage = info.message;
      } catch {}
    }

    return {
      available: false,
      commit: fallbackCommit,
      date: fallbackDate,
      message: fallbackMessage,
      branch: "main",
    };
  }
}

export async function checkSystemUpdates(): Promise<SystemUpdateInfo> {
  const settings = getUpdateSettings();
  const gitInfo = getLocalGitInfo();
  const currentVersion = packageJson.version || "1.0.1";

  const result: SystemUpdateInfo = {
    currentVersion,
    currentCommit: gitInfo.commit,
    currentCommitDate: gitInfo.date,
    currentCommitMessage: gitInfo.message,
    branch: gitInfo.branch || settings.branch,
    gitRepo: settings.gitRepo,
    isGitAvailable: gitInfo.available,
    isCoolifyConfigured: Boolean(settings.coolifyWebhookUrl?.trim()),
    hasUpdate: false,
    lastCheckedAt: new Date().toISOString(),
  };

  try {
    const url = `https://api.github.com/repos/${settings.gitRepo}/commits/${settings.branch}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Kokkiri-Update-Manager/1.0",
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const data = await res.json();
      const remoteSha = (data.sha || "").slice(0, 7);
      const remoteMsg = data.commit?.message?.split("\n")[0] || "";
      const remoteDate = data.commit?.author?.date || "";
      const remoteAuthor = data.commit?.author?.name || "";

      result.remoteCommit = remoteSha;
      result.remoteCommitMessage = remoteMsg;
      result.remoteCommitDate = remoteDate;
      result.remoteAuthor = remoteAuthor;

      // Has update if remote commit differs from local commit
      result.hasUpdate = remoteSha.length > 0 && remoteSha !== gitInfo.commit;
    } else {
      result.checkError = `GitHub API yanıtı: ${res.status} (${res.statusText})`;
    }
  } catch (err: any) {
    result.checkError = `GitHub bağlantı hatası: ${err.message}`;
  }

  return result;
}

export function createRestorePoint(
  type: "automatic_pre_update" | "manual" | "rollback",
  note: string
): RestorePoint {
  ensureDirs();
  const gitInfo = getLocalGitInfo();
  const version = packageJson.version || "1.0.1";
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\..+/, "")
    .replace("T", "-");
  const id = `snapshot-${timestamp}-${gitInfo.commit}`;
  const targetDir = path.resolve(BACKUPS_DIR, id);

  fs.mkdirSync(targetDir, { recursive: true });

  // Backup all data/*.json files
  const dataBackupDir = path.resolve(targetDir, "data");
  fs.mkdirSync(dataBackupDir, { recursive: true });

  let filesCount = 0;
  if (fs.existsSync(DATA_DIR)) {
    const files = fs.readdirSync(DATA_DIR);
    for (const file of files) {
      if (file.endsWith(".json") && file !== "restore-points.json") {
        const src = path.resolve(DATA_DIR, file);
        const dst = path.resolve(dataBackupDir, file);
        try {
          fs.copyFileSync(src, dst);
          filesCount++;
        } catch (e) {
          console.error(`Failed to backup ${file}:`, e);
        }
      }
    }
  }

  // Backup SQLite database if present
  const dbPath = path.resolve(process.cwd(), "prisma", "kokkiri.db");
  if (fs.existsSync(dbPath)) {
    const dbBackupDir = path.resolve(targetDir, "prisma");
    fs.mkdirSync(dbBackupDir, { recursive: true });
    try {
      fs.copyFileSync(dbPath, path.resolve(dbBackupDir, "kokkiri.db"));
      filesCount++;
    } catch (e) {
      console.error("Failed to backup SQLite DB:", e);
    }
  }

  const point: RestorePoint = {
    id,
    commitHash: gitInfo.commit,
    commitMessage: gitInfo.message,
    version,
    createdAt: new Date().toISOString(),
    type,
    note: note || (type === "automatic_pre_update" ? "Güncelleme öncesi otomatik sistem yedeği" : "Manuel geri yükleme noktası"),
    filesCount,
    backupPath: targetDir,
  };

  const all = listRestorePoints();
  all.unshift(point);

  // Keep maximum 20 restore points to save disk space
  const trimmed = all.slice(0, 20);
  saveRestorePoints(trimmed);

  return point;
}

export async function applySystemUpdate(): Promise<{
  success: boolean;
  message: string;
  snapshotCreated?: RestorePoint;
  methodUsed: "coolify_webhook" | "git_pull" | "simulated";
  details?: any;
}> {
  const settings = getUpdateSettings();
  let snapshot: RestorePoint | undefined;

  // 1. Create automatic restore point before updating
  if (settings.autoBackupBeforeUpdate) {
    try {
      snapshot = createRestorePoint(
        "automatic_pre_update",
        "Yeni sürüme güncelleme öncesi otomatik güvenlik yedeği"
      );
    } catch (err: any) {
      console.error("Failed to create pre-update restore point:", err);
    }
  }

  // 2. If Coolify Webhook is configured, call it
  if (settings.coolifyWebhookUrl?.trim()) {
    try {
      const webhookRes = await fetch(settings.coolifyWebhookUrl.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      return {
        success: webhookRes.ok,
        message: webhookRes.ok
          ? "Coolify dağıtım webhook'u başarıyla tetiklendi. Sunucu yeni sürümü indirip otomatik yeniden başlatacaktır."
          : `Coolify webhook yanıt hatası: HTTP ${webhookRes.status}`,
        snapshotCreated: snapshot,
        methodUsed: "coolify_webhook",
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Coolify webhook çağrısı başarısız: ${err.message}`,
        snapshotCreated: snapshot,
        methodUsed: "coolify_webhook",
      };
    }
  }

  // 3. If local git is available, run git fetch & git pull
  const gitInfo = getLocalGitInfo();
  if (gitInfo.available) {
    try {
      execSync(`git fetch origin ${settings.branch}`, {
        timeout: 20000,
        stdio: ["pipe", "pipe", "pipe"],
      });

      const pullOutput = execSync(`git reset --hard origin/${settings.branch}`, {
        encoding: "utf8",
        timeout: 20000,
        stdio: ["pipe", "pipe", "pipe"],
      }).trim();

      const newGitInfo = getLocalGitInfo();

      // Write updated version info
      fs.writeFileSync(
        VERSION_INFO_FILE,
        JSON.stringify(
          {
            commit: newGitInfo.commit,
            date: newGitInfo.date,
            message: newGitInfo.message,
            updatedAt: new Date().toISOString(),
          },
          null,
          2
        ),
        "utf8"
      );

      return {
        success: true,
        message: `Sistem başarıyla '${newGitInfo.commit}' sürümüne güncellendi.`,
        snapshotCreated: snapshot,
        methodUsed: "git_pull",
        details: { output: pullOutput, newCommit: newGitInfo.commit },
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Git güncelleme işlemi sırasında hata: ${err.message}`,
        snapshotCreated: snapshot,
        methodUsed: "git_pull",
      };
    }
  }

  // Fallback simulation
  return {
    success: true,
    message: "Yedekleme noktası başarıyla kaydedildi. (Coolify Webhook tanımlanmamış, yerel simülasyon tamamlandı)",
    snapshotCreated: snapshot,
    methodUsed: "simulated",
  };
}

export async function rollbackToRestorePoint(snapshotId: string): Promise<{
  success: boolean;
  message: string;
  snapshot: RestorePoint;
}> {
  const points = listRestorePoints();
  const snapshot = points.find((p) => p.id === snapshotId);

  if (!snapshot) {
    throw new Error(`Belirtilen geri yükleme noktası bulunamadı: ${snapshotId}`);
  }

  const snapshotDir = path.resolve(BACKUPS_DIR, snapshotId);
  if (!fs.existsSync(snapshotDir)) {
    throw new Error(`Yedek dosyaları diskte bulunamadı: ${snapshotDir}`);
  }

  // 1. Create a safety snapshot of the current state before rolling back!
  try {
    createRestorePoint(
      "rollback",
      `'${snapshot.commitHash}' (${snapshot.id}) sürümüne geri alma öncesi güvenlik yedeği`
    );
  } catch (e) {
    console.error("Safety backup before rollback failed:", e);
  }

  // 2. Restore JSON data files
  const dataBackupDir = path.resolve(snapshotDir, "data");
  if (fs.existsSync(dataBackupDir)) {
    const files = fs.readdirSync(dataBackupDir);
    for (const file of files) {
      if (file.endsWith(".json")) {
        const src = path.resolve(dataBackupDir, file);
        const dst = path.resolve(DATA_DIR, file);
        try {
          fs.copyFileSync(src, dst);
        } catch (e) {
          console.error(`Failed to restore ${file}:`, e);
        }
      }
    }
  }

  // 3. Restore SQLite database if present in backup
  const dbBackup = path.resolve(snapshotDir, "prisma", "kokkiri.db");
  if (fs.existsSync(dbBackup)) {
    const dbDst = path.resolve(process.cwd(), "prisma", "kokkiri.db");
    try {
      fs.copyFileSync(dbBackup, dbDst);
    } catch (e) {
      console.error("Failed to restore SQLite database:", e);
    }
  }

  // 4. If git is available, checkout the snapshot's commit
  const gitInfo = getLocalGitInfo();
  let gitResetDone = false;
  if (gitInfo.available && snapshot.commitHash) {
    try {
      execSync(`git reset --hard ${snapshot.commitHash}`, {
        timeout: 20000,
        stdio: ["pipe", "pipe", "pipe"],
      });
      gitResetDone = true;
    } catch (e) {
      console.error(`Git rollback to ${snapshot.commitHash} failed:`, e);
    }
  }

  // 5. Update version info file
  fs.writeFileSync(
    VERSION_INFO_FILE,
    JSON.stringify(
      {
        commit: snapshot.commitHash,
        date: snapshot.createdAt,
        message: snapshot.commitMessage,
        rolledBackAt: new Date().toISOString(),
      },
      null,
      2
    ),
    "utf8"
  );

  return {
    success: true,
    message: `Sistem başarıyla '${snapshot.commitHash}' sürümüne ve ${new Date(
      snapshot.createdAt
    ).toLocaleString("tr-TR")} tarihindeki veri durumuna geri döndürüldü.${
      gitResetDone ? " (Kod ve veriler tamamen senkronize edildi)" : " (Veriler geri yüklendi)"
    }`,
    snapshot,
  };
}

export function deleteRestorePoint(id: string): boolean {
  const points = listRestorePoints();
  const filtered = points.filter((p) => p.id !== id);
  if (filtered.length === points.length) return false;

  saveRestorePoints(filtered);

  // Attempt to delete directory from disk
  const dir = path.resolve(BACKUPS_DIR, id);
  if (fs.existsSync(dir)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (e) {
      console.error(`Failed to delete backup dir ${dir}:`, e);
    }
  }
  return true;
}
