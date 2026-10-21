import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { BrandShowcase } from "@/components/ui/BrandShowcase";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { ArrowUpRight, Sparkles, Building2, Leaf } from "lucide-react";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "브랜드 포트폴리오 | KOKKIRI · KOTO · CHOKO | KOKKIRI",
  description:
    "공간의 가치를 높이는 3대 브랜드 코끼리(클리닝), KOTO(AI 보안 & 시설), CHOKO(친환경 제품)의 통합 생태계를 확인하세요. 단일 계약으로 비용 절감과 원스톱 관리를 제공합니다.",
  path: "/brands",
  keywords: ["브랜드포트폴리오", "코끼리", "KOKKIRI", "KOTO", "CHOKO", "시설관리", "위생클리닝", "친환경제품"],
});

export default function BrandsPage() {
  const breadcrumbs = getBreadcrumbSchema([{ name: "브랜드 포트폴리오", url: "/brands" }]);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-2">
            Integrated Brand Ecosystem
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#173F30] tracking-tight mb-6">
            3대 브랜드가 만들어내는<br />
            공간의 새로운 시너지
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            클리닝 솔루션(KOKKIRI), AI 보안 및 스마트 시설(KOTO), 친환경 라이프케어 제품(CHOKO)이 완벽하게 결합되어 기업 공간에 필요한 모든 솔루션을 원스톱으로 제공합니다.
          </p>
        </MotionReveal>
      </div>

      {/* Brand Showcase Grid */}
      <section className="mb-20">
        <BrandShowcase />
      </section>

      {/* Synergies Section */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white border border-[#202622]/10 shadow-sm">
        <h2 className="text-2xl font-black text-[#173F30] mb-8 text-center">
          단일 계약으로 누리는 원스톱 통합 혜택
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#F8F8F4] border border-black/5">
            <div className="text-lg font-bold text-[#173F30] mb-2">비용 및 관리 공수 절감</div>
            <p className="text-xs text-[#202622]/70 leading-relaxed">
              청소, 시설 경비, 조경, 소모품 구매 업체를 각각 계약할 필요 없이 코끼리 하나의 창구에서 일원화하여 견적 단가와 행정 공수를 획기적으로 줄여드립니다.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F8F8F4] border border-black/5">
            <div className="text-lg font-bold text-[#243A50] mb-2">책임 있는 일원화 CS 소통</div>
            <p className="text-xs text-[#202622]/70 leading-relaxed">
              업체 간 책임 전가 없이 단일 전담 프로젝트 매니저가 현장 이슈를 총괄 파악하고 즉각 조치하여 품질 분쟁을 원천 방지합니다.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F8F8F4] border border-black/5">
            <div className="text-lg font-bold text-[#8C6C43] mb-2">친환경 ESG 평가 지원</div>
            <p className="text-xs text-[#202622]/70 leading-relaxed">
              친환경 세제와 100% 대나무 소재 화장지 및 타월을 사내에 공급함으로써 고객사의 친환경 경영 지표와 ESG 평가 요건을 충족합니다.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#173F30] text-white font-bold text-sm hover:bg-[#173F30]/90 transition-all shadow-md"
          >
            <span>통합 브랜드 패키지 상담 & 문의</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
