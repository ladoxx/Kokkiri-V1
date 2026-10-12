import { NextResponse } from "next/server";
import { getCookieOptions } from "@/lib/auth/auth";
import { z } from "zod";

const LogoutSchema = z.object({}).passthrough();

export async function POST(req?: Request) {
  if (req) {
    try {
      const body = await req.json().catch(() => ({}));
      LogoutSchema.safeParse(body);
    } catch {}
  }
  const cookieOptions = getCookieOptions();
  const response = NextResponse.json({ success: true, message: "로그아웃되었습니다." });
  response.cookies.delete(cookieOptions.name);
  return response;
}
