import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { RoleType } from "@/lib/types/enums";

const JWT_SECRET = process.env.JWT_SECRET || "kokkiri-super-secret-jwt-key-change-in-production-2026-korea";
const COOKIE_NAME = "kokkiri_admin_token";

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: RoleType;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: TokenPayload, expiresIn: string | number = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function getCookieOptions(maxAgeSeconds?: number) {
  // Only enforce secure cookies if explicitly enabled or if running over HTTPS
  // This allows seamless login on direct IP addresses without SSL/domains in Coolify/Docker
  const cookieSecureEnv = process.env.COOKIE_SECURE;
  const isExplicitlySecure = cookieSecureEnv === "true";
  const isExplicitlyInsecure = cookieSecureEnv === "false";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const isHttpsSite = siteUrl.startsWith("https://");

  const secure = isExplicitlySecure ? true : isExplicitlyInsecure ? false : isHttpsSite;

  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds !== undefined ? maxAgeSeconds : 60 * 60 * 24 * 7, // 7 days
  };
}

// Role Hierarchy and Permissions
const ROLE_HIERARCHY: Record<RoleType, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  MANAGER: 2,
  STAFF: 1,
};

export function hasMinimumRole(userRole: RoleType, requiredRole: RoleType): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canManageUsers(role: RoleType): boolean {
  return role === RoleType.SUPER_ADMIN;
}

export function canManageSettings(role: RoleType): boolean {
  return role === RoleType.SUPER_ADMIN || role === RoleType.ADMIN;
}

export function canManageInquiries(role: RoleType): boolean {
  return hasMinimumRole(role, RoleType.STAFF);
}

export function canEditContent(role: RoleType): boolean {
  return hasMinimumRole(role, RoleType.MANAGER);
}

export async function requireAdminAuth(req?: Request): Promise<{
  authorized: boolean;
  user: TokenPayload | null;
  errorResponse?: NextResponse;
}> {
  // 1. Check HttpOnly cookie
  const session = await getSession();
  if (session && hasMinimumRole(session.role, RoleType.STAFF)) {
    return { authorized: true, user: session };
  }

  // 2. Check Bearer Authorization header if req is provided
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const verified = verifyToken(token);
      if (verified && hasMinimumRole(verified.role, RoleType.STAFF)) {
        return { authorized: true, user: verified };
      }
    }
  }

  return {
    authorized: false,
    user: null,
    errorResponse: NextResponse.json(
      { error: "인증되지 않은 요청입니다. 관리자 권한이 필요합니다.", code: "UNAUTHORIZED" },
      { status: 401 }
    ),
  };
}
