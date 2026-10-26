import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getStoredProducts } from "@/lib/data/products-store";
import { PRODUCTS } from "@/lib/data/initial-data";
import { ShoppingBag, ArrowUpRight, Check, ShieldCheck, ChevronLeft, ArrowRight } from "lucide-react";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { buildPageMetadata, getBreadcrumbSchema, getProductSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug) || PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return buildPageMetadata({
      title: "제품을 찾을 수 없습니다 | KOKKIRI",
      description: "요청하신 CHOKO 친환경 제품을 찾을 수 없습니다.",
      path: `/choko/products/${slug}`,
      noIndex: true,
    });
  }

  const defaultTitle = `${product.name} | 친환경 에코 라이프케어 | KOKKIRI`;
  const defaultDesc = `${product.name} - ${product.summary} ${
    product.features ? product.features.slice(0, 2).join(". ") : ""
  }`.slice(0, 160);

  const title = product.metaTitle || defaultTitle;
  const description = product.metaDesc || defaultDesc;
  const keywords = product.keywords && product.keywords.length > 0
    ? product.keywords
    : [product.name, product.category, "CHOKO", "친환경제품", "대나무", "비건", "KOKKIRI", "네이버스마트스토어"];

  return buildPageMetadata({
    title,
    description,
    path: `/choko/products/${slug}`,
    keywords,
    ogImage: product.mainImage,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug) || PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
    return null;
  }

  const breadcrumbs = getBreadcrumbSchema([
    { name: "친환경 에코제품 (CHOKO)", url: "/choko" },
    { name: "제품 카탈로그", url: "/choko/products" },
    { name: product.name, url: `/choko/products/${slug}` },
  ]);

  const productSchema = getProductSchema({
    name: product.metaTitle || product.name,
    description: product.metaDesc || product.description || product.summary,
    image: product.mainImage,
    sku: product.id,
    brandName: "CHOKO (주식회사 코끼리)",
    url: `/choko/products/${slug}`,
    price: product.price,
    naverUrl: product.naverUrl,
    coupangUrl: product.coupangUrl,
  });

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={[breadcrumbs, productSchema]} />
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/choko/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6C43] hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>CHOKO 전체 제품 목록으로 돌아가기</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        {/* Left: Product Visual Presentation Area */}
        <div className="lg:col-span-5">
          <div className="sticky top-28">
            <div className="aspect-square rounded-3xl bg-[#F4EFE5] border border-[#8C6C43]/20 flex flex-col items-center justify-center relative overflow-hidden mb-4 shadow-sm">
              {product.mainImage ? (
                <img
                  src={product.mainImage}
                  alt={`CHOKO 친환경 ${product.name} 공식 제품 사진`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-8 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-[#8C6C43]/20 flex items-center justify-center text-[#8C6C43] mb-4 mx-auto">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                  <span className="text-xs font-bold text-[#8C6C43] uppercase tracking-wider mb-2 block">
                    {product.category}
                  </span>
                  <h3 className="text-xl font-black text-[#202622]">{product.name}</h3>
                </div>
              )}

              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-[#8C6C43] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                  CHOKO OFFICIAL
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#202622]/10 text-xs text-gray-500 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#5E7652] shrink-0" />
              <span>본 제품은 친환경 및 안전 기준 검사를 통과한 정품입니다.</span>
            </div>
          </div>
        </div>

        {/* Right: Product Information & Purchase Channels */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-xs font-bold text-[#8C6C43] uppercase tracking-wider block mb-2">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#202622] tracking-tight leading-snug mb-4">
              {product.name}
            </h1>
            <p className="text-sm font-semibold text-[#8C6C43] mb-6 leading-relaxed">
              {product.summary}
            </p>
            <p className="text-xs sm:text-sm text-[#202622]/75 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* External Purchase Buttons Box (Section 11) */}
          <div className="p-6 rounded-3xl bg-[#F4EFE5] border border-[#8C6C43]/30">
            <h3 className="text-sm font-bold text-[#202622] mb-2">
              공식 외부 구매 링크 안내
            </h3>
            <p className="text-xs text-[#202622]/70 leading-relaxed mb-6">
              CHOKO는 내부 결제 및 장바구니를 운영하지 않으며, 공식 네이버 스마트스토어와 쿠팡을 통해 빠르고 안전하게 구매하실 수 있습니다.
            </p>

            <div className="space-y-3">
              {product.naverUrl && (
                <a
                  href={product.naverUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full py-4 px-6 rounded-2xl bg-[#03C75A] text-white font-bold text-sm shadow-sm hover:bg-[#03C75A]/90 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base">N</span>
                    <span>네이버 스마트스토어에서 구매하기</span>
                  </div>
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              )}

              {product.coupangUrl && (
                <a
                  href={product.coupangUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full py-4 px-6 rounded-2xl bg-[#cb1400] text-white font-bold text-sm shadow-sm hover:bg-[#cb1400]/90 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base">C</span>
                    <span>쿠팡에서 구매하기</span>
                  </div>
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Key Features */}
          <div className="p-6 rounded-3xl bg-white border border-[#202622]/10 shadow-sm">
            <h3 className="text-sm font-bold text-[#202622] uppercase tracking-wider mb-4">
              제품 특장점 (Key Features)
            </h3>
            <div className="space-y-2.5">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#202622]/85">
                  <Check className="w-4 h-4 text-[#5E7652] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications Table */}
          <div className="p-6 rounded-3xl bg-white border border-[#202622]/10 shadow-sm">
            <h3 className="text-sm font-bold text-[#202622] uppercase tracking-wider mb-4">
              제품 상세 스펙 (Specifications)
            </h3>
            <table className="w-full text-xs">
              <tbody>
                {product.specs.map((spec, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-b-0">
                    <th className="py-2.5 px-3 bg-gray-50 text-left font-bold text-gray-500 w-28">
                      {spec.label}
                    </th>
                    <td className="py-2.5 px-3 text-gray-800">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
