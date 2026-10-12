import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { SERVICES } from "@/lib/data/initial-data";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "클리닝 서비스 상세 안내 | 병원·사무실 정기 청소 프로세스 | KOKKIRI",
  description:
    "상업공간 오픈 전/마감 케어, 무소음 HEPA 오피스 청소, 대형 빌딩 외벽·주차장 세척, 준공 분진 99.9% 포집 등 코끼리만의 4단계 정밀 클리닝 공정을 안내합니다.",
  path: "/cleaning/services",
  keywords: [
    "상업공간청소",
    "오피스청소",
    "사옥청소",
    "빌딩청소",
    "준공청소",
    "특수청소",
    "정기청소",
    "병원청소",
  ],
});

export default function CleaningServicesPage() {
  const cleaningServices = SERVICES.filter((s) => s.brandSlug === "kokkiri");
  const breadcrumbs = getBreadcrumbSchema([
    { name: "청소 서비스", url: "/cleaning" },
    { name: "상세 안내", url: "/cleaning/services" },
  ]);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-2">
            KOKKIRI Cleaning Services
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#173F30] tracking-tight mb-6">
            코끼리 전문 클리닝 서비스
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            체계적인 위생 매뉴얼과 숙련된 직영 인력을 바탕으로 모든 공간에 최적화된 청결을 제공합니다.
          </p>
        </MotionReveal>
      </div>

      {/* Detailed Services Vertical Stack */}
      <div className="space-y-16 mb-20">
        {cleaningServices.map((service, idx) => (
          <div
            key={service.id}
            id={service.slug}
            className="p-8 sm:p-12 rounded-3xl bg-white border border-[#202622]/10 shadow-sm"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-8 pb-8 border-b border-black/5">
              <div>
                <span className="text-xs font-mono font-bold text-[#477B56] block mb-1">
                  SERVICE 0{idx + 1} · {service.subtitle}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#173F30] mb-3">
                  {service.title}
                </h2>
                <p className="text-sm text-[#202622]/75 max-w-2xl leading-relaxed">
                  {service.description}
                </p>
              </div>

              <Link
                href={`/cleaning/request-quote?service=${encodeURIComponent(service.title)}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#173F30] text-white text-xs font-bold hover:bg-[#173F30]/90 transition-all shrink-0 self-start shadow-sm"
              >
                <span>이 서비스 견적 요청</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Key Features & Process Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-bold text-[#173F30] uppercase tracking-wider mb-4">
                  핵심 관리 영역 및 특장점
                </h4>
                <div className="space-y-2.5">
                  {service.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#202622]/85">
                      <CheckCircle2 className="w-4 h-4 text-[#477B56] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#173F30] uppercase tracking-wider mb-4">
                  표준 작업 프로세스
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {service.processSteps.map((step, sIdx) => (
                    <div key={sIdx} className="p-3.5 rounded-xl bg-[#F8F8F4] border border-black/5 text-xs">
                      <div className="font-mono font-bold text-[#173F30] mb-1">{step.step}</div>
                      <div className="font-bold text-[#202622] mb-1">{step.title}</div>
                      <div className="text-[11px] text-gray-500 leading-tight">{step.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
