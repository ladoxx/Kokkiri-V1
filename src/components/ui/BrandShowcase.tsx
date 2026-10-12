"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Building2, Leaf, ArrowRight, CheckCircle2, Video } from "lucide-react";
import { BRANDS } from "@/lib/data/initial-data";
import { DEFAULT_SITE_CONTENT, SiteContentSettings } from "@/lib/types/cms";

export function BrandShowcase() {
  const [content, setContent] = useState<SiteContentSettings>(DEFAULT_SITE_CONTENT);

  useEffect(() => {
    let mounted = true;
    fetch("/api/content")
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((data) => {
        if (mounted && data) setContent(data);
      })
      .catch((err) => {
        console.warn("Could not load dynamic brand showcase content, using defaults:", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const getBrandDetails = (slug: string) => {
    switch (slug) {
      case "kokkiri":
        return {
          icon: Sparkles,
          accentBg: "bg-[#173F30]",
          accentText: "text-[#173F30]",
          borderHover: "hover:border-[#173F30]/40",
          features: ["오피스 & 사옥 정기 클리닝", "상업 공간 & 쇼룸 위생 케어", "준공 및 특수 빌딩 클리닝"],
          link: "/cleaning",
          linkText: "코끼리 클리닝 둘러보기",
        };
      case "koto":
        return {
          icon: Video,
          accentBg: "bg-[#243A50]",
          accentText: "text-[#243A50]",
          borderHover: "hover:border-[#243A50]/40",
          features: ["AI 지능형 보안 카메라 & 스마트 CCTV", "24시간 사업장 보안 & 시설 경비", "기업 조경 식재 및 펜스 시공"],
          link: "/koto",
          linkText: "KOTO AI 보안·시설 둘러보기",
        };
      case "choko":
        return {
          icon: Leaf,
          accentBg: "bg-[#8C6C43]",
          accentText: "text-[#8C6C43]",
          borderHover: "hover:border-[#8C6C43]/40",
          features: ["100% 대나무 무형광 화장지 & 타월", "식이 알레르기 케어 비건 도그 사료", "자연유래 피톤치드 공간 탈취제"],
          link: "/choko",
          linkText: "CHOKO 제품 카탈로그 보기",
        };
      default:
        return {
          icon: Sparkles,
          accentBg: "bg-gray-800",
          accentText: "text-gray-800",
          borderHover: "hover:border-gray-400",
          features: [],
          link: "/",
          linkText: "자세히 보기",
        };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {BRANDS.map((brand) => {
        const details = getBrandDetails(brand.slug);
        const IconComponent = details.icon;

        const brandKey = brand.slug as keyof typeof content.brands;
        const brandCms = content.brands && content.brands[brandKey] ? content.brands[brandKey] : null;

        const displayName = brandCms?.title || `${brand.nameKo} (${brand.name})`;
        const displaySlogan = brandCms?.subtitle || brand.slogan;
        const displayDescription = brandCms?.description || brand.description;
        const displayBadge = brandCms?.categoryBadge || brand.badge;
        const displayButtonText = brandCms?.buttonText || details.linkText;
        const displayButtonHref = brandCms?.buttonHref || details.link;

        return (
          <div
            key={brand.id}
            className={`flex flex-col justify-between rounded-3xl p-8 bg-white border border-[#202622]/10 ${details.borderHover} transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 group`}
          >
            <div>
              {/* Header with Icon and Badge */}
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`w-12 h-12 rounded-2xl ${details.accentBg} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-black/5 text-[#202622]/70">
                  {displayBadge}
                </span>
              </div>

              {/* Title & Slogan */}
              <h3 className="text-2xl font-black text-[#202622] tracking-tight mb-2">
                {displayName}
              </h3>
              <p className={`text-xs font-bold ${details.accentText} mb-4 leading-relaxed`}>
                {displaySlogan}
              </p>

              {/* Description */}
              <p className="text-sm text-[#202622]/70 leading-relaxed mb-6">
                {displayDescription}
              </p>

              {/* Key Features Bullet List */}
              <div className="space-y-2.5 pt-4 border-t border-black/5 mb-8">
                {details.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#202622]/80">
                    <CheckCircle2 className={`w-4 h-4 ${details.accentText} shrink-0`} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
              {details.link !== "/choko" && (
                <div className="mb-4">
                  <Link
                    href={`${details.link}/projects`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <span>실제 시공 전후(Before & After) 보기</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* Action CTA */}
            <div>
              <Link
                href={displayButtonHref}
                className={`inline-flex items-center justify-between w-full py-3.5 px-5 rounded-xl ${details.accentBg} text-white text-xs font-bold hover:opacity-95 transition-all duration-200 group-hover:shadow-md`}
              >
                <span>{displayButtonText}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
