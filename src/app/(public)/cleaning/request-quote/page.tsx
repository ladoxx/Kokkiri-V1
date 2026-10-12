import React from "react";
import type { Metadata } from "next";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "클리닝 견적 신청 | 무료 방문 실사 및 맞춤 견적 | KOKKIRI",
  description:
    "사무실, 병원, 상가, 빌딩 정기 청소 무료 현장 방문 실사 및 맞춤 견적을 신청하세요. 전담 위생 매니저가 24시간 이내 현장 맞춤형 견적서를 제안해 드립니다.",
  path: "/cleaning/request-quote",
  keywords: [
    "청소견적",
    "무료방문실사",
    "오피스청소견적",
    "병원청소비용",
    "빌딩청소단가",
    "파주청소견적",
    "일산청소견적",
  ],
});

export default function CleaningRequestQuotePage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "청소 서비스", url: "/cleaning" },
    { name: "견적 신청", url: "/cleaning/request-quote" },
  ]);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-2">
            Cleaning Quotation
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#173F30] tracking-tight mb-6">
            코끼리 클리닝 무료 견적 신청
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            사업장 위치와 면적, 원하시는 청소 주기를 알려주시면 전담 매니저가 무료 현장 실사 후 1영업일 이내에 세부 견적서를 보내드립니다.
          </p>
        </MotionReveal>
      </div>

      <InquiryForm
        defaultType="클리닝 견적 문의"
        title="클리닝 견적 신청서"
        subtitle="전담 클리닝 디렉터가 공간 특성을 면밀히 파악하여 최적화된 견적을 안내해 드립니다."
      />
    </div>
  );
}
