import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { SERVICES } from "@/lib/data/initial-data";
import { Sparkles, Building2, ArrowUpRight, Video } from "lucide-react";
import { buildPageMetadata, getBreadcrumbSchema, getServiceSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "서비스 안내 | 시설관리·청소·AI보안·조경 종합솔루션 | KOKKIRI",
  description:
    "사무실·병원·상가 정기 청소부터 4K AI 스마트 CCTV, 24시간 보안 경비, 기업 조경, 펜스 시공까지 KOKKIRI의 전체 8대 사업장 시설관리 솔루션을 만나보세요.",
  path: "/services",
  keywords: [
    "서비스안내",
    "시설관리",
    "청소",
    "병원청소",
    "건물청소",
    "사무실청소",
    "상가청소",
    "정기청소",
    "보안",
    "경비",
    "조경",
    "펜스",
    "시설공사",
  ],
});

export default function ServicesPage() {
  const kokkiriServices = SERVICES.filter((s) => s.brandSlug === "kokkiri");
  const kotoServices = SERVICES.filter((s) => s.brandSlug === "koto");

  const breadcrumbs = getBreadcrumbSchema([{ name: "서비스 안내", url: "/services" }]);
  const serviceCatalogSchema = getServiceSchema({
    name: "KOKKIRI 통합 시설관리 및 위생 솔루션",
    description: "청소, AI 보안, 조경 관리, 펜스 시공 등 사업장 종합 시설 관리 서비스",
    serviceType: "FacilityManagementAndCleaning",
    url: "/services",
  });

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={[breadcrumbs, serviceCatalogSchema]} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-2">
            Professional Services
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#173F30] tracking-tight mb-6">
            공간의 품격과 자산을 지키는<br />
            전문 서비스 포트폴리오
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            체계적인 위생 관리 프로토콜의 코끼리(KOKKIRI)와 기술 및 엔지니어링 기반의 KOTO가 기업에 최적화된 맞춤형 솔루션을 제안합니다.
          </p>
        </MotionReveal>
      </div>

      {/* KOKKIRI Services Section */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#173F30]/20">
          <div className="w-10 h-10 rounded-xl bg-[#173F30] text-white flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#173F30]">KOKKIRI 클리닝 서비스</h2>
            <p className="text-xs text-[#202622]/60">상업 공간, 오피스, 사옥, 대형 빌딩 및 준공 특수 클리닝</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kokkiriServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* KOTO Services Section */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#243A50]/20">
          <div className="w-10 h-10 rounded-xl bg-[#243A50] text-white flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#243A50]">KOTO AI 보안 & 시설 솔루션</h2>
            <p className="text-xs text-[#202622]/60">AI 지능형 보안 카메라(CCTV) 구축, 보안 경비, 기업 조경 및 외곽 펜스 시공</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kotoServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Bottom CTA Box */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#173F30] text-white text-center">
        <h3 className="text-2xl sm:text-3xl font-black mb-3">어떤 서비스를 선택해야 할지 고민이신가요?</h3>
        <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto mb-6">
          전문 매니저가 현장 방문 실사를 통해 면적과 설비 현황을 점검하고 가장 경제적이고 효율적인 맞춤형 관리 플랜을 무료로 제안해 드립니다.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-[#173F30] font-bold text-sm hover:bg-gray-100 transition-all shadow-md"
        >
          <span>무료 방문 실사 및 맞춤 상담 & 문의</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
