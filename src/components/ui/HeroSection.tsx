"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
  Building2,
  Leaf,
  Shield,
  Award,
  Users,
  CheckCircle2,
  TrendingUp,
  Clock,
  MoveHorizontal,
  Video,
} from "lucide-react";
import { MotionReveal } from "@/components/animations/MotionReveal";

import { DEFAULT_SITE_CONTENT, HeroSectionContent } from "@/lib/types/cms";

export function HeroSection() {
  const [hero, setHero] = React.useState<HeroSectionContent>(DEFAULT_SITE_CONTENT.hero);

  React.useEffect(() => {
    fetch("/api/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.hero) setHero(data.hero);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#F8F8F4] via-[#F4EFE5]/40 to-[#F8F8F4]">
      {/* Decorative background glow subtle ambient elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#477B56]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-[#243A50]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-[400px] h-[400px] bg-[#8C6C43]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Brand Pill Indicator */}
          <MotionReveal direction="down" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#173F30]/10 border border-[#173F30]/20 text-[#173F30] text-xs font-bold mb-8 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#477B56] animate-pulse" />
              <span>{hero.pillBadge}</span>
            </div>
          </MotionReveal>

          {/* Main Korean Headline with staggered reveal */}
          <MotionReveal direction="up" delay={0.2}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#173F30] tracking-tight leading-[1.15] mb-6">
              {hero.titleLine1}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#173F30] via-[#477B56] to-[#243A50]">
                {hero.titleLine2Highlight}
              </span>
            </h1>
          </MotionReveal>

          {/* Supporting Subheadline */}
          <MotionReveal direction="up" delay={0.3}>
            <p className="text-lg sm:text-xl text-[#202622]/80 leading-relaxed font-normal max-w-2xl mx-auto mb-10">
              {hero.subtitle}
            </p>
          </MotionReveal>

          {/* Action CTAs */}
          <MotionReveal direction="up" delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <Link
                href={hero.primaryCtaHref || "/request-quote"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#173F30] text-[#F8F8F4] text-base font-bold shadow-lg hover:shadow-xl hover:bg-[#173F30]/90 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{hero.primaryCtaText}</span>
                <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link
                href={hero.secondaryCtaHref || "/projects#before-after"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white border border-[#202622]/15 text-[#202622] text-base font-bold hover:bg-gray-50 transition-all duration-200 shadow-xs"
              >
                <MoveHorizontal className="w-4 h-4 text-[#173F30]" />
                <span>{hero.secondaryCtaText}</span>
              </Link>
            </div>
          </MotionReveal>

          {/* Dynamic Trust Metric Pills */}
          <MotionReveal direction="up" delay={0.45}>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-12 text-xs font-semibold text-gray-600">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-black/5 shadow-xs">
                <TrendingUp className="w-4 h-4 text-[#477B56]" />
                <span>{hero.stat1Label} <strong className="text-gray-900 font-bold">{hero.stat1Value}</strong></span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-black/5 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#477B56]" />
                <span>{hero.stat2Label} <strong className="text-gray-900 font-bold">{hero.stat2Value}</strong></span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-black/5 shadow-xs">
                <Clock className="w-4 h-4 text-[#243A50]" />
                <span>{hero.stat3Label} <strong className="text-gray-900 font-bold">{hero.stat3Value}</strong></span>
              </div>
            </div>
          </MotionReveal>

          {/* Three Brand Mini Badges */}
          <MotionReveal direction="up" delay={0.5}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              <Link
                href="/cleaning"
                className="p-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-[#173F30]/15 hover:border-[#173F30] transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#173F30]/10 text-[#173F30] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#173F30] group-hover:text-white transition-all">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#173F30]">KOKKIRI</div>
                  <div className="text-[11px] text-[#202622]/60">프리미엄 클리닝 & 위생</div>
                </div>
              </Link>

              <Link
                href="/koto"
                className="p-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-[#243A50]/15 hover:border-[#243A50] transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#243A50]/10 text-[#243A50] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#243A50] group-hover:text-white transition-all">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#243A50]">KOTO</div>
                  <div className="text-[11px] text-[#202622]/60">AI 보안 카메라 & 스마트 시설</div>
                </div>
              </Link>

              <Link
                href="/choko"
                className="p-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-[#8C6C43]/15 hover:border-[#8C6C43] transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#8C6C43]/10 text-[#8C6C43] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#8C6C43] group-hover:text-white transition-all">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#8C6C43]">CHOKO</div>
                  <div className="text-[11px] text-[#202622]/60">에코 라이프케어 제품</div>
                </div>
              </Link>
            </div>
          </MotionReveal>
        </div>

        {/* Corporate Trust Value Bar */}
        <div className="mt-20 pt-10 border-t border-black/5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center p-4 rounded-2xl hover:bg-white/50 transition-colors">
            <Shield className="w-6 h-6 text-[#477B56] mb-2" />
            <span className="font-bold text-sm text-[#202622]">철저한 표준 위생 & 안전 규정</span>
            <span className="text-xs text-[#202622]/60 mt-1">친환경 약제 및 산업안전 지침 100% 준수</span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl hover:bg-white/50 transition-colors">
            <Users className="w-6 h-6 text-[#243A50] mb-2" />
            <span className="font-bold text-sm text-[#202622]">본사 직영 전담 매니저 체제</span>
            <span className="text-xs text-[#202622]/60 mt-1">사업장별 1:1 맞춤 배정 및 실시간 CS 소통</span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl hover:bg-white/50 transition-colors">
            <Award className="w-6 h-6 text-[#8C6C43] mb-2" />
            <span className="font-bold text-sm text-[#202622]">3개 브랜드 통합 One-Stop 운영</span>
            <span className="text-xs text-[#202622]/60 mt-1">클리닝, 시설보수, 소모품 보급까지 일원화</span>
          </div>
        </div>
      </div>
    </section>
  );
}
