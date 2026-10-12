"use client";

import React, { useState, useEffect } from "react";
import { BeforeAfterSlider, BeforeAfterItem } from "./BeforeAfterSlider";
import { BEFORE_AFTER_ITEMS } from "@/lib/data/before-after-data";
import { Sparkles, Building2, Layers } from "lucide-react";
import { MotionReveal } from "../animations/MotionReveal";

interface BeforeAfterGalleryProps {
  initialBrand?: "all" | "kokkiri" | "koto";
  limit?: number;
  showFilters?: boolean;
}

export function BeforeAfterGallery({
  initialBrand = "all",
  limit,
  showFilters = true,
}: BeforeAfterGalleryProps) {
  const [items, setItems] = useState<BeforeAfterItem[]>(BEFORE_AFTER_ITEMS);
  const [selectedBrand, setSelectedBrand] = useState<"all" | "kokkiri" | "koto">(initialBrand);

  useEffect(() => {
    fetch("/api/admin/before-after")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch(() => {});
  }, []);

  const filteredItems = items.filter((item) => {
    if (selectedBrand === "all") return true;
    return item.brandSlug === selectedBrand;
  });

  const displayItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  return (
    <div className="space-y-10">
      {/* Brand Filter Tabs */}
      {showFilters && (
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-[#202622]/10 shadow-xs">
            <button
              onClick={() => setSelectedBrand("all")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBrand === "all"
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>전체 시공 전후 ({BEFORE_AFTER_ITEMS.length})</span>
            </button>

            <button
              onClick={() => setSelectedBrand("kokkiri")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBrand === "kokkiri"
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>KOKKIRI 클리닝 (3)</span>
            </button>

            <button
              onClick={() => setSelectedBrand("koto")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBrand === "koto"
                  ? "bg-[#243A50] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>KOTO 시설·조경·펜스 (3)</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid of Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {displayItems.map((item) => (
          <MotionReveal key={item.id} direction="up">
            <BeforeAfterSlider item={item} />
          </MotionReveal>
        ))}
      </div>
    </div>
  );
}
