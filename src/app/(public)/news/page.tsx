import React from "react";
import type { Metadata } from "next";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { NEWS_LIST } from "@/lib/data/initial-data";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "뉴스 & 공지사항 | 기업 소식 & ESG 인증 | KOKKIRI",
  description:
    "주식회사 코끼리의 최신 기업 소식, 친환경 ESG 인증 획득 현황, AI 보안 카메라 기술 업데이트 및 브랜드 공지사항을 확인하세요.",
  path: "/news",
  keywords: [
    "코끼리뉴스",
    "공지사항",
    "ESG인증",
    "기업소식",
    "친환경클리닝뉴스",
    "AICCTV보안뉴스",
  ],
});

export default function NewsPage() {
  const breadcrumbs = getBreadcrumbSchema([{ name: "뉴스 & 공지사항", url: "/news" }]);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-2">
            News & Press
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#173F30] tracking-tight mb-6">
            코끼리 뉴스 & 공지사항
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            친환경 위생 관리 기술 발전, AI 지능형 보안 솔루션 혁신, 라이프케어 신제품 출시 등 코끼리의 새로운 소식을 전해드립니다.
          </p>
        </MotionReveal>
      </div>

      {/* News List */}
      <div className="max-w-4xl mx-auto space-y-6">
        {NEWS_LIST.map((item) => (
          <article
            key={item.id}
            className="p-8 rounded-3xl bg-white border border-[#202622]/10 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
              <span className="px-3 py-1 rounded-full bg-[#173F30]/10 text-[#173F30] font-bold">
                {item.category}
              </span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.publishedAt}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>읽는 시간 {item.readTime}</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#202622] mb-3 leading-snug">
              {item.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#202622]/75 leading-relaxed mb-4">
              {item.excerpt}
            </p>

            <div className="p-4 rounded-xl bg-[#F8F8F4] text-xs text-[#202622]/80 leading-relaxed border border-black/5">
              {item.content}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
