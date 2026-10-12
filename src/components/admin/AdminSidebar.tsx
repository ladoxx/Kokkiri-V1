"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  ShoppingBag,
  Bell,
  Sliders,
  LogOut,
  ExternalLink,
  MoveHorizontal,
  ImageIcon,
  Sparkles,
  X,
  Mail,
  Menu,
  FileText,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const menuItems = [
    { label: "대시보드 개요", href: "/admin", icon: LayoutDashboard },
    { label: "고객 문의 & CRM", href: "/admin/inquiries", icon: Inbox },
    { label: "메뉴 관리 (WordPress형)", href: "/admin/navigation", icon: Menu },
    { label: "문구 & 콘텐츠 CMS", href: "/admin/content", icon: FileText },
    { label: "시공 전후 관리", href: "/admin/before-after", icon: MoveHorizontal },
    { label: "CHOKO 제품 관리", href: "/admin/products", icon: ShoppingBag },
    { label: "미디어 보관함", href: "/admin/media", icon: ImageIcon },
    { label: "시네마틱 UX 설정", href: "/admin/settings?tab=cinematic", icon: Sparkles },
    { label: "스마트 이메일 라우팅", href: "/admin/settings?tab=routing", icon: Mail },
    { label: "알림 & 발송 기록", href: "/admin/notifications", icon: Bell },
    { label: "시스템 & 연동 설정", href: "/admin/settings", icon: Sliders },
  ];

  const sidebarContent = (
    <>
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" onClick={onClose} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden shadow-xs shrink-0">
              <Image
                src="/brand/kokkiri-elephant-logo.png"
                alt="Kokkiri Elephant Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white leading-none">
                KOKKIRI ADMIN
              </div>
              <div className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">
                통합 관리자 센터
              </div>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 lg:hidden cursor-pointer"
            aria-label="사이드바 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-2">
            주요 관리 메뉴
          </div>

          {menuItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#477B56] text-white shadow-sm"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile and Utilities */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          onClick={onClose}
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-gray-400" />
            <span>웹사이트 바로가기</span>
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>관리자 로그아웃</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Desktop Static Sidebar (Visible on screens >= lg) */}
      <aside className="hidden lg:flex w-64 bg-[#17201C] text-white flex-col justify-between shrink-0 min-h-screen border-r border-white/10 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Off-Canvas Drawer (Visible on screens < lg when opened) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#17201C] text-white flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>

      {/* 3. Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}
    </>
  );
}
