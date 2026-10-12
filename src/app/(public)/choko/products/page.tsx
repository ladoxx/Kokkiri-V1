import React from "react";
import type { Metadata } from "next";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { getStoredProducts } from "@/lib/data/products-store";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "CHOKO 제품 카탈로그 | 대나무 화장지·비건 사료·타월 | KOKKIRI",
  description:
    "100% 대나무 무형광 화장지, 대나무 페이셜 타월, 식이 알레르기 케어 비건 도그 사료, 편백 피톤치드 공간 탈취제 등 친환경 라이프케어 제품 전체 라인업 안내입니다.",
  path: "/choko/products",
  keywords: [
    "CHOKO제품",
    "대나무화장지",
    "대나무티슈",
    "비건사료",
    "일회용타월",
    "친환경탈취제",
    "친환경제품",
  ],
});

export default function ChokoProductsCatalogPage() {
  const products = getStoredProducts();
  const breadcrumbs = getBreadcrumbSchema([
    { name: "친환경 에코제품 (CHOKO)", url: "/choko" },
    { name: "제품 카탈로그", url: "/choko/products" },
  ]);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#8C6C43] uppercase tracking-wider block mb-2">
            Eco Product Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#202622] tracking-tight mb-6">
            CHOKO 친환경 제품 라인업
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            원료 선택부터 포장까지 지속 가능성을 고려한 CHOKO의 에코 라이프케어 제품들을 만나보세요.
            모든 제품은 네이버 스마트스토어 및 쿠팡 공식몰을 통해 편리하게 주문하실 수 있습니다.
          </p>
        </MotionReveal>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {products.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>

      {/* Outbound Purchase Policy Banner */}
      <div className="p-6 rounded-2xl bg-[#F4EFE5] border border-[#8C6C43]/20 text-center max-w-2xl mx-auto text-xs text-[#8C6C43] leading-relaxed">
        <strong>※ 공식 판매 채널 안내:</strong> CHOKO는 고객님들의 안전한 결제와 신속한 배송을 위해 네이버 스마트스토어 및 쿠팡 공식 스토어 채널을 통해서만 정품 판매를 진행하고 있습니다. 자체 쇼핑몰 결제는 지원하지 않습니다.
      </div>
    </div>
  );
}
