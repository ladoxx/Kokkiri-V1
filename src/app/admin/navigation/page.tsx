"use client";

import React, { useEffect, useState } from "react";
import {
  Menu,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import {
  DEFAULT_NAVIGATION,
  NavCategoryItem,
  NavSubItem,
  SiteNavigationSettings,
} from "@/lib/types/cms";

export default function AdminNavigationPage() {
  const [navData, setNavData] = useState<SiteNavigationSettings>(DEFAULT_NAVIGATION);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    about: true,
    cleaning: false,
    koto: false,
    choko: false,
  });

  const fetchNav = () => {
    setLoading(true);
    fetch("/api/admin/navigation")
      .then((res) => res.json())
      .then((data) => {
        if (data?.navigation) setNavData(data.navigation);
      })
      .catch((err) => console.error("Error fetching navigation:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNav();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedCats((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCategoryChange = (index: number, field: keyof NavCategoryItem, value: any) => {
    const updated = [...navData.categories];
    updated[index] = { ...updated[index], [field]: value };
    setNavData({ ...navData, categories: updated });
  };

  const handleSubItemChange = (
    catIndex: number,
    subIndex: number,
    field: keyof NavSubItem,
    value: any
  ) => {
    const updated = [...navData.categories];
    const subItems = [...updated[catIndex].items];
    subItems[subIndex] = { ...subItems[subIndex], [field]: value };
    updated[catIndex] = { ...updated[catIndex], items: subItems };
    setNavData({ ...navData, categories: updated });
  };

  const handleAddSubItem = (catIndex: number) => {
    const updated = [...navData.categories];
    const subItems = [...updated[catIndex].items];
    const newId = `sub-${Date.now()}`;
    subItems.push({
      id: newId,
      label: "새 하위 메뉴",
      href: "/services",
      desc: "서비스에 대한 상세 설명입니다.",
      visible: true,
    });
    updated[catIndex] = { ...updated[catIndex], items: subItems };
    setNavData({ ...navData, categories: updated });
    // Expand category if collapsed
    const catId = updated[catIndex].id;
    setExpandedCats((prev) => ({ ...prev, [catId]: true }));
  };

  const handleDeleteSubItem = (catIndex: number, subIndex: number) => {
    if (!confirm("이 하위 메뉴를 삭제하시겠습니까?")) return;
    const updated = [...navData.categories];
    const subItems = [...updated[catIndex].items];
    subItems.splice(subIndex, 1);
    updated[catIndex] = { ...updated[catIndex], items: subItems };
    setNavData({ ...navData, categories: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(navData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "저장 실패");
      setSaved(true);
      setFeedback({ type: "success", message: data.message || "메뉴 설정이 저장되었습니다." });
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "오류가 발생했습니다." });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("모든 메뉴 구성을 공장 초기 기본값으로 복원하시겠습니까? (직접 수정한 내용이 초기화됩니다)")) {
      return;
    }
    setResetting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/navigation/reset", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "초기화 실패");
      if (data?.navigation) setNavData(data.navigation);
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
        <span className="text-xs font-bold">네비게이션 메뉴 불러오는 중...</span>
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
              메뉴 & 네비게이션 관리
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-wide uppercase">
              WordPress형 CMS
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            웹사이트 상단 헤더 메뉴의 텍스트, 설명 문구, 뱃지(NEW 등), 연결 링크 및 노출 여부를 실시간으로 편집합니다.
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
            <span>{saved ? "저장 완료!" : "전체 메뉴 저장"}</span>
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

      {/* Menu Builder Form */}
      <form onSubmit={handleSave} className="space-y-4">
        {navData.categories.map((cat, catIdx) => {
          const isExpanded = expandedCats[cat.id] ?? false;
          const hasItems = Array.isArray(cat.items) && cat.items.length > 0;

          return (
            <div
              key={cat.id || catIdx}
              className={`rounded-3xl border transition-all ${
                cat.visible
                  ? "bg-white border-gray-200/90 shadow-xs"
                  : "bg-gray-50 border-gray-200 opacity-60"
              }`}
            >
              {/* Category Header Row */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-[#173F30]/10 flex items-center justify-center text-[#173F30] font-black text-xs shrink-0">
                    {catIdx + 1}
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Label Input */}
                    <div>
                      <span className="text-[10px] text-gray-400 block mb-0.5 font-bold">
                        메뉴 명칭 (표시 텍스트)
                      </span>
                      <input
                        type="text"
                        value={cat.label}
                        onChange={(e) => handleCategoryChange(catIdx, "label", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                      />
                    </div>

                    {/* Href Input */}
                    <div>
                      <span className="text-[10px] text-gray-400 block mb-0.5 font-bold">
                        연결 링크 (URL)
                      </span>
                      <input
                        type="text"
                        value={cat.href}
                        onChange={(e) => handleCategoryChange(catIdx, "href", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                      />
                    </div>

                    {/* Badge Input */}
                    <div>
                      <span className="text-[10px] text-gray-400 block mb-0.5 font-bold">
                        뱃지 라벨 (예: NEW, Cleaning 등)
                      </span>
                      <input
                        type="text"
                        value={cat.badge || ""}
                        onChange={(e) => handleCategoryChange(catIdx, "badge", e.target.value)}
                        placeholder="뱃지 없음"
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0">
                  {/* Visibility Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(catIdx, "visible", !cat.visible)}
                    title={cat.visible ? "현재 웹사이트에 노출 중 (클릭 시 숨김)" : "현재 숨김 상태 (클릭 시 노출)"}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      cat.visible
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-gray-200 text-gray-600 border border-gray-300"
                    }`}
                  >
                    {cat.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{cat.visible ? "노출 중" : "숨김"}</span>
                  </button>

                  {/* Accordion Expand for Sub-items */}
                  {hasItems && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(cat.id)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <span>하위 메뉴 ({cat.items.length})</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  {!hasItems && (
                    <button
                      type="button"
                      onClick={() => handleAddSubItem(catIdx)}
                      className="px-3 py-1.5 rounded-xl bg-[#173F30]/10 hover:bg-[#173F30]/20 text-[#173F30] text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>하위 메뉴 추가</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Nested Sub-items Drawer */}
              {isExpanded && hasItems && (
                <div className="p-4 sm:p-5 bg-gray-50/60 rounded-b-3xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold px-1">
                    <span>드롭다운 하위 메뉴 목록 (총 {cat.items.length}개)</span>
                    <button
                      type="button"
                      onClick={() => handleAddSubItem(catIdx)}
                      className="text-[#173F30] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>하위 항목 추가</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {cat.items.map((sub, subIdx) => (
                      <div
                        key={sub.id || subIdx}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          sub.visible
                            ? "bg-white border-gray-200/90 shadow-xs"
                            : "bg-gray-100 border-gray-200 opacity-60"
                        }`}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          {/* Label */}
                          <div className="sm:col-span-3">
                            <span className="text-[10px] text-gray-400 block mb-0.5 font-bold">
                              항목 제목
                            </span>
                            <input
                              type="text"
                              value={sub.label}
                              onChange={(e) => handleSubItemChange(catIdx, subIdx, "label", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#173F30]"
                            />
                          </div>

                          {/* Description */}
                          <div className="sm:col-span-4">
                            <span className="text-[10px] text-gray-400 block mb-0.5 font-bold">
                              설명 문구 (한 줄 안내)
                            </span>
                            <input
                              type="text"
                              value={sub.desc || ""}
                              onChange={(e) => handleSubItemChange(catIdx, subIdx, "desc", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#173F30]"
                            />
                          </div>

                          {/* Href */}
                          <div className="sm:col-span-3">
                            <span className="text-[10px] text-gray-400 block mb-0.5 font-bold">
                              연결 URL
                            </span>
                            <input
                              type="text"
                              value={sub.href}
                              onChange={(e) => handleSubItemChange(catIdx, subIdx, "href", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#173F30]"
                            />
                          </div>

                          {/* Actions (Toggle visibility & Delete) */}
                          <div className="sm:col-span-2 flex items-center justify-end gap-1.5 pt-1 sm:pt-4">
                            <button
                              type="button"
                              onClick={() => handleSubItemChange(catIdx, subIdx, "visible", !sub.visible)}
                              title={sub.visible ? "숨기기" : "보이기"}
                              className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                                sub.visible ? "bg-emerald-50 text-emerald-700" : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              {sub.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteSubItem(catIdx, subIdx)}
                              title="항목 삭제"
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Floating Bottom Action Bar */}
        <div className="pt-4 flex justify-end">
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
            <span>{saved ? "메뉴 저장 완료!" : "전체 메뉴 구성 저장하기"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
