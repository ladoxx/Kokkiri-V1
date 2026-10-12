"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Save,
  RotateCcw,
  Check,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Clock,
  Layout,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import {
  DEFAULT_SITE_CONTENT,
  SiteContentSettings,
  HeroSectionContent,
  BrandCardContent,
} from "@/lib/types/cms";

export default function AdminContentPage() {
  const [contentData, setContentData] = useState<SiteContentSettings>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchContent = () => {
    setLoading(true);
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data?.content) setContentData(data.content);
      })
      .catch((err) => console.error("Error fetching content:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleHeroChange = (field: keyof HeroSectionContent, value: string) => {
    setContentData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  const handleBrandChange = (
    brandKey: "kokkiri" | "koto" | "choko",
    field: keyof BrandCardContent,
    value: string
  ) => {
    setContentData((prev) => ({
      ...prev,
      brands: {
        ...prev.brands,
        [brandKey]: {
          ...prev.brands[brandKey],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "저장 실패");
      setSaved(true);
      setFeedback({ type: "success", message: data.message || "사이트 문구가 저장되었습니다." });
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "오류가 발생했습니다." });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("모든 문구 및 슬로건을 공장 초기 기본값으로 복원하시겠습니까? (수정하신 문구가 초기화됩니다)")) {
      return;
    }
    setResetting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/content/reset", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "초기화 실패");
      if (data?.content) setContentData(data.content);
      setFeedback({ type: "success", message: data.message || "기본값으로 복원되었습니다." });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "초기화 중 오류 발생" });
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#173F30] mb-3" />
        <span className="text-xs font-bold">사이트 콘텐츠 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              문구 & 콘텐츠 관리 (CMS)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-wide uppercase">
              WordPress형 에디터
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            홈페이지 메인 헤드라인, 브랜드 슬로건, 신뢰도 통계 지표 및 CTA 버튼 문구를 코드 수정 없이 실시간 편집합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={resetting}
            className="px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-bold text-xs hover:bg-gray-50 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {resetting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            )}
            <span>기본값 복원</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#173F30] hover:bg-[#173F30]/90 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saved ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saved ? "저장 완료!" : "전체 문구 저장"}</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-gray-400 hover:text-gray-600 text-xs font-bold"
          >
            닫기
          </button>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: HERO SECTION HEADLINE & SUBTITLE */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200/90 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-xl bg-[#173F30]/10 flex items-center justify-center text-[#173F30]">
              <Layout className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900">
                1. 메인 홈 히어로 (Hero Section) 문구
              </h3>
              <p className="text-[11px] text-gray-500">
                웹사이트 접속 시 가장 먼저 노출되는 대형 헤드라인과 슬로건입니다.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Pill Badge */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                상단 인디케이터 배지 문구
              </label>
              <input
                type="text"
                value={contentData.hero.pillBadge}
                onChange={(e) => handleHeroChange("pillBadge", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#173F30]"
              />
            </div>

            {/* Headline Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  메인 헤드라인 (첫 번째 줄)
                </label>
                <input
                  type="text"
                  value={contentData.hero.titleLine1}
                  onChange={(e) => handleHeroChange("titleLine1", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  메인 헤드라인 (두 번째 줄 그라데이션 강조)
                </label>
                <input
                  type="text"
                  value={contentData.hero.titleLine2Highlight}
                  onChange={(e) => handleHeroChange("titleLine2Highlight", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-[#173F30] focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>
            </div>

            {/* Subheadline */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                서브 슬로건 & 상세 설명 문구
              </label>
              <textarea
                rows={3}
                value={contentData.hero.subtitle}
                onChange={(e) => handleHeroChange("subtitle", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#173F30]"
              />
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700 block">
                  1차 CTA 버튼 (메인 녹색 버튼)
                </span>
                <input
                  type="text"
                  value={contentData.hero.primaryCtaText}
                  onChange={(e) => handleHeroChange("primaryCtaText", e.target.value)}
                  placeholder="버튼 텍스트"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
                <input
                  type="text"
                  value={contentData.hero.primaryCtaHref}
                  onChange={(e) => handleHeroChange("primaryCtaHref", e.target.value)}
                  placeholder="연결 URL (예: /request-quote)"
                  className="w-full px-3.5 py-1.5 rounded-lg border border-gray-200 text-[11px] text-gray-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700 block">
                  2차 CTA 버튼 (화이트 아웃라인 버튼)
                </span>
                <input
                  type="text"
                  value={contentData.hero.secondaryCtaText}
                  onChange={(e) => handleHeroChange("secondaryCtaText", e.target.value)}
                  placeholder="버튼 텍스트"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
                <input
                  type="text"
                  value={contentData.hero.secondaryCtaHref}
                  onChange={(e) => handleHeroChange("secondaryCtaHref", e.target.value)}
                  placeholder="연결 URL (예: /projects#before-after)"
                  className="w-full px-3.5 py-1.5 rounded-lg border border-gray-200 text-[11px] text-gray-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: TRUST STATISTIC PILLS */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200/90 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900">
                2. 히어로 신뢰도 통계 지표 (3개 지표)
              </h3>
              <p className="text-[11px] text-gray-500">
                메인 화면에 노출되는 대표적인 실적 지표 수치와 라벨입니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1 */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 block">지표 1</span>
              <input
                type="text"
                value={contentData.hero.stat1Label}
                onChange={(e) => handleHeroChange("stat1Label", e.target.value)}
                placeholder="라벨 (예: 누적 관리 면적)"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#173F30]"
              />
              <input
                type="text"
                value={contentData.hero.stat1Value}
                onChange={(e) => handleHeroChange("stat1Value", e.target.value)}
                placeholder="수치 (예: 1,200,000㎡+)"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-black text-[#173F30] focus:outline-none focus:ring-1 focus:ring-[#173F30]"
              />
            </div>

            {/* Stat 2 */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 block">지표 2</span>
              <input
                type="text"
                value={contentData.hero.stat2Label}
                onChange={(e) => handleHeroChange("stat2Label", e.target.value)}
                placeholder="라벨 (예: 고객 재계약률)"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#173F30]"
              />
              <input
                type="text"
                value={contentData.hero.stat2Value}
                onChange={(e) => handleHeroChange("stat2Value", e.target.value)}
                placeholder="수치 (예: 98.6%)"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-black text-[#173F30] focus:outline-none focus:ring-1 focus:ring-[#173F30]"
              />
            </div>

            {/* Stat 3 */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 block">지표 3</span>
              <input
                type="text"
                value={contentData.hero.stat3Label}
                onChange={(e) => handleHeroChange("stat3Label", e.target.value)}
                placeholder="라벨 (예: 시설 무재해 기록)"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#173F30]"
              />
              <input
                type="text"
                value={contentData.hero.stat3Value}
                onChange={(e) => handleHeroChange("stat3Value", e.target.value)}
                placeholder="수치 (예: 600일+)"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-black text-[#243A50] focus:outline-none focus:ring-1 focus:ring-[#173F30]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: THREE BRAND SHOWCASE CARDS */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200/90 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900">
                3. 3대 브랜드 쇼케이스 (KOKKIRI · KOTO · CHOKO) 카드 문구
              </h3>
              <p className="text-[11px] text-gray-500">
                홈페이지 중간 영역의 3개 핵심 브랜드 카드의 제목, 슬로건, 설명문입니다.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* KOKKIRI Card */}
            <div className="p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#173F30]" />
                <span className="font-black text-xs text-gray-900">KOKKIRI 프리미엄 클리닝</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={contentData.brands.kokkiri.title}
                  onChange={(e) => handleBrandChange("kokkiri", "title", e.target.value)}
                  placeholder="카드 제목"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none"
                />
                <input
                  type="text"
                  value={contentData.brands.kokkiri.subtitle}
                  onChange={(e) => handleBrandChange("kokkiri", "subtitle", e.target.value)}
                  placeholder="서브타이틀"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none"
                />
              </div>
              <textarea
                rows={2}
                value={contentData.brands.kokkiri.description}
                onChange={(e) => handleBrandChange("kokkiri", "description", e.target.value)}
                placeholder="상세 설명"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-700 focus:outline-none"
              />
            </div>

            {/* KOTO Card */}
            <div className="p-4 sm:p-5 rounded-2xl border border-sky-200 bg-sky-50/20 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#243A50]" />
                <span className="font-black text-xs text-gray-900">KOTO AI 보안 & 시설</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={contentData.brands.koto.title}
                  onChange={(e) => handleBrandChange("koto", "title", e.target.value)}
                  placeholder="카드 제목"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none"
                />
                <input
                  type="text"
                  value={contentData.brands.koto.subtitle}
                  onChange={(e) => handleBrandChange("koto", "subtitle", e.target.value)}
                  placeholder="서브타이틀"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none"
                />
              </div>
              <textarea
                rows={2}
                value={contentData.brands.koto.description}
                onChange={(e) => handleBrandChange("koto", "description", e.target.value)}
                placeholder="상세 설명"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-700 focus:outline-none"
              />
            </div>

            {/* CHOKO Card */}
            <div className="p-4 sm:p-5 rounded-2xl border border-amber-200 bg-amber-50/20 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8C6C43]" />
                <span className="font-black text-xs text-gray-900">CHOKO 에코 라이프케어</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={contentData.brands.choko.title}
                  onChange={(e) => handleBrandChange("choko", "title", e.target.value)}
                  placeholder="카드 제목"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none"
                />
                <input
                  type="text"
                  value={contentData.brands.choko.subtitle}
                  onChange={(e) => handleBrandChange("choko", "subtitle", e.target.value)}
                  placeholder="서브타이틀"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none"
                />
              </div>
              <textarea
                rows={2}
                value={contentData.brands.choko.description}
                onChange={(e) => handleBrandChange("choko", "description", e.target.value)}
                placeholder="상세 설명"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#173F30] hover:bg-[#173F30]/90 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saved ? "문구 저장 완료!" : "전체 문구 설정 저장하기"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
