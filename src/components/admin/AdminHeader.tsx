"use client";

import React, { useEffect, useState } from "react";
import { User, Menu } from "lucide-react";

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

      <div className="flex items-center gap-3 sm:gap-4">
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
