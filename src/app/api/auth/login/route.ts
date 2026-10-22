import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminLoginSchema } from "@/lib/validations/inquiry";
import { comparePassword, generateToken, getCookieOptions } from "@/lib/auth/auth";
import { RoleType } from "@/lib/types/enums";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "입력 정보가 올바르지 않습니다.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    let user = null;
    let totalUsers = 0;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
      totalUsers = await prisma.user.count();
    } catch {
      // Prisma offline or connection issue: check default fallback admin
    }

    // Default emergency fallback check ONLY if DB has zero users (first-time boot before seeding)
    const defaultEmail = process.env.ADMIN_INIT_EMAIL || "mert@mert.com";
    const defaultPassword = process.env.ADMIN_INIT_PASSWORD || "123123";

    if (!user) {
      if (totalUsers === 0 && email === defaultEmail && password === defaultPassword) {
        user = {
          id: "admin-default-id",
          email: defaultEmail,
          name: process.env.ADMIN_INIT_NAME || "최고 관리자",
          role: RoleType.SUPER_ADMIN,
          passwordHash: "",
          isActive: true,
        };
      } else {
        return NextResponse.json(
          { error: "이메일 또는 비밀번호가 일치하지 않습니다." },
          { status: 401 }
        );
      }
    } else {
      if (!user.isActive) {
        return NextResponse.json(
          { error: "비활성화된 계정입니다. 관리자에게 문의하세요." },
          { status: 403 }
        );
      }

      const isMatch = await comparePassword(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "이메일 또는 비밀번호가 일치하지 않습니다." },
          { status: 401 }
        );
      }
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as RoleType,
    });

    const cookieOptions = getCookieOptions();
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set(cookieOptions.name, token, cookieOptions);

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "서버 오류";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
