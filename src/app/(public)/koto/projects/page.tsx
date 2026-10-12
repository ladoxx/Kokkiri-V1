import React from "react";
import type { Metadata } from "next";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { BeforeAfterGallery } from "@/components/ui/BeforeAfterGallery";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { PROJECTS } from "@/lib/data/initial-data";
import { Building2, MoveHorizontal, ArrowRight } from "lucide-react";
import Link from "next/link";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "KOTO 시설 프로젝트 실적 & 전후비교 | Before & After | KOKKIRI",
  description:
    "인천 물류센터 AI CCTV 구축, 용인 바이오 캠퍼스 조경 전정, 2.4km 외곽 펜스 교체 공사 등 KOTO의 실제 시공 전후(Before & After) 현장 갤러리입니다.",
  path: "/koto/projects",
  keywords: [
    "KOTO실적",
    "AICCTV구축사례",
    "조경시공전후",
    "펜스공사실적",
    "시설관리실적",
    "비포애프터",
  ],
});

export default function KotoProjectsPage() {
  const kotoProjects = PROJECTS.filter((p) => p.brandSlug === "koto");
  const breadcrumbs = getBreadcrumbSchema([
    { name: "시설관리 & AI보안 (KOTO)", url: "/koto" },
    { name: "시설 실적 & 시공 전후", url: "/koto/projects" },
  ]);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#3E82B8] uppercase tracking-wider block mb-2">
            KOTO Engineering & Site Transformations
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#243A50] tracking-tight mb-6">
            KOTO 주요 실적 & 시공 전후
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            대규모 물류센터 AI 지능형 CCTV 및 24시간 보안 관제부터 조경 수목 힐링 정원 복원 및 외곽 보안 펜스 시공의 전후 변화를 확인하세요.
          </p>
        </MotionReveal>
      </div>

      {/* Brand Specific Before & After Gallery */}
      <section className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#243A50]/10 text-[#243A50] text-xs font-bold mb-2">
            <MoveHorizontal className="w-3.5 h-3.5" />
            <span>KOTO Before & After</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#243A50]">
            AI CCTV·조경·펜스 시공 전후 비교
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            슬라이더를 좌우로 드래그하여 엔지니어링 시공 전후 차이를 비교해 보세요.
          </p>
        </div>

        <BeforeAfterGallery initialBrand="koto" showFilters={false} />
      </section>

      {/* Project Case Studies */}
      <section className="mb-20 pt-16 border-t border-black/10">
        <h2 className="text-2xl font-black text-[#243A50] mb-8">
          주요 AI 보안 및 스마트 시설 시공 사례
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {kotoProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <div className="text-center pt-8">
        <Link
          href="/koto/request-quote"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#243A50] text-white font-bold text-sm hover:bg-[#243A50]/90 transition-all shadow-md"
        >
          <span>KOTO 시설 견적 신청하기</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
