import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SERVICES, PROJECTS } from "@/lib/data/initial-data";
import { getSiteContent } from "@/lib/data/content-store";
import { Building2, ArrowUpRight, ShieldCheck, Wrench, Trees, Warehouse, Video, HelpCircle } from "lucide-react";
import { buildPageMetadata, getBreadcrumbSchema, getServiceSchema, getFaqSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "시설관리 & AI보안 서비스 | 건물·시설 종합관리 | KOKKIRI",
  description:
    "KOTO는 딥러닝 4K AI 스마트 CCTV, 24시간 보안 경비, 기업 조경 관리, 산업용 펜스 시공을 하나로 융합한 KOKKIRI의 첨단 시설관리 테크니컬 브랜드입니다.",
  path: "/koto",
  keywords: [
    "시설관리",
    "보안",
    "경비",
    "조경",
    "펜스",
    "울타리",
    "AICCTV",
    "스마트CCTV",
    "보안카메라",
    "파주시설관리",
    "일산시설관리",
    "고양시설관리",
  ],
});

export default function KotoBrandPage() {
  const siteContent = getSiteContent();
  const kotoServices = SERVICES.filter((s) => s.brandSlug === "koto");
  const kotoProjects = PROJECTS.filter((p) => p.brandSlug === "koto");
  const faqs = siteContent.koto.faqs;

  const breadcrumbs = getBreadcrumbSchema([{ name: "시설관리 & AI보안 (KOTO)", url: "/koto" }]);
  const kotoServiceSchema = getServiceSchema({
    name: "KOTO 첨단 AI 보안 및 종합 시설관리 솔루션",
    description: "4K AI 지능형 CCTV, 24시간 시설 보안 경비, 기업 조경 수목 관리 및 펜스 시공",
    serviceType: "FacilityManagementAndSecurityService",
    url: "/koto",
  });
  const faqSchema = getFaqSchema(faqs);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={[breadcrumbs, kotoServiceSchema, faqSchema]} />
      {/* Brand Hero */}
      <div className="rounded-3xl bg-[#243A50] text-[#F8F8F4] p-8 sm:p-16 mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3E82B8]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#3E82B8] text-xs font-bold mb-6">
            <Video className="w-4 h-4" />
            <span>{siteContent.koto.pillBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
            {siteContent.koto.headline}
          </h1>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-8">
            {siteContent.koto.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-white text-[#243A50] font-bold text-sm hover:bg-gray-100 transition-all shadow-md"
            >
              {siteContent.koto.primaryCtaText}
            </Link>
            <Link
              href="/koto/services"
              className="px-6 py-3.5 rounded-xl border border-white/20 text-white font-bold text-sm hover:bg-white/10 transition-colors"
            >
              {siteContent.koto.secondaryCtaText}
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Pillars Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
        <Link
          href="/koto/facility-management"
          className="p-6 rounded-2xl bg-white border border-[#202622]/10 hover:border-[#243A50] hover:shadow-md transition-all group"
        >
          <Video className="w-6 h-6 text-[#243A50] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-sm text-[#202622] mb-1">AI 지능형 CCTV 설치</h3>
          <p className="text-xs text-gray-500">4K 딥러닝 영상 분석, 침입·화재 실시간 감지</p>
        </Link>

        <Link
          href="/koto/security"
          className="p-6 rounded-2xl bg-white border border-[#202622]/10 hover:border-[#243A50] hover:shadow-md transition-all group"
        >
          <ShieldCheck className="w-6 h-6 text-[#243A50] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-sm text-[#202622] mb-1">전문 보안 경비</h3>
          <p className="text-xs text-gray-500">24시간 출입 관제 및 순찰 방범</p>
        </Link>

        <Link
          href="/koto/landscaping"
          className="p-6 rounded-2xl bg-white border border-[#202622]/10 hover:border-[#243A50] hover:shadow-md transition-all group"
        >
          <Trees className="w-6 h-6 text-[#243A50] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-sm text-[#202622] mb-1">기업 조경 유지관리</h3>
          <p className="text-xs text-gray-500">사계절 수목 전정, 잔디 예초, 병충해 방제</p>
        </Link>

        <Link
          href="/koto/fence"
          className="p-6 rounded-2xl bg-white border border-[#202622]/10 hover:border-[#243A50] hover:shadow-md transition-all group"
        >
          <Warehouse className="w-6 h-6 text-[#243A50] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-sm text-[#202622] mb-1">보안 펜스 시공</h3>
          <p className="text-xs text-gray-500">산업용 메쉬 펜스 및 자동 게이트 설치</p>
        </Link>
      </div>

      {/* Services Grid */}
      <section className="mb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-[#3E82B8] uppercase tracking-wider block mb-1">
              KOTO Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#243A50]">
              KOTO 전문 시설 솔루션
            </h2>
          </div>
          <Link href="/koto/services" className="text-xs font-bold text-[#243A50] hover:underline flex items-center gap-1">
            <span>솔루션 전체보기</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kotoServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-[#3E82B8] uppercase tracking-wider block mb-1">
              Security & Works Case Studies
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#243A50]">
              주요 AI CCTV 구축 및 시공 실적
            </h2>
          </div>
          <Link href="/koto/projects" className="text-xs font-bold text-[#243A50] hover:underline flex items-center gap-1">
            <span>실적 전체보기</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {kotoProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12 pt-16 border-t border-black/10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#243A50]/10 text-[#243A50] text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>자주 묻는 질문 (FAQ)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#243A50]">
            KOTO 시설 & AI 보안 관련 자주 묻는 질문
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-[#202622]/10 shadow-xs">
              <h3 className="text-sm sm:text-base font-bold text-[#243A50] mb-2 flex items-center gap-2">
                <span className="font-mono text-xs font-black text-[#3E82B8]">Q{idx + 1}.</span>
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
