"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, Menu, Bot, Sparkles } from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 lg:hidden border border-gray-200 cursor-pointer active:scale-95 transition-transform"
          aria-label="관리자 메뉴 열기"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:inline">
          KOKKIRI Central Management Console
        </span>
        <span className="text-xs font-bold text-gray-900 sm:hidden">
          KOKKIRI ADMIN
        </span>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* AI Agent Quick Status Pill */}
        <Link
          href="/admin/agents"
          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
          title="AI 에이전트 시스템 진단 및 코드 관제 센터 열기"
        >
          <Bot className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">AI 에이전트 관제</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </Link>

        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-gray-900">{user.name}</div>
              <div className="text-[10px] text-gray-400 font-mono">{user.email}</div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-[#173F30]/10 text-[#173F30] text-[10px] font-bold">
              {user.role}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">최고 관리자</span>
          </div>
        )}
      </div>
    </header>
  );
}
