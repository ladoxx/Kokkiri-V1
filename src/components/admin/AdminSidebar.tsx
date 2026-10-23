"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  KeyRound,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  tab?: string;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: "대시보드 & 고객 관리",
    items: [
      { label: "대시보드 개요", href: "/admin", icon: LayoutDashboard },
      { label: "고객 문의 & CRM", href: "/admin/inquiries", icon: Inbox },
      { label: "알림 & 발송 기록", href: "/admin/notifications", icon: Bell },
    ],
  },
  {
    title: "콘텐츠 & 사이트 CMS",
    items: [
      { label: "네비게이션 메뉴 관리", href: "/admin/navigation", icon: Menu },
      { label: "문구 & 콘텐츠 편집", href: "/admin/content", icon: FileText },
      { label: "시공 전후 갤러리", href: "/admin/before-after", icon: MoveHorizontal },
      { label: "CHOKO 제품 관리", href: "/admin/products", icon: ShoppingBag },
      { label: "미디어 파일 보관함", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    title: "설정 & 인프라 보안",
    items: [
      {
        label: "통합 이메일 알림",
        href: "/admin/settings?tab=routing",
        icon: Mail,
        tab: "routing",
        badge: "통합",
      },
      {
        label: "시스템 업데이트 & 롤백",
        href: "/admin/updates",
        icon: RefreshCw,
        badge: "v1.0.6",
      },
      {
        label: "시네마틱 UX 설정",
        href: "/admin/settings?tab=cinematic",
        icon: Sparkles,
        tab: "cinematic",
      },
      {
        label: "회사 정보 & 시스템",
        href: "/admin/settings?tab=company",
        icon: Sliders,
        tab: "company",
      },
      {
        label: "계정 & 보안 관리",
        href: "/admin/settings?tab=security",
        icon: KeyRound,
        tab: "security",
      },
    ],
  },
];

function SidebarNavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  const isItemActive = (item: MenuItem): boolean => {
    if (item.tab) {
      if (pathname === "/admin/settings") {
        const activeTab = currentTab || "routing";
        return activeTab === item.tab;
      }
      return false;
    }
    if (item.href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(item.href) && !pathname.startsWith("/admin/settings");
  };

  return (
    <nav className="p-3.5 space-y-6">
      {MENU_SECTIONS.map((section, idx) => (
        <div key={idx} className="space-y-1.5">
          <div className="px-3 py-1 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
            <span>{section.title}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
          </div>

          <div className="space-y-1">
            {section.items.map((item) => {
              const active = isItemActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                    active
                      ? "bg-[#477B56] text-white shadow-sm shadow-[#477B56]/30 font-black"
                      : "text-gray-300 hover:text-white hover:bg-white/5 font-semibold"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        active
                          ? "text-white"
                          : "text-gray-400 group-hover:text-white group-hover:scale-105"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
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

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      {/* 1. Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#121915]">
        <Link href="/admin" onClick={onClose} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <Image
              src="/brand/kokkiri-elephant-logo.png"
              alt="Kokkiri Elephant Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="font-black text-sm tracking-tight text-white leading-none">
              KOKKIRI ADMIN
            </div>
            <div className="text-[10px] text-[#86efac] mt-1 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>통합 관리자 센터</span>
            </div>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 lg:hidden cursor-pointer"
          aria-label="사이드바 닫기"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Scrollable Categorized Navigation */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <Suspense
          fallback={
            <div className="p-4 text-xs text-gray-400 animate-pulse">
              메뉴 불러오는 중...
            </div>
          }
        >
          <SidebarNavContent onClose={onClose} />
        </Suspense>
      </div>

      {/* 3. Bottom Profile, Site Link, and Logout */}
      <div className="p-3.5 border-t border-white/10 space-y-2 shrink-0 bg-[#121915]">
        <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400/50" />
            <span className="text-[11px] font-bold text-gray-300">최고 관리자 모드</span>
          </div>
          <span className="text-[10px] font-bold text-[#86efac] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            인증됨
          </span>
        </div>

        <Link
          href="/"
          target="_blank"
          onClick={onClose}
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-semibold"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            <span>웹사이트 바로가기</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>관리자 로그아웃</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Static Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#17201C] text-white flex-col shrink-0 min-h-screen border-r border-white/10 sticky top-0 h-screen overflow-hidden">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Off-Canvas Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#17201C] text-white flex flex-col justify-between overflow-hidden transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
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
