"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Video, Leaf, X } from "lucide-react";
import { UiSettings, DEFAULT_UI_SETTINGS } from "@/lib/types/ui-settings";

interface CinematicSplashProps {
  initialSettings?: UiSettings;
  forceShow?: boolean;
  onFinish?: () => void;
}

export function CinematicSplash({
  initialSettings,
  forceShow = false,
  onFinish,
}: CinematicSplashProps) {
  const [settings, setSettings] = useState<UiSettings>(
    initialSettings || DEFAULT_UI_SETTINGS
  );
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Load settings on mount if not provided
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

  // Determine if splash should be shown
  useEffect(() => {
    if (!isMounted) return;

    if (forceShow) {
      setIsVisible(true);
      return;
    }

    if (!settings.splashEnabled) {
      setIsVisible(false);
      return;
    }

    const storageKey = "kokkiri_cinematic_splash_viewed";
    if (settings.splashFrequency === "once_per_session") {
      const alreadyViewed = sessionStorage.getItem(storageKey);
      if (alreadyViewed) {
        setIsVisible(false);
        return;
      }
      sessionStorage.setItem(storageKey, "true");
    }

    setIsVisible(true);
  }, [isMounted, forceShow, settings.splashEnabled, settings.splashFrequency]);

  const handleComplete = useCallback(() => {
    setIsVisible(false);
    if (onFinish) onFinish();
  }, [onFinish]);

  // Auto-dismiss after duration
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      handleComplete();
    }, settings.splashDurationMs || 2400);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, settings.splashDurationMs, handleComplete]);

  // Lock body scroll while splash is active
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  // Theme configuration
  const themeStyles = {
    dark: {
      bg: "bg-[#0C1310]",
      radialGlow:
        "radial-gradient(circle at 50% 45%, rgba(68, 123, 86, 0.28) 0%, rgba(12, 19, 16, 0.98) 72%)",
      titleColor: "text-white",
      taglineColor: "text-white/80",
      accentLine: "from-transparent via-[#65A377] to-transparent",
      badgeBg: "bg-white/10 text-white/90 border-white/15",
      logoHalo: "shadow-[0_0_80px_rgba(101,163,119,0.35)]",
    },
    navy: {
      bg: "bg-[#080F18]",
      radialGlow:
        "radial-gradient(circle at 50% 45%, rgba(62, 130, 184, 0.28) 0%, rgba(8, 15, 24, 0.98) 72%)",
      titleColor: "text-white",
      taglineColor: "text-white/80",
      accentLine: "from-transparent via-[#3E82B8] to-transparent",
      badgeBg: "bg-white/10 text-white/90 border-white/15",
      logoHalo: "shadow-[0_0_80px_rgba(62,130,184,0.35)]",
    },
    light: {
      bg: "bg-[#F8F8F4]",
      radialGlow:
        "radial-gradient(circle at 50% 45%, rgba(71, 123, 86, 0.12) 0%, rgba(248, 248, 244, 0.98) 75%)",
      titleColor: "text-[#173F30]",
      taglineColor: "text-[#202622]/80",
      accentLine: "from-transparent via-[#173F30] to-transparent",
      badgeBg: "bg-[#173F30]/5 text-[#173F30] border-[#173F30]/15",
      logoHalo: "shadow-[0_0_60px_rgba(23,63,48,0.18)]",
    },
  };

  const currentTheme = themeStyles[settings.splashTheme] || themeStyles.dark;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cinematic-splash-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(12px)",
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
          className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center select-none overflow-hidden ${currentTheme.bg}`}
          style={{ background: currentTheme.radialGlow }}
        >
          {/* Subtle Ambient Particle Halo */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.25, 0.5, 0.25],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-[#477B56]/20 blur-[110px] pointer-events-none"
            />
          </div>

          {/* Skip Button */}
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            onClick={handleComplete}
            className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all cursor-pointer shadow-lg"
          >
            <span>건너뛰기</span>
            <span className="text-[10px] opacity-60 font-mono">ESC</span>
            <X className="w-3.5 h-3.5 ml-0.5" />
          </motion.button>

          {/* Central Logo & Brand Presentation */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg mx-auto">
            {/* Elephant Logo with Pulsing Halo */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 25, filter: "blur(10px)" }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative mb-6"
            >
              {/* Backlight Glow Ring */}
              <div
                className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center p-3 bg-white/5 backdrop-blur-md border border-white/15 ${currentTheme.logoHalo}`}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white/95 p-4 shadow-inner">
                  <Image
                    src={settings.splashLogoUrl || "/brand/kokkiri-elephant-logo.png"}
                    alt={settings.splashTitle || "KOKKIRI"}
                    width={180}
                    height={180}
                    className="w-full h-full object-contain filter drop-shadow-sm select-none"
                    priority
                  />
                </div>
              </div>
            </motion.div>

            {/* Brand Title with Cinematic Tracking Expansion */}
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.2em", y: 15 }}
              animate={{ opacity: 1, letterSpacing: "0.35em", y: 0 }}
              transition={{
                delay: 0.35,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-2"
            >
              <h1
                className={`text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-[0.35em] ${currentTheme.titleColor}`}
              >
                {settings.splashTitle || "KOKKIRI"}
              </h1>
            </motion.div>

            {/* Subtitle / Legal Entity Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mb-4 flex items-center gap-3"
            >
              <div
                className={`h-[1px] w-6 sm:w-10 bg-gradient-to-r ${currentTheme.accentLine}`}
              />
              <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#65A377] uppercase">
                {settings.splashSubtitle || "주식회사 코끼리"}
              </span>
              <div
                className={`h-[1px] w-6 sm:w-10 bg-gradient-to-r ${currentTheme.accentLine}`}
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6 }}
              className={`text-xs sm:text-sm font-medium tracking-wide max-w-sm mb-6 ${currentTheme.taglineColor}`}
            >
              {settings.splashTagline || "공간의 가치를 높이는 새로운 기준"}
            </motion.p>

            {/* 3 Brand Ecosystem Pillars */}
            {settings.splashShowPillars && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.6 }}
                className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap"
              >
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-sm ${currentTheme.badgeBg}`}
                >
                  <Sparkles className="w-3 h-3 text-[#65A377]" />
                  <span>KOKKIRI 클리닝</span>
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-sm ${currentTheme.badgeBg}`}
                >
                  <Video className="w-3 h-3 text-[#3E82B8]" />
                  <span>KOTO AI 보안</span>
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-sm ${currentTheme.badgeBg}`}
                >
                  <Leaf className="w-3 h-3 text-[#B89366]" />
                  <span>CHOKO 라이프케어</span>
                </div>
              </motion.div>
            )}

            {/* Glowing Loading Beam / Progress Line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-48 sm:w-64 h-[2px] bg-white/10 rounded-full mt-10 overflow-hidden relative"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: (settings.splashDurationMs || 2400) / 1000 - 0.2,
                  ease: "easeInOut",
                }}
                className="h-full bg-gradient-to-r from-[#477B56] via-[#65A377] to-[#86efac] shadow-[0_0_12px_#65A377]"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
