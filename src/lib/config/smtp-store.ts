import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  adminNotificationEmail: string;
  kakaoApiKey?: string;
  kakaoSenderKey?: string;
  kakaoTestMode?: boolean;
  updatedAt?: string;
}

const CONFIG_DIR = path.join(process.cwd(), "data");
const CONFIG_FILE = path.join(CONFIG_DIR, "smtp-config.json");

// Default initial config based on environment variables or defaults
function getDefaultConfig(): SmtpConfig {
  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || "notification@kokkiri.com",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || "KOKKIRI 알림센터 <notification@kokkiri.com>",
    adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || "admin@kokkiri.com",
    kakaoApiKey: process.env.KAKAO_ALIMTALK_API_KEY || "SANDBOX_API_KEY",
    kakaoSenderKey: process.env.KAKAO_SENDER_KEY || "SANDBOX_PROFILE_KEY",
    kakaoTestMode: process.env.KAKAO_TEST_MODE !== "false",
    updatedAt: new Date().toISOString(),
  };
}

export function getSmtpConfig(): SmtpConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, "utf-8");
      const parsed = JSON.parse(data);
      return { ...getDefaultConfig(), ...parsed };
    }
  } catch (err) {
    console.error("Error reading SMTP config file:", err);
  }
  return getDefaultConfig();
}

export function saveSmtpConfig(newConfig: Partial<SmtpConfig>): SmtpConfig {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    const current = getSmtpConfig();
    const updated: SmtpConfig = {
      ...current,
      ...newConfig,
      port: Number(newConfig.port) || current.port,
      secure: typeof newConfig.secure === "boolean" ? newConfig.secure : current.secure,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return updated;
  } catch (err) {
    console.error("Error saving SMTP config file:", err);
    throw err;
  }
}

export async function verifySmtpConnection(customConfig?: Partial<SmtpConfig>): Promise<{ success: boolean; message: string }> {
  const cfg = customConfig ? { ...getSmtpConfig(), ...customConfig } : getSmtpConfig();

  if (!cfg.host || !cfg.user) {
    return { success: false, message: "SMTP 호스트와 사용자 계정이 설정되지 않았습니다." };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: cfg.host,
      port: Number(cfg.port) || 587,
      secure: cfg.secure,
      auth: {
        user: cfg.user,
        pass: cfg.pass,
      },
      connectionTimeout: 8000,
    });

    await transporter.verify();
    return { success: true, message: `SMTP 서버(${cfg.host}:${cfg.port}) 연결 및 인증이 성공적으로 확인되었습니다.` };
  } catch (error: any) {
    console.error("SMTP verify error:", error);
    return {
      success: false,
      message: `SMTP 연결 실패: ${error.message || "서버 응답 없음 또는 인증 실패"}`,
    };
  }
}
