import React from "react";
import type { Metadata } from "next";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "AI CCTV & 시설 솔루션 견적 문의 | 무료 현장 실사 | KOKKIRI",
  description:
    "AI 보안 카메라 설치, 24시간 보안경비, 조경 수목 관리, 산업용 펜스 시공 무료 방문 실사 및 맞춤 견적을 신청하세요. 보안 엔지니어가 최적의 설계를 제안합니다.",
  path: "/koto/request-quote",
  keywords: [
    "CCTV견적",
    "AICCTV설치비용",
    "시설경비견적",
    "조경유지관리비용",
    "펜스공사견적",
    "무료방문실사",
  ],
});

export default function KotoRequestQuotePage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "시설관리 & AI보안 (KOTO)", url: "/koto" },
    { name: "견적 문의", url: "/koto/request-quote" },
  ]);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#3E82B8] uppercase tracking-wider block mb-2">
            KOTO AI Security Consultation
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#243A50] tracking-tight mb-6">
            KOTO AI 보안 & 시설 무료 견적 신청
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            사업장 규모와 카메라 필요 대수, 외곽 환경을 알려주시면 보안 엔지니어가 무료 현장 실사 후 사각지대 제로 견적서를 보내드립니다.
          </p>
        </MotionReveal>
      </div>

      <InquiryForm
        defaultType="AI 보안 카메라 & CCTV 설치 견적"
        title="KOTO AI 보안 카메라 & 시설 견적 신청서"
        subtitle="정밀 화각 분석과 최첨단 4K AI 딥러닝 스마트 CCTV 솔루션을 최적 견적으로 제안해 드립니다."
      />
    </div>
  );
}
