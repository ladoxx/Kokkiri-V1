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
  Layout,
  Building,
  Video,
  Leaf,
  Phone,
  Info,
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
  const [activeTab, setActiveTab] = useState<"home" | "cleaning" | "koto" | "choko" | "about" | "contact">("home");
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

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      setFeedback({ type: "success", message: data.message || "사이트 전체 문구가 성공적으로 저장되었습니다." });
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "오류가 발생했습니다.";
      setFeedback({ type: "error", message: msg });
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
      setContentData(data.content);
      setFeedback({ type: "success", message: data.message || "기본값으로 복원되었습니다." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "복원 오류";
      setFeedback({ type: "error", message: msg });
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#173F30]" />
        <span className="text-xs font-semibold">사이트 문구 데이터를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              문구 & 콘텐츠 관리 (CMS)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-wide uppercase">
              실시간 편집 모드
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            홈페이지, 클리닝, AI 보안, 에코제품, 회사소개, 고객센터 등 사이트 내 모든 문구와 슬로건을 실시간 편집합니다.
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
            onClick={() => handleSave()}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#173F30] hover:bg-[#173F30]/90 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saved ? "저장 완료!" : "전체 문구 저장"}</span>
          </button>
        </div>
      </div>

      {/* Info Notice: Company Settings Cross-Link */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-start sm:items-center gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>회사 기본 고지 정보</strong> (회사명, 대표자 성명, 대표 전화번호, 사업자등록번호, 본사 주소)는{" "}
            <strong>[시스템 설정 &gt; 기업 공식 고지]</strong> 메뉴에서 일괄 변경하실 수 있습니다.
          </span>
        </div>
        <Link
          href="/admin/settings?tab=company"
          className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold hover:bg-amber-100/50 transition-colors inline-flex items-center gap-1 shadow-2xs text-[11px]"
        >
          <span>기업 정보 편집</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
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
            className="text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
          >
            닫기
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-gray-200/60 rounded-2xl overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("home")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "home"
              ? "bg-white text-[#173F30] shadow-xs"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Layout className="w-3.5 h-3.5 text-[#173F30]" />
          <span>1. 메인 홈 (Home)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cleaning")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "cleaning"
              ? "bg-white text-[#173F30] shadow-xs"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#477B56]" />
          <span>2. 클리닝 KOKKIRI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("koto")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "koto"
              ? "bg-white text-[#243A50] shadow-xs"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Video className="w-3.5 h-3.5 text-[#243A50]" />
          <span>3. AI보안·시설 KOTO</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("choko")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "choko"
              ? "bg-white text-[#8C6C43] shadow-xs"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Leaf className="w-3.5 h-3.5 text-[#8C6C43]" />
          <span>4. 에코제품 CHOKO</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("about")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "about"
              ? "bg-white text-gray-900 shadow-xs"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Building className="w-3.5 h-3.5 text-gray-600" />
          <span>5. 회사소개 (About)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "contact"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Phone className="w-3.5 h-3.5 text-emerald-700" />
          <span>6. 고객센터 (Contact)</span>
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* ============================================================== */}
        {/* TAB 1: MAIN HOMEPAGE                                           */}
        {/* ============================================================== */}
        {activeTab === "home" && (
          <div className="space-y-6">
            {/* 1. HERO SECTION */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200/90 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-xl bg-[#173F30]/10 flex items-center justify-center text-[#173F30]">
                  <Layout className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">
                    메인 홈 대형 히어로 (Hero Section) 문구
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    방문자가 웹사이트 첫 화면에서 마주하는 대형 슬로건과 CTA 버튼입니다.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
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
                      placeholder="연결 URL (예: /contact)"
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

            {/* 2. STATS */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200/90 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">
                    히어로 3대 신뢰 지표 (실적 통계 배지)
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    메인 화면 헤드라인 아래 노출되는 3대 대표 지표입니다.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-gray-500 block">지표 1</span>
                  <input
                    type="text"
                    value={contentData.hero.stat1Label}
                    onChange={(e) => handleHeroChange("stat1Label", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold focus:outline-none"
                  />
                  <input
                    type="text"
                    value={contentData.hero.stat1Value}
                    onChange={(e) => handleHeroChange("stat1Value", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-black text-[#173F30] focus:outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-gray-500 block">지표 2</span>
                  <input
                    type="text"
                    value={contentData.hero.stat2Label}
                    onChange={(e) => handleHeroChange("stat2Label", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold focus:outline-none"
                  />
                  <input
                    type="text"
                    value={contentData.hero.stat2Value}
                    onChange={(e) => handleHeroChange("stat2Value", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-black text-[#173F30] focus:outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-gray-500 block">지표 3</span>
                  <input
                    type="text"
                    value={contentData.hero.stat3Label}
                    onChange={(e) => handleHeroChange("stat3Label", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold focus:outline-none"
                  />
                  <input
                    type="text"
                    value={contentData.hero.stat3Value}
                    onChange={(e) => handleHeroChange("stat3Value", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-black text-[#243A50] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. HOME ABOUT SECTION */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200/90 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">
                    메인 홈 기업 소개 섹션 문구
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    히어로 바로 아래 위치하는 기업 철학 설명 및 4대 핵심 역량 카드입니다.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">인디케이터 배지</label>
                    <input
                      type="text"
                      value={contentData.homeAbout.pillBadge}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          homeAbout: { ...prev.homeAbout, pillBadge: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">메인 제목</label>
                    <input
                      type="text"
                      value={contentData.homeAbout.title}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          homeAbout: { ...prev.homeAbout, title: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">소개 본문 (첫 번째 문단)</label>
                    <textarea
                      rows={3}
                      value={contentData.homeAbout.paragraph1}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          homeAbout: { ...prev.homeAbout, paragraph1: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">소개 본문 (두 번째 문단)</label>
                    <textarea
                      rows={3}
                      value={contentData.homeAbout.paragraph2}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          homeAbout: { ...prev.homeAbout, paragraph2: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">더 알아보기 링크 문구</label>
                    <input
                      type="text"
                      value={contentData.homeAbout.linkText}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          homeAbout: { ...prev.homeAbout, linkText: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">연결 링크 (기본: /about)</label>
                    <input
                      type="text"
                      value={contentData.homeAbout.linkHref}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          homeAbout: { ...prev.homeAbout, linkHref: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-gray-800 block mb-2">4대 핵심 포인트 카드</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                      <span className="text-[11px] font-bold text-gray-600">포인트 01</span>
                      <input
                        type="text"
                        value={contentData.homeAbout.point1Title}
                        onChange={(e) =>
                          setContentData((prev) => ({
                            ...prev,
                            homeAbout: { ...prev.homeAbout, point1Title: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        value={contentData.homeAbout.point1Desc}
                        onChange={(e) =>
                          setContentData((prev) => ({
                            ...prev,
                            homeAbout: { ...prev.homeAbout, point1Desc: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-[11px] focus:outline-none"
                      />
                    </div>

                    <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                      <span className="text-[11px] font-bold text-gray-600">포인트 02</span>
                      <input
                        type="text"
                        value={contentData.homeAbout.point2Title}
                        onChange={(e) =>
                          setContentData((prev) => ({
                            ...prev,
                            homeAbout: { ...prev.homeAbout, point2Title: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        value={contentData.homeAbout.point2Desc}
                        onChange={(e) =>
                          setContentData((prev) => ({
                            ...prev,
                            homeAbout: { ...prev.homeAbout, point2Desc: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-[11px] focus:outline-none"
                      />
                    </div>

                    <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                      <span className="text-[11px] font-bold text-gray-600">포인트 03</span>
                      <input
                        type="text"
                        value={contentData.homeAbout.point3Title}
                        onChange={(e) =>
                          setContentData((prev) => ({
                            ...prev,
                            homeAbout: { ...prev.homeAbout, point3Title: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        value={contentData.homeAbout.point3Desc}
                        onChange={(e) =>
                          setContentData((prev) => ({
                            ...prev,
                            homeAbout: { ...prev.homeAbout, point3Desc: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-[11px] focus:outline-none"
                      />
                    </div>

                    <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                      <span className="text-[11px] font-bold text-gray-600">포인트 04</span>
                      <input
                        type="text"
                        value={contentData.homeAbout.point4Title}
                        onChange={(e) =>
                          setContentData((prev) => ({
                            ...prev,
                            homeAbout: { ...prev.homeAbout, point4Title: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        value={contentData.homeAbout.point4Desc}
                        onChange={(e) =>
                          setContentData((prev) => ({
                            ...prev,
                            homeAbout: { ...prev.homeAbout, point4Desc: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-[11px] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. BRAND CARDS SHOWCASE */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200/90 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">
                    메인 홈 3대 브랜드 쇼케이스 카드 문구
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    홈페이지 중앙에 위치한 3개 브랜드의 소개 카드입니다.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Section title & subtitle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">섹션 제목</label>
                    <input
                      type="text"
                      value={contentData.brandSectionTitle}
                      onChange={(e) => setContentData((prev) => ({ ...prev, brandSectionTitle: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">섹션 부제목</label>
                    <input
                      type="text"
                      value={contentData.brandSectionSubtitle}
                      onChange={(e) => setContentData((prev) => ({ ...prev, brandSectionSubtitle: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* KOKKIRI */}
                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 space-y-2.5">
                  <span className="font-black text-xs text-gray-900 block">KOKKIRI 프리미엄 클리닝 카드</span>
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

                {/* KOTO */}
                <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/20 space-y-2.5">
                  <span className="font-black text-xs text-gray-900 block">KOTO AI 보안 & 시설 카드</span>
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

                {/* CHOKO */}
                <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/20 space-y-2.5">
                  <span className="font-black text-xs text-gray-900 block">CHOKO 에코 라이프케어 카드</span>
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
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: CLEANING KOKKIRI                                         */}
        {/* ============================================================== */}
        {activeTab === "cleaning" && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200/90 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-gray-900">
                  클리닝 페이지 (/cleaning) 문구 & FAQ 관리
                </h3>
                <p className="text-[11px] text-gray-500">
                  프리미엄 클리닝 브랜드 페이지 상단 배너와 자주 묻는 질문(FAQ)을 관리합니다.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">상단 인디케이터 배지</label>
                <input
                  type="text"
                  value={contentData.cleaning.pillBadge}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      cleaning: { ...prev.cleaning, pillBadge: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">메인 헤드라인</label>
                <input
                  type="text"
                  value={contentData.cleaning.headline}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      cleaning: { ...prev.cleaning, headline: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">상세 설명문</label>
                <textarea
                  rows={3}
                  value={contentData.cleaning.description}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      cleaning: { ...prev.cleaning, description: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">1차 상담 버튼 문구</label>
                  <input
                    type="text"
                    value={contentData.cleaning.primaryCtaText}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        cleaning: { ...prev.cleaning, primaryCtaText: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">2차 전체보기 버튼 문구</label>
                  <input
                    type="text"
                    value={contentData.cleaning.secondaryCtaText}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        cleaning: { ...prev.cleaning, secondaryCtaText: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">서비스 분야 섹션 제목</label>
                  <input
                    type="text"
                    value={contentData.cleaning.sectionTitle}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        cleaning: { ...prev.cleaning, sectionTitle: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* FAQ Section */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <span className="text-xs font-bold text-gray-900 block">클리닝 자주 묻는 질문 (FAQ 4선)</span>
                {contentData.cleaning.faqs?.map((faq, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-800">질문 {idx + 1}</span>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...(contentData.cleaning.faqs || [])];
                        newFaqs[idx].question = e.target.value;
                        setContentData((prev) => ({
                          ...prev,
                          cleaning: { ...prev.cleaning, faqs: newFaqs },
                        }));
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...(contentData.cleaning.faqs || [])];
                        newFaqs[idx].answer = e.target.value;
                        setContentData((prev) => ({
                          ...prev,
                          cleaning: { ...prev.cleaning, faqs: newFaqs },
                        }));
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: KOTO AI SECURITY & FACILITY                             */}
        {/* ============================================================== */}
        {activeTab === "koto" && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200/90 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center font-bold">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-gray-900">
                  AI보안 & 시설 페이지 (/koto) 문구 & FAQ 관리
                </h3>
                <p className="text-[11px] text-gray-500">
                  KOTO 솔루션 상단 배너와 자주 묻는 질문(FAQ)을 관리합니다.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">상단 인디케이터 배지</label>
                <input
                  type="text"
                  value={contentData.koto.pillBadge}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      koto: { ...prev.koto, pillBadge: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">메인 헤드라인</label>
                <input
                  type="text"
                  value={contentData.koto.headline}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      koto: { ...prev.koto, headline: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">상세 설명문</label>
                <textarea
                  rows={3}
                  value={contentData.koto.description}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      koto: { ...prev.koto, description: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">1차 상담 버튼 문구</label>
                  <input
                    type="text"
                    value={contentData.koto.primaryCtaText}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        koto: { ...prev.koto, primaryCtaText: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">2차 전체보기 버튼 문구</label>
                  <input
                    type="text"
                    value={contentData.koto.secondaryCtaText}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        koto: { ...prev.koto, secondaryCtaText: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">솔루션 분야 섹션 제목</label>
                  <input
                    type="text"
                    value={contentData.koto.sectionTitle}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        koto: { ...prev.koto, sectionTitle: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* FAQ Section */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <span className="text-xs font-bold text-gray-900 block">KOTO 자주 묻는 질문 (FAQ 4선)</span>
                {contentData.koto.faqs?.map((faq, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                    <span className="text-[11px] font-bold text-sky-800">질문 {idx + 1}</span>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...(contentData.koto.faqs || [])];
                        newFaqs[idx].question = e.target.value;
                        setContentData((prev) => ({
                          ...prev,
                          koto: { ...prev.koto, faqs: newFaqs },
                        }));
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...(contentData.koto.faqs || [])];
                        newFaqs[idx].answer = e.target.value;
                        setContentData((prev) => ({
                          ...prev,
                          koto: { ...prev.koto, faqs: newFaqs },
                        }));
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CHOKO ECO LIFECARE                                      */}
        {/* ============================================================== */}
        {activeTab === "choko" && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200/90 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-gray-900">
                  에코제품 페이지 (/choko) 문구 & 3대 철학 관리
                </h3>
                <p className="text-[11px] text-gray-500">
                  CHOKO 브랜드 상단 헤드라인 및 친환경 3대 철학 카드 문구를 관리합니다.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">상단 인디케이터 배지</label>
                <input
                  type="text"
                  value={contentData.choko.pillBadge}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      choko: { ...prev.choko, pillBadge: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">메인 헤드라인</label>
                <input
                  type="text"
                  value={contentData.choko.headline}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      choko: { ...prev.choko, headline: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">상세 설명문</label>
                <textarea
                  rows={3}
                  value={contentData.choko.description}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      choko: { ...prev.choko, description: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">카탈로그 버튼 문구</label>
                <input
                  type="text"
                  value={contentData.choko.ctaText}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      choko: { ...prev.choko, ctaText: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none"
                />
              </div>

              {/* 3 Pillars */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <span className="text-xs font-bold text-gray-900 block">3대 친환경 철학 카드</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                    <span className="text-[11px] font-bold text-amber-900">철학 1</span>
                    <input
                      type="text"
                      value={contentData.choko.pillar1Title}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          choko: { ...prev.choko, pillar1Title: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none"
                    />
                    <textarea
                      rows={3}
                      value={contentData.choko.pillar1Desc}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          choko: { ...prev.choko, pillar1Desc: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-900">철학 2</span>
                    <input
                      type="text"
                      value={contentData.choko.pillar2Title}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          choko: { ...prev.choko, pillar2Title: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none"
                    />
                    <textarea
                      rows={3}
                      value={contentData.choko.pillar2Desc}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          choko: { ...prev.choko, pillar2Desc: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                    <span className="text-[11px] font-bold text-amber-900">철학 3</span>
                    <input
                      type="text"
                      value={contentData.choko.pillar3Title}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          choko: { ...prev.choko, pillar3Title: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none"
                    />
                    <textarea
                      rows={3}
                      value={contentData.choko.pillar3Desc}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          choko: { ...prev.choko, pillar3Desc: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: ABOUT PAGE                                              */}
        {/* ============================================================== */}
        {activeTab === "about" && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200/90 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center font-bold">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-gray-900">
                  회사소개 페이지 (/about) 문구 관리
                </h3>
                <p className="text-[11px] text-gray-500">
                  기업 철학, 3대 핵심 가치 및 하단 상담 유도 버튼 문구를 관리합니다.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">상단 인디케이터 배지</label>
                <input
                  type="text"
                  value={contentData.about.pillBadge}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      about: { ...prev.about, pillBadge: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">메인 헤드라인</label>
                <input
                  type="text"
                  value={contentData.about.headline}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      about: { ...prev.about, headline: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">상세 서브 슬로건</label>
                <textarea
                  rows={3}
                  value={contentData.about.subtitle}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      about: { ...prev.about, subtitle: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">핵심 가치 섹션 제목</label>
                  <input
                    type="text"
                    value={contentData.about.valuesTitle}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        about: { ...prev.about, valuesTitle: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">하단 상담 유도 CTA 버튼 문구</label>
                  <input
                    type="text"
                    value={contentData.about.ctaText}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        about: { ...prev.about, ctaText: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* 3 Core Values */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <span className="text-xs font-bold text-gray-900 block">3대 핵심 가치 카드</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                    <span className="text-[11px] font-bold text-gray-700">가치 01</span>
                    <input
                      type="text"
                      value={contentData.about.value1Title}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          about: { ...prev.about, value1Title: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none"
                    />
                    <textarea
                      rows={3}
                      value={contentData.about.value1Desc}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          about: { ...prev.about, value1Desc: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                    <span className="text-[11px] font-bold text-gray-700">가치 02</span>
                    <input
                      type="text"
                      value={contentData.about.value2Title}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          about: { ...prev.about, value2Title: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none"
                    />
                    <textarea
                      rows={3}
                      value={contentData.about.value2Desc}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          about: { ...prev.about, value2Desc: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                    <span className="text-[11px] font-bold text-gray-700">가치 03</span>
                    <input
                      type="text"
                      value={contentData.about.value3Title}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          about: { ...prev.about, value3Title: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none"
                    />
                    <textarea
                      rows={3}
                      value={contentData.about.value3Desc}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          about: { ...prev.about, value3Desc: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: CONTACT PAGE                                            */}
        {/* ============================================================== */}
        {activeTab === "contact" && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200/90 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-gray-900">
                  고객센터 페이지 (/contact) 문구 관리
                </h3>
                <p className="text-[11px] text-gray-500">
                  문의 접수 페이지 상단 타이틀, 설명 및 양식 제목 문구를 관리합니다. (전화번호/주소는 기업 정보 설정 연동)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">상단 인디케이터 배지</label>
                <input
                  type="text"
                  value={contentData.contact.pillBadge}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, pillBadge: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">페이지 메인 제목</label>
                <input
                  type="text"
                  value={contentData.contact.title}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, title: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">안내 상세 설명문</label>
                <textarea
                  rows={3}
                  value={contentData.contact.description}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, description: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">상담 정보 카드 헤더 제목</label>
                  <input
                    type="text"
                    value={contentData.contact.cardTitle}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, cardTitle: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">온라인 문의 접수 양식 제목</label>
                  <input
                    type="text"
                    value={contentData.contact.formTitle}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, formTitle: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">양식 하단 안내 설명문</label>
                <input
                  type="text"
                  value={contentData.contact.formSubtitle}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, formSubtitle: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

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
