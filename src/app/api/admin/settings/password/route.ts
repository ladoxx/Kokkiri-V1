import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getSession, comparePassword, hashPassword } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요한 요청입니다. 다시 로그인해 주세요." }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "현재 비밀번호, 새 비밀번호, 비밀번호 확인을 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "새 비밀번호는 최소 6자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "새 비밀번호와 비밀번호 확인이 일치하지 않습니다." },
        { status: 400 }
      );
    }

    // Find user in database
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
        where: { role: "SUPER_ADMIN" },
      });
    }

    if (!user) {
      // Fallback for default admin
      const defaultPassword = process.env.ADMIN_INIT_PASSWORD || "123123";
      if (currentPassword !== defaultPassword) {
        return NextResponse.json(
          { error: "현재 비밀번호가 일치하지 않습니다." },
          { status: 400 }
        );
      }

      // Create or update default admin in DB with new password
      const newPasswordHash = await hashPassword(newPassword);
      user = await prisma.user.upsert({
        where: { email: session.email },
        update: { passwordHash: newPasswordHash },
        create: {
          email: session.email,
          name: session.name || "최고 관리자",
          role: session.role,
          passwordHash: newPasswordHash,
          isActive: true,
        },
      });

      // Sync .env
      try {
        const envPath = path.resolve(process.cwd(), ".env");
        if (fs.existsSync(envPath)) {
          let envContent = fs.readFileSync(envPath, "utf8");
          envContent = envContent.replace(
            /ADMIN_INIT_PASSWORD=.*(?=\r?\n|$)/,
            `ADMIN_INIT_PASSWORD="${newPassword}"`
          );
          fs.writeFileSync(envPath, envContent, "utf8");
        }
      } catch {}

      return NextResponse.json({
        success: true,
        message: "비밀번호가 성공적으로 변경되었습니다. 다음 로그인부터 새 비밀번호를 사용하세요.",
      });
    }

    // Verify existing password
    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "현재 비밀번호가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    // Update with new hashed password on the existing user
    const newPasswordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    // Sync .env file
    try {
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, "utf8");
        envContent = envContent.replace(
          /ADMIN_INIT_PASSWORD=.*(?=\r?\n|$)/,
          `ADMIN_INIT_PASSWORD="${newPassword}"`
        );
        fs.writeFileSync(envPath, envContent, "utf8");
      }
    } catch {}

    return NextResponse.json({
      success: true,
      message: "비밀번호가 성공적으로 변경되었습니다. 다음 로그인부터 새 비밀번호를 사용하세요.",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: error.message || "비밀번호 변경 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
