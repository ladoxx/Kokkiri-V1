"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
  Building2,
  Leaf,
  ChevronDown,
  MoveHorizontal,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Trees,
  Warehouse,
  ShoppingBag,
  Phone,
} from "lucide-react";

import { DEFAULT_NAVIGATION, SiteNavigationSettings } from "@/lib/types/cms";

interface SubLink {
  label: string;
  href: string;
  desc?: string;
  badge?: string;
  visible?: boolean;
}

interface NavCategory {
  id?: string;
  label: string;
  href: string;
  badge?: string;
  visible?: boolean;
  items?: SubLink[];
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [navData, setNavData] = useState<SiteNavigationSettings>(DEFAULT_NAVIGATION);
  const pathname = usePathname();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch dynamic navigation settings
  useEffect(() => {
    fetch("/api/navigation")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.categories)) {
          setNavData(data);
        }
      })
      .catch(() => {});
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Filter only visible categories and sub-items
  const navCategories: NavCategory[] = navData.categories
    .filter((cat) => cat.visible !== false)
    .map((cat) => ({
      id: cat.id,
      label: cat.label,
      href: cat.href,
      badge: cat.badge,
      visible: cat.visible,
      items: (cat.items || []).filter((sub) => sub.visible !== false),
    }));

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMobileCategory = (label: string) => {
    setExpandedMobileCategory(expandedMobileCategory === label ? null : label);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#F8F8F4]/98 backdrop-blur-md shadow-md border-b border-[#202622]/10 py-3"
            : "bg-[#F8F8F4]/90 backdrop-blur-xs border-b border-black/5 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#173F30]/15 flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-300 shadow-xs overflow-hidden">
                <Image
                  src="/brand/kokkiri-elephant-logo.png"
                  alt="주식회사 코끼리(KOKKIRI) 공식 심볼 로고"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#173F30] leading-none">
                  KOKKIRI
                </span>
                <span className="text-[10px] tracking-wider text-[#477B56] font-semibold uppercase mt-0.5">
                  Business Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation with Dropdowns */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 relative">
              {navCategories.map((cat) => {
                const hasDropdown = Boolean(cat.items && cat.items.length > 0);
                const isActive =
                  pathname === cat.href || (cat.href !== "/" && pathname.startsWith(cat.href));
                const isOpen = activeDropdown === cat.label;

                return (
                  <div
                    key={cat.label}
                    className="relative"
                    onMouseEnter={() => hasDropdown && handleMouseEnter(cat.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={cat.href}
                      className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isActive || isOpen
                          ? "text-[#173F30] bg-[#173F30]/8 font-bold"
                          : "text-[#202622]/80 hover:text-[#173F30] hover:bg-[#173F30]/5"
                      }`}
                    >
                      <span>{cat.label}</span>
                      {hasDropdown && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 text-gray-500 ${
                            isOpen ? "rotate-180 text-[#173F30]" : ""
                          }`}
                        />
                      )}
                      {cat.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#477B56]/15 text-[#173F30]">
                          {cat.badge}
                        </span>
                      )}
                    </Link>

                    {/* Smooth Animated Desktop Dropdown */}
                    {hasDropdown && isOpen && (
                      <div
                        className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                        onMouseEnter={() => handleMouseEnter(cat.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="space-y-1">
                          {cat.items!.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="block p-2.5 rounded-xl hover:bg-[#F8F8F4] transition-colors group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-900 group-hover:text-[#173F30] transition-colors">
                                  {sub.label}
                                </span>
                                {sub.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                              {sub.desc && (
                                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-1">
                                  {sub.desc}
                                </p>
                              )}
                            </Link>
                          ))}
                        </div>

                        <div className="mt-2 pt-2 border-t border-gray-100 px-2 flex justify-between items-center text-[11px]">
                          <Link
                            href={cat.href}
                            className="text-[#173F30] font-bold hover:underline flex items-center gap-1"
                          >
                            <span>{cat.label} 메인으로 이동</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Action CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#173F30] text-[#F8F8F4] text-xs font-bold hover:bg-[#173F30]/90 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <span>온라인 문의 & 상담</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Menu Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                href="/contact"
                className="px-3 py-1.5 rounded-lg bg-[#173F30] text-[#F8F8F4] text-xs font-semibold"
              >
                문의 & 상담
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-[#202622] hover:bg-black/5 focus:outline-none cursor-pointer border border-black/10 bg-white"
                aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen/Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#F8F8F4] border-b border-[#202622]/15 shadow-2xl px-5 py-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200 z-50">
            {/* Quick 3 Brand Direct Jumps */}
            <div className="mb-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#477B56] mb-2 px-1">
                브랜드 바로가기
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Link
                  href="/cleaning"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center p-3 rounded-xl bg-white border border-[#173F30]/15 text-[#173F30] text-center shadow-xs"
                >
                  <Sparkles className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">코끼리</span>
                  <span className="text-[10px] text-gray-500">클리닝</span>
                </Link>
                <Link
                  href="/koto"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center p-3 rounded-xl bg-white border border-[#243A50]/15 text-[#243A50] text-center shadow-xs"
                >
                  <Building2 className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">KOTO</span>
                  <span className="text-[10px] text-gray-500">AI 보안·시설</span>
                </Link>
                <Link
                  href="/choko"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center p-3 rounded-xl bg-white border border-[#8C6C43]/15 text-[#8C6C43] text-center shadow-xs"
                >
                  <Leaf className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">CHOKO</span>
                  <span className="text-[10px] text-gray-500">에코제품</span>
                </Link>
              </div>
            </div>

            {/* Accordion Menu List */}
            <div className="space-y-1 mb-6 border-t border-black/5 pt-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#477B56] mb-2 px-1">
                메뉴 목록
              </div>

              {navCategories.map((cat) => {
                const hasSub = Boolean(cat.items && cat.items.length > 0);
                const isExpanded = expandedMobileCategory === cat.label;

                return (
                  <div key={cat.label} className="rounded-xl bg-white border border-black/5 overflow-hidden">
                    <div className="flex items-center justify-between p-3">
                      <Link
                        href={cat.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm font-bold text-gray-900 flex-1 hover:text-[#173F30]"
                      >
                        {cat.label}
                      </Link>

                      {hasSub && (
                        <button
                          type="button"
                          onClick={() => toggleMobileCategory(cat.label)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180 text-[#173F30]" : ""}`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Sublinks Accordion */}
                    {hasSub && isExpanded && (
                      <div className="bg-[#F8F8F4] px-4 py-2 border-t border-gray-100 space-y-2">
                        {cat.items!.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-1.5 text-xs text-gray-700 hover:text-[#173F30] font-medium"
                          >
                            <div className="flex items-center justify-between">
                              <span>• {sub.label}</span>
                              {sub.badge && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                  {sub.badge}
                                </span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-black/10 flex flex-col gap-2">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3.5 rounded-xl bg-[#173F30] text-white font-bold text-sm shadow-md"
              >
                온라인 문의 & 상담하기
              </Link>
              <div className="text-center mt-2">
                <span className="text-xs text-gray-500">상담 문의 02-1588-0000 (평일 09:00~18:00)</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
        />
      )}
    </>
  );
}
