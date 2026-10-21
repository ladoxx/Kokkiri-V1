import React from "react";
import type { Metadata } from "next";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { BeforeAfterGallery } from "@/components/ui/BeforeAfterGallery";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { PROJECTS } from "@/lib/data/initial-data";
import { Sparkles, MoveHorizontal, ArrowRight } from "lucide-react";
import Link from "next/link";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "클리닝 시공 실적 & 전후비교 | Before & After 갤러리 | KOKKIRI",
  description:
    "판교 테크 캠퍼스, 강남 프라임 오피스, 복합 쇼핑몰 등 코끼리 클리닝의 실제 시공 전후(Before & After) 고화질 비교 갤러리와 정량적 품질 개선 실적입니다.",
  path: "/cleaning/projects",
  keywords: [
    "클리닝실적",
    "청소시공전후",
    "비포애프터",
    "오피스청소사례",
    "대리석복원",
    "준공청소실적",
    "바닥세척",
  ],
});

export default function CleaningProjectsPage() {
  const cleaningProjects = PROJECTS.filter((p) => p.brandSlug === "kokkiri");
  const breadcrumbs = getBreadcrumbSchema([
    { name: "청소 서비스", url: "/cleaning" },
    { name: "시공 실적 & 전후비교", url: "/cleaning/projects" },
  ]);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-2">
            Cleaning References & Transformations
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#173F30] tracking-tight mb-6">
            코끼리 클리닝 실적 & 시공 전후
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            프라임 오피스 대리석 복원, 45,000㎡ 신축 준공 분진 클리닝, 물류 허브 에폭시 세척 등 실제 현장의 생생한 전후 변화를 확인하세요.
          </p>
        </MotionReveal>
      </div>

      {/* Brand Specific Before & After Gallery */}
      <section className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173F30]/10 text-[#173F30] text-xs font-bold mb-2">
            <MoveHorizontal className="w-3.5 h-3.5" />
            <span>KOKKIRI Before & After</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#173F30]">
            클리닝 시공 전후 비교
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            슬라이더를 좌우로 드래그하여 정밀 클리닝 전후 차이를 직접 확인해 보세요.
          </p>
        </div>

        <BeforeAfterGallery initialBrand="kokkiri" showFilters={false} />
      </section>

      {/* Project Case Studies */}
      <section className="mb-20 pt-16 border-t border-black/10">
        <h2 className="text-2xl font-black text-[#173F30] mb-8">
          주요 클리닝 사업장 사례
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cleaningProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <div className="text-center pt-8">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#173F30] text-white font-bold text-sm hover:bg-[#173F30]/90 transition-all shadow-md"
        >
          <span>클리닝 맞춤 상담 & 문의하기</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
