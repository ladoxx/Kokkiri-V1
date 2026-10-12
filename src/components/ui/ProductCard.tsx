"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowUpRight, Check } from "lucide-react";
import { ProductItem } from "@/lib/data/initial-data";

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const handleOutboundClick = (platform: "naver" | "coupang", url: string) => {
    // Fire tracking request non-blockingly
    fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        platform,
        url,
      }),
    }).catch(() => {});
  };

  return (
    <div className="bg-white rounded-3xl border border-[#202622]/10 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <div>
        {/* Product Image Area */}
        <div className="relative aspect-4/3 bg-[#F4EFE5] flex items-center justify-center overflow-hidden">
          {product.mainImage ? (
            <img
              src={product.mainImage}
              alt={`CHOKO 친환경 ${product.name} - ${product.category}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-[#8C6C43]/20 flex items-center justify-center text-[#8C6C43] group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-bold text-[#8C6C43] uppercase tracking-wider block">
                {product.category}
              </span>
            </div>
          )}

          <div className="absolute top-4 left-4 z-10">
            <span className="px-2.5 py-1 rounded-md bg-[#8C6C43] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
              CHOKO ECO
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <Link href={`/choko/products/${product.slug}`} className="block">
            <h3 className="text-lg font-extrabold text-[#202622] tracking-tight mb-2 group-hover:text-[#8C6C43] transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-[#202622]/70 leading-relaxed mb-4 line-clamp-2">
            {product.summary}
          </p>

          {/* Key Features */}
          <div className="space-y-1.5 mb-6">
            {product.features.slice(0, 2).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-[#202622]/80">
                <Check className="w-3.5 h-3.5 text-[#5E7652] shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* External Purchase Buttons */}
      <div className="px-6 pb-6 pt-2 border-t border-black/5 space-y-2">
        <div className="text-[11px] text-gray-400 font-semibold mb-1">구매 공식 채널:</div>

        {product.naverUrl && (
          <a
            href={product.naverUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleOutboundClick("naver", product.naverUrl)}
            className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-[#03C75A]/10 hover:bg-[#03C75A]/20 text-[#03C75A] font-bold text-xs transition-colors border border-[#03C75A]/20"
          >
            <span>네이버 스마트스토어에서 구매하기</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}

        {product.coupangUrl && (
          <a
            href={product.coupangUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleOutboundClick("coupang", product.coupangUrl)}
            className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-[#cb1400]/10 hover:bg-[#cb1400]/20 text-[#cb1400] font-bold text-xs transition-colors border border-[#cb1400]/20"
          >
            <span>쿠팡에서 구매하기</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}

        <div className="pt-2 text-center">
          <Link
            href={`/choko/products/${product.slug}`}
            className="text-[11px] font-semibold text-[#8C6C43] hover:underline"
          >
            제품 상세 설명 및 스펙 보기 &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
