import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SERVICES, PROJECTS } from "@/lib/data/initial-data";
import { getSiteContent } from "@/lib/data/content-store";
import { Sparkles, ArrowUpRight, CheckCircle2, Shield, Leaf, Clock, HelpCircle } from "lucide-react";
import { buildPageMetadata, getBreadcrumbSchema, getServiceSchema, getFaqSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "청소 서비스 | 병원·사무실·상가·건물 청소 | KOKKIRI",
  description:
    "오피스, 상업 공간, 사옥, 대형 빌딩 및 준공 특수 청소 전문 코끼리 클리닝입니다. 파주, 일산, 고양, 김포, 서울 전역에 전문 직영 인력의 맞춤 위생 케어를 제공합니다.",
  path: "/cleaning",
  keywords: [
    "청소",
    "병원청소",
    "사무실청소",
    "상가청소",
    "건물청소",
    "정기청소",
    "특수청소",
    "준공청소",
    "파주청소",
    "일산청소",
    "고양청소",
    "김포청소",
    "서울청소",
  ],
});

export default function CleaningBrandPage() {
  const siteContent = getSiteContent();
  const cleaningServices = SERVICES.filter((s) => s.brandSlug === "kokkiri");
  const cleaningProjects = PROJECTS.filter((p) => p.brandSlug === "kokkiri");
  const faqs = siteContent.cleaning.faqs;

  const breadcrumbs = getBreadcrumbSchema([{ name: "청소 서비스", url: "/cleaning" }]);
  const cleaningServiceSchema = getServiceSchema({
    name: "KOKKIRI 기업 전문 클리닝 서비스",
    description: "병원, 사무실, 상가, 대형 빌딩 정기 청소 및 준공 특수 클리닝 솔루션",
    serviceType: "CommercialCleaningService",
    url: "/cleaning",
  });
  const faqSchema = getFaqSchema(faqs);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={[breadcrumbs, cleaningServiceSchema, faqSchema]} />
      {/* Brand Hero */}
      <div className="rounded-3xl bg-[#173F30] text-[#F8F8F4] p-8 sm:p-16 mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#477B56]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#65A377] text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>{siteContent.cleaning.pillBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
            {siteContent.cleaning.headline}
          </h1>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-8">
            {siteContent.cleaning.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-white text-[#173F30] font-bold text-sm hover:bg-gray-100 transition-all shadow-md"
            >
              {siteContent.cleaning.primaryCtaText}
            </Link>
            <Link
              href="/cleaning/services"
              className="px-6 py-3.5 rounded-xl border border-white/20 text-white font-bold text-sm hover:bg-white/10 transition-colors"
            >
              {siteContent.cleaning.secondaryCtaText}
            </Link>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <section className="mb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-1">
              Cleaning Services
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#173F30]">
              {siteContent.cleaning.sectionTitle}
            </h2>
          </div>
          <Link href="/cleaning/services" className="text-xs font-bold text-[#173F30] hover:underline flex items-center gap-1">
            <span>자세히 보기</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cleaningServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Verified Projects */}
      <section className="mb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-1">
              Proven Track Record
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#173F30]">
              주요 클리닝 프로젝트 실적
            </h2>
          </div>
          <Link href="/cleaning/projects" className="text-xs font-bold text-[#173F30] hover:underline flex items-center gap-1">
            <span>실적 전체보기</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cleaningProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12 pt-16 border-t border-black/10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173F30]/10 text-[#173F30] text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>자주 묻는 질문 (FAQ)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#173F30]">
            클리닝 서비스 관련 자주 묻는 질문
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-[#202622]/10 shadow-xs">
              <h3 className="text-sm sm:text-base font-bold text-[#173F30] mb-2 flex items-center gap-2">
                <span className="font-mono text-xs font-black text-[#477B56]">Q{idx + 1}.</span>
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-[#202622]/75 leading-relaxed pl-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
