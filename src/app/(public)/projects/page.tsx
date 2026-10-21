import React from "react";
import type { Metadata } from "next";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { BeforeAfterGallery } from "@/components/ui/BeforeAfterGallery";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { PROJECTS } from "@/lib/data/initial-data";
import { MoveHorizontal, Building2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "시공 실적 & 전후비교 | 클리닝·조경·펜스 Before & After | KOKKIRI",
  description:
    "대형 오피스 클리닝, AI 스마트 CCTV 구축, 조경 수목 전정, 산업용 펜스 시공 등 KOKKIRI의 검증된 현장 실적과 인터랙티브 Before & After 전후 비교 갤러리입니다.",
  path: "/projects",
  keywords: [
    "시공실적",
    "비포애프터",
    "전후비교",
    "클리닝사례",
    "조경실적",
    "펜스공사실적",
    "KOKKIRI실적",
  ],
});

export default function ProjectsPage() {
  const breadcrumbs = getBreadcrumbSchema([{ name: "시공 실적 & 전후비교", url: "/projects" }]);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-2">
            Track Record & Visual Proof
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#173F30] tracking-tight mb-6">
            검증된 프로젝트 실적과<br />
            생생한 시공 전후 비교
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            판교 IT 테크 캠퍼스, 강남 프라임 오피스, 인천 첨단 물류 허브 등 엄격한 품질 기준을 통과한 실제 시공 결과와 Before & After 변화를 확인하세요.
          </p>
        </MotionReveal>
      </div>

      {/* SECTION 1: INTERACTIVE BEFORE & AFTER GALLERY */}
      <section id="before-after" className="mb-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173F30]/10 text-[#173F30] text-xs font-bold mb-3">
            <MoveHorizontal className="w-3.5 h-3.5" />
            <span>Interactive Before & After Slider</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#173F30]">
            시공 전후 인터랙티브 비교 갤러리
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            가운데 슬라이더 바를 좌우로 드래그하면 현장의 극적인 변화를 직관적으로 비교할 수 있습니다.
          </p>
        </div>

        <BeforeAfterGallery />
      </section>

      {/* SECTION 2: VERIFIED PORTFOLIO CASE STUDIES */}
      <section className="mb-20 pt-16 border-t border-black/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-1">
              Case Studies
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#173F30]">
              주요 사업장 종합 포트폴리오
            </h2>
          </div>
          <span className="text-xs text-gray-400 mt-2 md:mt-0">
            총 {PROJECTS.length}건의 검증된 엔터프라이즈 레퍼런스
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Bottom Quotation CTA Box */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#173F30] text-white text-center">
        <h3 className="text-2xl sm:text-3xl font-black mb-3">
          우리 사업장도 이와 같은 품질 개선이 필요하신가요?
        </h3>
        <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto mb-6">
          전문 매니저가 무료로 현장 방문 실사를 진행하고, 현재 상태 진단 리포트와 개선 맞춤 견적서를 산출해 드립니다.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-[#173F30] font-bold text-sm hover:bg-gray-100 transition-all shadow-md"
        >
          <span>무료 현장 실사 및 맞춤 상담 & 문의</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
