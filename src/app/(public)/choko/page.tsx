import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { getStoredProducts } from "@/lib/data/products-store";
import { Leaf, ArrowUpRight, Sparkles, CheckCircle2, ShieldCheck, Heart } from "lucide-react";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "친환경 제품 | 반려동물·생활용품 에코 브랜드 | KOKKIRI",
  description:
    "자연과 일상이 공존하는 라이프케어 CHOKO(초코). 비건 반려견 도그 사료, 100% 대나무 롤 화장지, 대나무 일회용 타월, 편백 피톤치드 탈취제를 만나보세요.",
  path: "/choko",
  keywords: [
    "친환경제품",
    "반려동물제품",
    "비건사료",
    "대나무화장지",
    "대나무티슈",
    "일회용타월",
    "친환경생활용품",
    "CHOKO",
  ],
});

export default function ChokoBrandPage() {
  const featuredProducts = getStoredProducts().slice(0, 3);
  const breadcrumbs = getBreadcrumbSchema([{ name: "친환경 에코제품 (CHOKO)", url: "/choko" }]);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      {/* Brand Hero */}
      <div className="rounded-3xl bg-[#8C6C43] text-[#F4EFE5] p-8 sm:p-16 mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B89366]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold mb-6">
            <Leaf className="w-4 h-4 text-[#F4EFE5]" />
            <span>CHOKO Eco & Sustainable Lifestyle</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-6 text-white">
            자연과 일상이 공존하는<br />
            지속 가능한 에코 라이프케어
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-8">
            나무를 베지 않는 100% 대나무 위생용품부터 식이 알레르기 걱정 없는 건강한 비건 펫푸드까지,
            지구와 가족 모두의 건강한 내일을 생각하는 친환경 소비재 브랜드입니다.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/choko/products"
              className="px-6 py-3.5 rounded-xl bg-[#F4EFE5] text-[#8C6C43] font-bold text-sm hover:bg-white transition-all shadow-md"
            >
              전체 에코 제품 카탈로그 보기
            </Link>
          </div>
        </div>
      </div>

      {/* Philosophy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="p-8 rounded-3xl bg-white border border-[#202622]/10 shadow-sm text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#8C6C43]/10 text-[#8C6C43] flex items-center justify-center mb-4">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#202622] mb-2">100% 대나무 펄프 & 섬유</h3>
          <p className="text-xs text-[#202622]/70 leading-relaxed">
            나무 벌목 없이 빠르게 자라는 대나무만을 사용하여 산림을 보호하고 자연 생분해되는 친환경 원자재를 고집합니다.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#202622]/10 shadow-sm text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#5E7652]/10 text-[#5E7652] flex items-center justify-center mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#202622] mb-2">100% 비건 클린 포뮬러</h3>
          <p className="text-xs text-[#202622]/70 leading-relaxed">
            동물성 원료와 인공 첨가물을 철저히 배제하고, 수의 영양학 기준을 충족하는 식물성 단백질 슈퍼푸드로 설계합니다.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#202622]/10 shadow-sm text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#8C6C43]/10 text-[#8C6C43] flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#202622] mb-2">유해 화학물질 4-FREE</h3>
          <p className="text-xs text-[#202622]/70 leading-relaxed">
            형광증백제, 포름알데히드, 인공색소, 인공향료를 배제하여 민감한 아기와 피부 질환이 있는 분도 안심할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Featured Products Showcase */}
      <section className="mb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-[#8C6C43] uppercase tracking-wider block mb-1">
              Popular Eco Items
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#202622]">
              CHOKO 대표 인기 제품
            </h2>
          </div>
          <Link href="/choko/products" className="text-xs font-bold text-[#8C6C43] hover:underline flex items-center gap-1">
            <span>제품 전체보기</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  );
}
