import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, ChevronRight, Sparkles, Building2, Leaf, MoveHorizontal } from "lucide-react";
import { HeroSection } from "@/components/ui/HeroSection";
import { BrandShowcase } from "@/components/ui/BrandShowcase";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { BeforeAfterGallery } from "@/components/ui/BeforeAfterGallery";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { SERVICES, PROJECTS, NEWS_LIST } from "@/lib/data/initial-data";
import { getStoredProducts } from "@/lib/data/products-store";
import { getSiteContent } from "@/lib/data/content-store";
import { buildPageMetadata } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "KOKKIRI | 시설관리·청소·보안·조경 전문기업",
  description:
    "KOKKIRI(주식회사 코끼리)는 시설관리, 병원·사무실·상가 청소, AI 지능형 CCTV 보안, 조경 관리, 펜스 시공 등 수도권 사업장에 필요한 통합 솔루션을 전문적으로 제공합니다.",
  path: "/",
  keywords: [
    "시설관리",
    "청소",
    "병원청소",
    "건물청소",
    "사무실청소",
    "상가청소",
    "정기청소",
    "특수청소",
    "보안",
    "경비",
    "조경",
    "펜스",
    "울타리",
    "시설공사",
    "친환경 제품",
    "반려동물 제품",
    "파주",
    "문산",
    "운정",
    "일산",
    "고양",
    "김포",
    "서울",
    "경기도",
  ],
});

export default function HomePage() {
  const siteContent = getSiteContent();
  const featuredServices = SERVICES.filter((s) => s.isFeatured).slice(0, 4);
  const featuredProjects = PROJECTS.filter((p) => p.isFeatured).slice(0, 2);
  const chokoProducts = getStoredProducts().slice(0, 3);
  const latestNews = NEWS_LIST.slice(0, 3);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KOKKIRI",
    url: "https://kokkiri.com",
    description: "시설관리·청소·보안·조경 전문기업 주식회사 코끼리 공식 비즈니스 플랫폼",
  };

  return (
    <div className="flex flex-col gap-24 sm:gap-32 pb-20">
      <JsonLd data={websiteSchema} />
      {/* 1. Hero Section with staggered entrance */}
      <HeroSection />

      {/* 2. Company Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <MotionReveal direction="left">
              <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-2">
                {siteContent.homeAbout.pillBadge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#173F30] tracking-tight leading-tight mb-6">
                {siteContent.homeAbout.title}
              </h2>
              <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed mb-6">
                {siteContent.homeAbout.paragraph1}
              </p>
              <p className="text-sm text-[#202622]/70 leading-relaxed mb-8">
                {siteContent.homeAbout.paragraph2}
              </p>

              <Link
                href={siteContent.homeAbout.linkHref || "/about"}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#173F30] hover:text-[#477B56] transition-colors group"
              >
                <span>{siteContent.homeAbout.linkText}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </MotionReveal>
          </div>

          <div className="lg:col-span-7">
            <MotionReveal direction="right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-white border border-[#202622]/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-[#173F30]/10 text-[#173F30] flex items-center justify-center font-bold mb-4">
                    01
                  </div>
                  <h4 className="text-base font-bold text-[#202622] mb-2">{siteContent.homeAbout.point1Title}</h4>
                  <p className="text-xs text-[#202622]/70 leading-relaxed">
                    {siteContent.homeAbout.point1Desc}
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#202622]/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-[#243A50]/10 text-[#243A50] flex items-center justify-center font-bold mb-4">
                    02
                  </div>
                  <h4 className="text-base font-bold text-[#202622] mb-2">{siteContent.homeAbout.point2Title}</h4>
                  <p className="text-xs text-[#202622]/70 leading-relaxed">
                    {siteContent.homeAbout.point2Desc}
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#202622]/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-[#8C6C43]/10 text-[#8C6C43] flex items-center justify-center font-bold mb-4">
                    03
                  </div>
                  <h4 className="text-base font-bold text-[#202622] mb-2">{siteContent.homeAbout.point3Title}</h4>
                  <p className="text-xs text-[#202622]/70 leading-relaxed">
                    {siteContent.homeAbout.point3Desc}
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#202622]/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-[#477B56]/10 text-[#477B56] flex items-center justify-center font-bold mb-4">
                    04
                  </div>
                  <h4 className="text-base font-bold text-[#202622] mb-2">{siteContent.homeAbout.point4Title}</h4>
                  <p className="text-xs text-[#202622]/70 leading-relaxed">
                    {siteContent.homeAbout.point4Desc}
                  </p>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* 3. Three Integrated Brands */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <MotionReveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-2">
              Three Integrated Brands
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#173F30] tracking-tight mb-4">
              {siteContent.brandSectionTitle}
            </h2>
            <p className="text-sm text-[#202622]/70 leading-relaxed">
              {siteContent.brandSectionSubtitle}
            </p>
          </div>
        </MotionReveal>

        <BrandShowcase />
      </section>

      {/* 4. Main Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <MotionReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-2">
                Core Services
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#173F30] tracking-tight">
                주요 서비스 안내
              </h2>
            </div>
            <Link
              href="/services"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-[#173F30] hover:underline"
            >
              <span>전체 8개 서비스 모두 보기</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE BEFORE & AFTER COMPARISON SHOWCASE (NEW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <MotionReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173F30]/10 text-[#173F30] text-xs font-bold mb-2">
                <MoveHorizontal className="w-3.5 h-3.5" />
                <span>Before & After Transformation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#173F30] tracking-tight">
                시공 전후 비교 갤러리
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                슬라이더를 좌우로 드래그하여 코끼리와 KOTO의 정밀 시공 전후 변화를 직접 확인하세요.
              </p>
            </div>
            <Link
              href="/projects#before-after"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-[#173F30] hover:underline"
            >
              <span>전체 전후 비교 사례 보기</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </MotionReveal>

        {/* Before After Interactive Sliders */}
        <BeforeAfterGallery limit={2} showFilters={false} />
      </section>

      {/* 6. Projects Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <MotionReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-2">
                Verified Projects
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#173F30] tracking-tight">
                검증된 프로젝트 실적
              </h2>
            </div>
            <Link
              href="/projects"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-[#173F30] hover:underline"
            >
              <span>전체 프로젝트 보기</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* 7. CHOKO Eco Lifestyle Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <MotionReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-[#8C6C43] uppercase tracking-wider block mb-2">
                CHOKO Eco Showcase
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#202622] tracking-tight">
                CHOKO 에코 라이프케어
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                ※ 네이버 스마트스토어 및 쿠팡 공식몰을 통해 안전하고 빠르게 구매하실 수 있습니다.
              </p>
            </div>
            <Link
              href="/choko/products"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6C43] hover:underline"
            >
              <span>전체 에코 제품 보기</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {chokoProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 8. Corporate Inquiry Call-To-Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-[#173F30] text-[#F8F8F4] p-8 sm:p-14 text-center relative overflow-hidden shadow-xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#477B56]/30 blur-3xl" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#65A377] uppercase tracking-wider block mb-3">
              Start Your Project
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              새로운 프로젝트를 함께 시작해보세요.
            </h2>
            <p className="text-sm sm:text-base text-[#F8F8F4]/80 leading-relaxed mb-8">
              공간의 규모와 목적에 맞는 최적의 견적과 위생·보안 관리 플랜을 제안해 드립니다.
              전문 매니저의 무료 현장 실사 및 방문 상담을 받아보세요.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#F8F8F4] text-[#173F30] font-bold text-sm hover:bg-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                온라인 문의 & 상담 신청하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Latest News & Notices */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <MotionReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-2">
                News & Insights
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#173F30] tracking-tight">
                코끼리 최신 소식
              </h2>
            </div>
            <Link
              href="/news"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-[#173F30] hover:underline"
            >
              <span>뉴스 전체보기</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((news) => (
            <div
              key={news.id}
              className="p-6 rounded-3xl bg-white border border-[#202622]/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span className="font-bold text-[#477B56]">{news.category}</span>
                  <span>{news.publishedAt}</span>
                </div>
                <h3 className="text-base font-bold text-[#202622] leading-snug mb-3 hover:text-[#173F30] transition-colors">
                  {news.title}
                </h3>
                <p className="text-xs text-[#202622]/70 leading-relaxed line-clamp-3">
                  {news.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-[#173F30]">
                <span>읽는 시간 {news.readTime}</span>
                <Link href={`/news`} className="hover:underline">
                  자세히 보기 &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
