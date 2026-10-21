import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { SERVICES } from "@/lib/data/initial-data";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "KOTO 시설 솔루션 안내 | AI CCTV·경비·조경·펜스 | KOKKIRI",
  description:
    "AI 보안 카메라 구축, 24시간 시설 경비, 기업 조경 수목 전정, 산업용 보안 펜스 시공 등 KOTO의 핵심 4대 시설관리 서비스 프로세스와 품질 보증 안내입니다.",
  path: "/koto/services",
  keywords: [
    "시설관리",
    "KOTO솔루션",
    "AICCTV구축",
    "시설경비",
    "조경수목전정",
    "보안펜스시공",
    "파주시설공사",
    "일산시설관리",
  ],
});

export default function KotoServicesPage() {
  const kotoServices = SERVICES.filter((s) => s.brandSlug === "koto");
  const breadcrumbs = getBreadcrumbSchema([
    { name: "시설관리 & AI보안 (KOTO)", url: "/koto" },
    { name: "시설 솔루션 안내", url: "/koto/services" },
  ]);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#3E82B8] uppercase tracking-wider block mb-2">
            KOTO Technical Services
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#243A50] tracking-tight mb-6">
            KOTO AI 보안 & 시설 엔지니어링
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            첨단 AI 지능형 영상 분석 기술과 전문 자격증을 보유한 기술 인력으로 고객사의 안전과 자산 가치를 극대화합니다.
          </p>
        </MotionReveal>
      </div>

      <div className="space-y-16 mb-20">
        {kotoServices.map((service, idx) => (
          <div
            key={service.id}
            id={service.slug}
            className="p-8 sm:p-12 rounded-3xl bg-white border border-[#202622]/10 shadow-sm"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-8 pb-8 border-b border-black/5">
              <div>
                <span className="text-xs font-mono font-bold text-[#3E82B8] block mb-1">
                  SOLUTION 0{idx + 1} · {service.subtitle}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#243A50] mb-3">
                  {service.title}
                </h2>
                <p className="text-sm text-[#202622]/75 max-w-2xl leading-relaxed">
                  {service.description}
                </p>
              </div>

              <Link
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#243A50] text-white text-xs font-bold hover:bg-[#243A50]/90 transition-all shrink-0 self-start shadow-sm"
              >
                <span>이 솔루션 상담 & 문의</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-bold text-[#243A50] uppercase tracking-wider mb-4">
                  핵심 관리 영역 및 특장점
                </h4>
                <div className="space-y-2.5">
                  {service.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#202622]/85">
                      <CheckCircle2 className="w-4 h-4 text-[#3E82B8] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#243A50] uppercase tracking-wider mb-4">
                  표준 엔지니어링 프로세스
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {service.processSteps.map((step, sIdx) => (
                    <div key={sIdx} className="p-3.5 rounded-xl bg-[#F2F5F7] border border-black/5 text-xs">
                      <div className="font-mono font-bold text-[#243A50] mb-1">{step.step}</div>
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
