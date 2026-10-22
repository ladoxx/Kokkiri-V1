import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getSession, comparePassword, hashPassword, generateToken, getCookieOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { RoleType } from "@/lib/types/enums";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, name: true, role: true, phone: true },
    });

    return NextResponse.json({
      user: user || {
        id: session.userId,
        email: session.email,
        name: session.name,
        role: session.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        name: session.name,
        role: session.role,
      },
    });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요한 요청입니다. 다시 로그인해 주세요." }, { status: 401 });
  }

  try {
    const { newUsername, name, currentPassword } = await req.json();

    if (!newUsername || !currentPassword) {
      return NextResponse.json(
        { error: "새 아이디/이메일과 현재 비밀번호를 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    const trimmedUsername = newUsername.trim();
    if (trimmedUsername.length < 3) {
      return NextResponse.json(
        { error: "아이디/이메일은 최소 3자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // 1. Find current user
    let user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: session.email },
      });
    }

    if (!user) {
      user = await prisma.user.findFirst({
        where: { role: RoleType.SUPER_ADMIN },
      });
    }

    // 2. Verify current password
    if (user) {
      const isMatch = await comparePassword(currentPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "현재 비밀번호가 일치하지 않습니다." },
          { status: 400 }
        );
      }
    } else {
      const defaultPassword = process.env.ADMIN_INIT_PASSWORD || "123123";
      if (currentPassword !== defaultPassword) {
        return NextResponse.json(
          { error: "현재 비밀번호가 일치하지 않습니다." },
          { status: 400 }
        );
      }
    }

    // 3. Check uniqueness if changing
    if (user && user.email !== trimmedUsername) {
      const conflict = await prisma.user.findUnique({
        where: { email: trimmedUsername },
      });
      if (conflict && conflict.id !== user.id) {
        return NextResponse.json(
          { error: "이미 다른 관리자가 사용 중인 아이디/이메일입니다. 다른 아이디를 입력해 주세요." },
          { status: 400 }
        );
      }
    }

    // 4. Update or create user
    let updatedUser;
    if (user) {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          email: trimmedUsername,
          ...(name ? { name: name.trim() } : {}),
        },
      });

      // Remove any lingering duplicate super admin records
      await prisma.user.deleteMany({
        where: {
          id: { not: user.id },
          role: RoleType.SUPER_ADMIN,
        },
      });
    } else {
      const newPasswordHash = await hashPassword(currentPassword);
      updatedUser = await prisma.user.create({
        data: {
          email: trimmedUsername,
          name: name?.trim() || session.name || "최고 관리자",
          passwordHash: newPasswordHash,
          role: session.role || RoleType.SUPER_ADMIN,
          isActive: true,
        },
      });
    }

    // Synchronize .env file with updated admin email
    try {
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, "utf8");
        envContent = envContent.replace(
          /ADMIN_INIT_EMAIL=.*(?=\r?\n|$)/,
          `ADMIN_INIT_EMAIL="${trimmedUsername}"`
        );
        fs.writeFileSync(envPath, envContent, "utf8");
      }
    } catch {}

    // 5. Generate refreshed session token with updated email/name
    const token = generateToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role as RoleType,
    });

    const cookieOptions = getCookieOptions();
    const response = NextResponse.json({
      success: true,
      message: `관리자 계정 아이디가 '${updatedUser.email}'(으)로 성공적으로 변경되었습니다.`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    });

    response.cookies.set(cookieOptions.name, token, cookieOptions);
    return response;
  } catch (error: any) {
    console.error("Change username error:", error);
    return NextResponse.json(
      { error: error.message || "계정 변경 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
