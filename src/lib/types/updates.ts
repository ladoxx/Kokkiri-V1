export interface RestorePoint {
  id: string; // e.g. "snapshot-20261022-191500"
  commitHash: string; // short commit hash, e.g. "8f0c03b"
  commitMessage: string;
  version: string; // e.g. "1.0.1"
  createdAt: string; // ISO string
  type: "automatic_pre_update" | "manual" | "rollback";
  note: string;
  filesCount: number;
  backupPath: string;
}

export interface UpdateSettings {
  coolifyWebhookUrl: string; // Optional Coolify deploy webhook URL
  gitRepo: string; // e.g. "ladoxx/Kokkiri-V1"
  branch: string; // "main"
  autoBackupBeforeUpdate: boolean;
  updatedAt?: string;
}

export interface SystemUpdateInfo {
  currentVersion: string;
  currentCommit: string;
  currentCommitDate: string;
  currentCommitMessage: string;
  branch: string;
  gitRepo: string;
  isGitAvailable: boolean;
  isCoolifyConfigured: boolean;

  // Remote GitHub Status
  remoteCommit?: string;
  remoteCommitDate?: string;
  remoteCommitMessage?: string;
  remoteAuthor?: string;
  hasUpdate: boolean;
  commitsBehind?: number;
  lastCheckedAt: string;
  checkError?: string;
}
