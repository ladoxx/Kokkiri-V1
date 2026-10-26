"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { MoveHorizontal, Sparkles, CheckCircle2 } from "lucide-react";

export interface BeforeAfterItem {
  id: string;
  brandSlug: "kokkiri" | "koto";
  title: string;
  category: string;
  client?: string;
  description: string;
  displayMode?: "slider" | "single";
  singleImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeImage?: string;
  afterImage?: string;
  beforeDetails?: string[];
  afterDetails?: string[];
  metric?: string;
}

interface BeforeAfterSliderProps {
  item: BeforeAfterItem;
  className?: string;
}

export function BeforeAfterSlider({ item, className = "" }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, []);

  const isKokkiri = item.brandSlug === "kokkiri";
  const brandColor = isKokkiri ? "#173F30" : "#243A50";
  const brandAccent = isKokkiri ? "#477B56" : "#3E82B8";

  const isSingleMode =
    item.displayMode === "single" ||
    Boolean(item.singleImage) ||
    (!item.beforeImage && Boolean(item.afterImage));

  const singleImg = item.singleImage || item.afterImage || item.beforeImage;
  const hasBeforeDetails = Array.isArray(item.beforeDetails) && item.beforeDetails.length > 0;
  const hasAfterDetails = Array.isArray(item.afterDetails) && item.afterDetails.length > 0;

  return (
    <div className={`bg-white rounded-3xl border border-[#202622]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${className}`}>
      {/* Top Header Card */}
      <div className="p-6 sm:p-7 border-b border-black/5 bg-gray-50/50">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-white"
            style={{ backgroundColor: brandColor }}
          >
            {item.category}
          </span>
          <span className="text-xs font-semibold text-gray-500">
            {isKokkiri ? "KOKKIRI 클리닝" : "KOTO 시설·조경·펜스"}
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-[#202622] tracking-tight mb-2">
          {item.title}
        </h3>

        <p className="text-xs text-[#202622]/70 leading-relaxed">
          {item.description}
        </p>

        {item.metric && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>수행 성과: {item.metric}</span>
          </div>
        )}
      </div>

      {/* Main Visual Viewport: Single Image Mode vs Before/After Slider Mode */}
      {isSingleMode ? (
        <div className="relative w-full aspect-16/10 select-none overflow-hidden bg-gray-900 group">
          {singleImg ? (
            <img
              src={singleImg}
              alt={`${item.title} 시공 사진`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-8 text-white relative overflow-hidden"
              style={{
                background: isKokkiri
                  ? "radial-gradient(circle at 60% 40%, #296847 0%, #173F30 60%, #0d231b 100%)"
                  : "radial-gradient(circle at 60% 40%, #3a5c7c 0%, #243A50 60%, #152230 100%)",
              }}
            >
              <div className="relative z-10 text-center max-w-xs">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                </div>
                <div className="text-sm font-bold text-white mb-1">
                  {item.afterLabel || "시공 완료 현장 사진"}
                </div>
              </div>
            </div>
          )}

          {/* Badge on Single Image */}
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-black tracking-wider uppercase shadow-md flex items-center gap-1.5 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {item.afterLabel || "시공 사진 (PHOTO)"}
            </span>
          </div>
        </div>
      ) : (
        /* Interactive Comparison Viewport */
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchMove={handleTouchMove}
          className="relative w-full aspect-16/10 select-none cursor-ew-resize overflow-hidden bg-gray-900 touch-pan-y"
        >
          {/* AFTER LAYER (Underneath / Full Width Background) */}
          <div className="absolute inset-0 w-full h-full">
            {item.afterImage ? (
              <img
                src={item.afterImage}
                alt={`${item.title} 시공 후 (AFTER)`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              /* High-fidelity CSS / SVG Art Render for AFTER */
              <div
                className="w-full h-full flex flex-col items-center justify-center p-8 text-white relative overflow-hidden"
                style={{
                  background: isKokkiri
                    ? "radial-gradient(circle at 60% 40%, #296847 0%, #173F30 60%, #0d231b 100%)"
                    : "radial-gradient(circle at 60% 40%, #3a5c7c 0%, #243A50 60%, #152230 100%)",
                }}
              >
                <div className="relative z-10 text-center max-w-xs">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div className="text-sm font-bold text-white mb-1">
                    {item.afterLabel || "완벽한 정밀 클리닝 & 복원 완료"}
                  </div>
                  <div className="text-[11px] text-white/80 leading-relaxed">
                    표준화된 위생 프로토콜 적용으로 99% 이상 오염 제거 및 광택 유지
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AFTER BADGE (Always Visible on Top Right) */}
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-black tracking-wider uppercase shadow-md flex items-center gap-1.5 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AFTER (시공 후)
            </span>
          </div>

          {/* BEFORE LAYER (Clipped overlay on the Left with clipPath) */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            {item.beforeImage ? (
              <img
                src={item.beforeImage}
                alt={`${item.title} 시공 전 (BEFORE)`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              /* High-fidelity CSS / SVG Art Render for BEFORE */
              <div
                className="w-full h-full flex flex-col items-center justify-center p-8 text-gray-200 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #423932 0%, #2f2a26 60%, #1c1815 100%)",
                }}
              >
                <div className="relative z-10 text-center max-w-xs">
                  <div className="text-sm font-bold text-amber-200 mb-1">
                    {item.beforeLabel || "장기간 오염 및 노후화 상태"}
                  </div>
                  <div className="text-[11px] text-gray-300 leading-relaxed">
                    미세 분진 누적, 왁스층 박리, 스크래치 및 안전 위해 요소 잔류
                  </div>
                </div>
              </div>
            )}

            {/* BEFORE BADGE (Clipped along with Before layer) */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 text-[11px] font-black tracking-wider uppercase shadow-md border border-amber-400/30">
                BEFORE (시공 전)
              </span>
            </div>
          </div>

          {/* SLIDER DIVIDER LINE & DRAG BUTTON */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-20"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-gray-900 shadow-xl flex items-center justify-center border-2 border-gray-200 hover:scale-110 active:scale-95 transition-transform duration-150">
              <MoveHorizontal className="w-4 h-4" />
            </div>
          </div>

          {/* Drag Hint at Bottom Center */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white/90 font-medium pointer-events-none z-10">
            좌우로 드래그하여 시공 전후 비교
          </div>
        </div>
      )}

      {/* Comparison Details Footer */}
      {(hasBeforeDetails || hasAfterDetails) && (
        <div className={`p-6 bg-white grid gap-4 text-xs ${hasBeforeDetails && hasAfterDetails ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
          {hasBeforeDetails && (
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <div className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>시공 전 상태 (Before)</span>
              </div>
              <ul className="text-[11px] text-amber-950/80 space-y-1.5">
                {item.beforeDetails!.map((det, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 shrink-0 font-bold">•</span>
                    <span className="leading-relaxed">{det}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasAfterDetails && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
              <div className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>시공 후 복원 (After)</span>
              </div>
              <ul className="text-[11px] text-emerald-950/80 space-y-1.5">
                {item.afterDetails!.map((det, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 shrink-0 font-bold">•</span>
                    <span className="leading-relaxed">{det}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
