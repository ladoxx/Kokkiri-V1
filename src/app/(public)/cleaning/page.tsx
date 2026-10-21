import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SERVICES, PROJECTS } from "@/lib/data/initial-data";
import { Sparkles, ArrowUpRight, CheckCircle2, Shield, Leaf, Clock, HelpCircle } from "lucide-react";
import { buildPageMetadata, getBreadcrumbSchema, getServiceSchema, getFaqSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

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
  const cleaningServices = SERVICES.filter((s) => s.brandSlug === "kokkiri");
  const cleaningProjects = PROJECTS.filter((p) => p.brandSlug === "kokkiri");

  const faqs = [
    {
      question: "정기 클리닝은 어떻게 진행되나요?",
      answer:
        "사전 무료 현장 실사를 통해 공간 구조, 바닥 마감재 및 오염도를 진단한 후 최적의 주기(일간/주간/월간)와 맞춤 작업 공정표를 수립하여 전담 직영 매니저가 체계적으로 진행합니다.",
    },
    {
      question: "병원이나 클리닉 등 의료 시설 청소도 가능한가요?",
      answer:
        "네, 가능합니다. 코끼리는 병의원 위생 가이드라인에 맞춘 무독성 친환경 소독 약품과 HEPA 필터 집진 장비를 사용하여 진료실, 대기실, 검사실 위생 환경을 철저히 케어합니다.",
    },
    {
      question: "클리닝 서비스가 가능한 지역은 어디인가요?",
      answer:
        "파주, 문산, 운정, 일산, 고양, 김포, 서울 및 경기도 수도권 전역에 전문 직영 인력이 신속하게 방문 실사 및 정기 클리닝을 제공합니다.",
    },
    {
      question: "현장 방문 실사와 견적 산출은 무료인가요?",
      answer:
        "네, 100% 무료입니다. 온라인 또는 대표번호로 신청해 주시면 담당 매니저가 직접 사업장을 방문하여 실측 후 24시간 이내에 세부 견적서를 발송해 드립니다.",
    },
  ];

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
            <span>KOKKIRI Corporate Cleaning</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
            공간의 품격을 완성하는<br />
            프리미엄 클리닝 솔루션
          </h1>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-8">
            코끼리는 단순한 청소를 넘어, 공간의 자산 가치를 보존하고 임직원과 고객 모두에게 안전하고 쾌적한 위생 환경을 제공합니다.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-white text-[#173F30] font-bold text-sm hover:bg-gray-100 transition-all shadow-md"
            >
              클리닝 무료 상담 & 문의하기
            </Link>
            <Link
              href="/cleaning/services"
              className="px-6 py-3.5 rounded-xl border border-white/20 text-white font-bold text-sm hover:bg-white/10 transition-colors"
            >
              서비스 전체보기
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
              코끼리 전문 클리닝 분야
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
