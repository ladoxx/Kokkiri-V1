"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Video, Leaf, Building2, MoveHorizontal, ArrowUpRight, Phone } from "lucide-react";
import { UiSettings, DEFAULT_UI_SETTINGS } from "@/lib/types/ui-settings";

interface PageTransitionWrapperProps {
  children: React.ReactNode;
  initialSettings?: UiSettings;
}

interface BrandTransitionMeta {
  domain: string;
  name: string;
  badge: string;
  sub: string;
  category: string;
  tagline: string;
  accentColor: string;
  glowColor: string;
  icon: any;
}

// Map any path into its high-level Brand / Main Context Domain
function getBrandDomain(path: string): string {
  if (path.startsWith("/choko")) return "choko";
  if (path.startsWith("/koto")) return "koto";
  if (path.startsWith("/cleaning")) return "cleaning";
  if (path.startsWith("/about") || path.startsWith("/brands") || path.startsWith("/news")) return "about";
  if (path.startsWith("/projects") || path.includes("/projects")) return "projects";
  if (path.startsWith("/request-quote") || path.includes("request-quote")) return "quote";
  if (path.startsWith("/contact")) return "contact";
  if (path === "/") return "home";
  return "home";
}

function getBrandTransitionMeta(path: string): BrandTransitionMeta {
  const domain = getBrandDomain(path);

  // 1. CHOKO Eco Lifecare
  if (domain === "choko") {
    return {
      domain: "choko",
      name: "CHOKO",
      badge: "에코 라이프케어",
      sub: "지속 가능한 친환경 에코 라이프케어",
      category: "CHOKO Eco Lifecare",
      tagline: "대나무 화장지 · 비건 펫푸드 · 자연유래 탈취제",
      accentColor: "#D4A373",
      glowColor: "rgba(212, 163, 115, 0.55)",
      icon: Leaf,
    };
  }

  // 2. KOTO AI Security
  if (domain === "koto") {
    return {
      domain: "koto",
      name: "KOTO",
      badge: "AI 보안 & 시설 솔루션",
      sub: "AI 지능형 보안 카메라 & 스마트 시설 솔루션",
      category: "KOTO AI Security",
      tagline: "4K AI 스마트 CCTV · 24H 보안 경비 · 조경 · 펜스",
      accentColor: "#3E82B8",
      glowColor: "rgba(62, 130, 184, 0.55)",
      icon: Video,
    };
  }

  // 3. KOKKIRI Cleaning
  if (domain === "cleaning") {
    return {
      domain: "cleaning",
      name: "KOKKIRI",
      badge: "프리미엄 클리닝",
      sub: "프리미엄 공간 위생 & 딥 클리닝 솔루션",
      category: "KOKKIRI Cleaning",
      tagline: "오피스 케어 · 사옥 정기 관리 · 준공 특수 클리닝",
      accentColor: "#65A377",
      glowColor: "rgba(101, 163, 119, 0.55)",
      icon: Sparkles,
    };
  }

  // 4. KOKKIRI About / 회사 소개
  if (domain === "about") {
    return {
      domain: "about",
      name: "KOKKIRI",
      badge: "회사 소개 · 기업 개요",
      sub: "주식회사 코끼리 기업 철학 & 비전",
      category: "About KOKKIRI",
      tagline: "공간의 가치를 높이고 지속 가능한 내일을 만듭니다",
      accentColor: "#86efac",
      glowColor: "rgba(134, 239, 172, 0.55)",
      icon: Building2,
    };
  }

  // 5. Projects
  if (domain === "projects") {
    return {
      domain: "projects",
      name: "PROJECTS",
      badge: "시공 & 프로젝트 실적",
      sub: "클리닝 & AI CCTV 주요 시공 실적",
      category: "Portfolio & Case Studies",
      tagline: "프라임 타워 대리석 복원 · 물류 허브 지능형 관제 실적",
      accentColor: "#3E82B8",
      glowColor: "rgba(62, 130, 184, 0.5)",
      icon: MoveHorizontal,
    };
  }

  // 6. Quote
  if (domain === "quote") {
    return {
      domain: "quote",
      name: "ESTIMATE",
      badge: "1:1 맞춤 견적",
      sub: "무료 방문 실사 및 1:1 맞춤 견적 신청",
      category: "Free Estimate & Consultation",
      tagline: "공간 규모와 목적에 맞는 최적의 견적 제안",
      accentColor: "#86efac",
      glowColor: "rgba(134, 239, 172, 0.5)",
      icon: ArrowUpRight,
    };
  }

  // 7. Contact
  if (domain === "contact") {
    return {
      domain: "contact",
      name: "CONTACT",
      badge: "고객 문의 & 상담",
      sub: "1:1 맞춤 견적 및 고객 지원 상담",
      category: "Customer Support & Inquiry",
      tagline: "신속하고 정확한 고객 맞춤형 솔루션을 제안합니다",
      accentColor: "#86efac",
      glowColor: "rgba(134, 239, 172, 0.5)",
      icon: Phone,
    };
  }

  // 8. Main Home (Default)
  return {
    domain: "home",
    name: "KOKKIRI",
    badge: "비즈니스 플랫폼",
    sub: "공간의 가치를 높이는 새로운 기준",
    category: "KOKKIRI Business Platform",
    tagline: "클리닝 · AI 보안 · 라이프케어 통합 파트너",
    accentColor: "#86efac",
    glowColor: "rgba(134, 239, 172, 0.55)",
    icon: Sparkles,
  };
}

export function PageTransitionWrapper({
  children,
  initialSettings,
}: PageTransitionWrapperProps) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<UiSettings>(
    initialSettings || DEFAULT_UI_SETTINGS
  );
  const [isMounted, setIsMounted] = useState(false);

  // Animation trigger states
  const isFirstMountRef = useRef(true);
  const prevPathnameRef = useRef(pathname);
  const prevDomainRef = useRef(getBrandDomain(pathname));
  const curtainTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [transitionCycle, setTransitionCycle] = useState(0);
  const [isCurtainActive, setIsCurtainActive] = useState(false);
  const [activeBrandMeta, setActiveBrandMeta] = useState<BrandTransitionMeta>(
    getBrandTransitionMeta(pathname)
  );

  // Load UI settings
  useEffect(() => {
    setIsMounted(true);
    if (!initialSettings) {
      fetch("/api/settings/ui")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setSettings(data);
        })
        .catch(() => {});
    }
  }, [initialSettings]);

  // Handle Admin live test event
  useEffect(() => {
    const handlePreviewEvent = (e: CustomEvent<{ path?: string }>) => {
      const previewPath = e.detail?.path || "/about";
      const meta = getBrandTransitionMeta(previewPath);

      if (curtainTimerRef.current) {
        clearTimeout(curtainTimerRef.current);
      }

      setActiveBrandMeta(meta);
      setTransitionCycle((c) => c + 1);
      setIsCurtainActive(true);

      const durationMs = settings.curtainDurationMs || 1400;
      curtainTimerRef.current = setTimeout(() => {
        setIsCurtainActive(false);
      }, durationMs);
    };

    window.addEventListener(
      "kokkiri_preview_curtain" as any,
      handlePreviewEvent as any
    );
    return () => {
      window.removeEventListener(
        "kokkiri_preview_curtain" as any,
        handlePreviewEvent as any
      );
      if (curtainTimerRef.current) {
        clearTimeout(curtainTimerRef.current);
      }
    };
  }, [settings.curtainDurationMs]);

  // Route change listener
  useEffect(() => {
    // Skip initial mount (so cold page refresh loads normally)
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      prevPathnameRef.current = pathname;
      prevDomainRef.current = getBrandDomain(pathname);
      return;
    }

    // Same path clicked
    if (prevPathnameRef.current === pathname) {
      return;
    }

    const currentDomain = getBrandDomain(pathname);
    const prevDomain = prevDomainRef.current;

    prevPathnameRef.current = pathname;
    prevDomainRef.current = currentDomain;

    if (!settings.transitionsEnabled) {
      return;
    }

    const scope = settings.transitionScope || "brand_change_only";
    const isDomainChanged = prevDomain !== currentDomain;

    // In brand_change_only mode, don't trigger curtain if navigating within the same brand
    if (scope === "brand_change_only" && !isDomainChanged) {
      return;
    }

    // Trigger curtain transition
    if (settings.transitionStyle === "cinematic_curtain") {
      const meta = getBrandTransitionMeta(pathname);

      if (curtainTimerRef.current) {
        clearTimeout(curtainTimerRef.current);
      }

      setActiveBrandMeta(meta);
      setTransitionCycle((c) => c + 1);
      setIsCurtainActive(true);

      const durationMs = settings.curtainDurationMs || 1400;
      curtainTimerRef.current = setTimeout(() => {
        setIsCurtainActive(false);
      }, durationMs);
    }
  }, [
    pathname,
    settings.transitionsEnabled,
    settings.transitionStyle,
    settings.transitionScope,
    settings.curtainDurationMs,
  ]);

  if (!isMounted) {
    return <>{children}</>;
  }

  // Duration calculations
  const totalDurationSec = (settings.curtainDurationMs || 1400) / 1000;
  const sweepInSec = 0.35;
  const sweepOutSec = 0.35;
  const holdStartRatio = sweepInSec / totalDurationSec;
  const holdEndRatio = (totalDurationSec - sweepOutSec) / totalDurationSec;

  const IconComponent = activeBrandMeta.icon;

  return (
    <>
      {/* Cinematic Organic Dark Green Curtain Overlay */}
      <AnimatePresence>
        {isCurtainActive && (
          <motion.div
            key={`curtain-cycle-${transitionCycle}`}
            initial={{ y: "100%" }}
            animate={{
              y: ["100%", "0%", "0%", "-100%"],
            }}
            transition={{
              duration: totalDurationSec,
              times: [0, holdStartRatio, holdEndRatio, 1],
              ease: [0.76, 0, 0.24, 1],
            }}
            onAnimationComplete={() => {
              setIsCurtainActive(false);
            }}
            className="fixed inset-0 z-[999999] pointer-events-none flex flex-col items-center justify-center overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(27, 65, 48, 0.99) 0%, rgba(12, 28, 21, 0.99) 70%, rgba(8, 19, 14, 1) 100%)",
            }}
          >
            {/* Top Organic Wave */}
            <div className="absolute -top-12 sm:-top-20 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
              <svg
                viewBox="0 0 1440 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-12 sm:h-20 text-[#0C1C15] fill-current"
              >
                <path d="M0,0 C360,110 1080,110 1440,0 L1440,120 L0,120 Z" />
              </svg>
            </div>

            {/* Ambient Radial Illumination */}
            <motion.div
              animate={{
                scale: [0.9, 1.15, 0.95],
                opacity: [0.4, 0.7, 0.45],
              }}
              transition={{
                duration: totalDurationSec,
                ease: "easeInOut",
              }}
              className="absolute w-[480px] sm:w-[700px] h-[480px] sm:h-[700px] rounded-full blur-[110px] pointer-events-none"
              style={{
                backgroundColor: activeBrandMeta.glowColor,
              }}
            />

            {/* Center Stage Presentation */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">
              {/* Elephant Logo & Section Badge */}
              <motion.div
                initial={{ scale: 0.75, opacity: 0, y: -10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-lg"
              >
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shadow-xs overflow-hidden">
                  <Image
                    src="/brand/kokkiri-elephant-logo.png"
                    alt="Kokkiri"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </div>
                <span
                  className="text-[11px] font-extrabold uppercase tracking-widest text-white/90"
                  style={{ color: activeBrandMeta.accentColor }}
                >
                  {activeBrandMeta.badge}
                </span>
                <IconComponent className="w-3.5 h-3.5 text-white/80" />
              </motion.div>

              {/* Massive Brand Title */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.88, letterSpacing: "0.15em" }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  letterSpacing: "0.28em",
                }}
                transition={{
                  delay: 0.2,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-6xl sm:text-8xl lg:text-9xl font-black text-white uppercase tracking-[0.28em] leading-none drop-shadow-[0_0_35px_rgba(255,255,255,0.25)] mb-3"
              >
                {activeBrandMeta.name}
              </motion.h2>

              {/* Subtitle with Expanding Gradient Line */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.4 }}
                className="flex items-center gap-3 mt-1 mb-2"
              >
                <div
                  className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, transparent, ${activeBrandMeta.accentColor})`,
                  }}
                />
                <span className="text-xs sm:text-sm font-bold tracking-wider text-white/90">
                  {activeBrandMeta.sub}
                </span>
                <div
                  className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to left, transparent, ${activeBrandMeta.accentColor})`,
                  }}
                />
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.4 }}
                className="text-[11px] sm:text-xs text-white/65 font-medium tracking-wide"
              >
                {activeBrandMeta.tagline}
              </motion.p>

              {/* Expanding Beam */}
              <motion.div
                initial={{ width: "0%", opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{
                  delay: 0.25,
                  duration: totalDurationSec * 0.5,
                  ease: "easeInOut",
                }}
                className="h-[2px] rounded-full mt-6 max-w-xs mx-auto shadow-sm"
                style={{
                  backgroundImage: `linear-gradient(to right, transparent, ${activeBrandMeta.accentColor}, transparent)`,
                }}
              />
            </div>

            {/* Bottom Organic Wave */}
            <div className="absolute -bottom-12 sm:-bottom-20 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
              <svg
                viewBox="0 0 1440 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-12 sm:h-20 text-[#0C1C15] fill-current"
              >
                <path d="M0,0 L1440,0 C1080,110 360,110 0,0 Z" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Page Content Container: Smooth Zoom-in Focus Entrance */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{
            opacity: isCurtainActive ? 0 : 0.7,
            scale: isCurtainActive ? 1.04 : 1.0,
            y: isCurtainActive ? 14 : 0,
            filter: isCurtainActive ? "blur(4px)" : "blur(0px)",
          }}
          animate={{
            opacity: 1,
            scale: 1.0,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            delay: isCurtainActive ? totalDurationSec * 0.65 : 0,
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-full flex-1"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
