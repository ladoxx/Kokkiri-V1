"use client";

import React, { useEffect, useState } from "react";
import { BeforeAfterSlider, BeforeAfterItem } from "@/components/ui/BeforeAfterSlider";
import {
  MoveHorizontal,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  Code2,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { ImageUploadPicker } from "@/components/admin/ImageUploadPicker";

export default function AdminBeforeAfterPage() {
  const [cases, setCases] = useState<BeforeAfterItem[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BeforeAfterItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    brandSlug: "kokkiri" as "kokkiri" | "koto",
    title: "",
    category: "바닥 특수 코팅",
    client: "",
    description: "",
    displayMode: "slider" as "slider" | "single",
    singleImage: "",
    beforeLabel: "오염 축적 상태",
    afterLabel: "신축 수준 복원 완료",
    beforeImage: "/images/projects/project-office-tech.jpg",
    afterImage: "/images/projects/project-building-gangnam.jpg",
    metric: "표면 조도 94 GU 달성",
    beforeDetails: [] as string[],
    afterDetails: [] as string[],
  });

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/before-after");
      const data = await res.json();
      if (data?.items && data.items.length > 0) {
        setCases(data.items);
        if (!selectedCaseId || !data.items.find((i: BeforeAfterItem) => i.id === selectedCaseId)) {
          setSelectedCaseId(data.items[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch before-after cases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      brandSlug: "kokkiri",
      title: "",
      category: "오피스 클리닝",
      client: "신규 고객사",
      description: "",
      displayMode: "slider",
      singleImage: "",
      beforeLabel: "시공 전 오염 상태",
      afterLabel: "시공 후 완벽 복원",
      beforeImage: "/images/projects/project-office-tech.jpg",
      afterImage: "/images/projects/project-building-gangnam.jpg",
      metric: "고객 만족도 99% 달성",
      beforeDetails: [""],
      afterDetails: [""],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: BeforeAfterItem) => {
    setEditingItem(item);
    const mode = item.displayMode || (Boolean(item.singleImage) || (!item.beforeImage && Boolean(item.afterImage)) ? "single" : "slider");
    setFormData({
      brandSlug: item.brandSlug,
      title: item.title,
      category: item.category,
      client: item.client || "",
      description: item.description,
      displayMode: mode,
      singleImage: item.singleImage || (mode === "single" ? (item.afterImage || item.beforeImage || "") : ""),
      beforeLabel: item.beforeLabel || "",
      afterLabel: item.afterLabel || "",
      beforeImage: item.beforeImage || "",
      afterImage: item.afterImage || "",
      metric: item.metric || "",
      beforeDetails: Array.isArray(item.beforeDetails) && item.beforeDetails.length > 0 ? [...item.beforeDetails] : [""],
      afterDetails: Array.isArray(item.afterDetails) && item.afterDetails.length > 0 ? [...item.afterDetails] : [""],
    });
    setIsModalOpen(true);
  };

  // Detail bullet points handlers
  const handleAddBeforeDetail = (val = "") => {
    setFormData((prev) => ({
      ...prev,
      beforeDetails: [...prev.beforeDetails, val],
    }));
  };

  const handleUpdateBeforeDetail = (index: number, val: string) => {
    setFormData((prev) => {
      const next = [...prev.beforeDetails];
      next[index] = val;
      return { ...prev, beforeDetails: next };
    });
  };

  const handleRemoveBeforeDetail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      beforeDetails: prev.beforeDetails.filter((_, i) => i !== index),
    }));
  };

  const handleAddAfterDetail = (val = "") => {
    setFormData((prev) => ({
      ...prev,
      afterDetails: [...prev.afterDetails, val],
    }));
  };

  const handleUpdateAfterDetail = (index: number, val: string) => {
    setFormData((prev) => {
      const next = [...prev.afterDetails];
      next[index] = val;
      return { ...prev, afterDetails: next };
    });
  };

  const handleRemoveAfterDetail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      afterDetails: prev.afterDetails.filter((_, i) => i !== index),
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setActionMessage(null);

    const payload = {
      ...formData,
      displayMode: formData.displayMode,
      singleImage: formData.displayMode === "single" ? formData.singleImage.trim() : "",
      beforeImage: formData.displayMode === "slider" ? formData.beforeImage.trim() : "",
      afterImage:
        formData.displayMode === "slider"
          ? formData.afterImage.trim()
          : (formData.singleImage.trim() || formData.afterImage.trim()),
      beforeDetails: formData.beforeDetails.map((d) => d.trim()).filter(Boolean),
      afterDetails: formData.afterDetails.map((d) => d.trim()).filter(Boolean),
    };

    try {
      if (editingItem) {
        // Update
        const res = await fetch(`/api/admin/before-after/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "수정에 실패했습니다.");

        setActionMessage({ type: "success", text: "시공 사례 정보가 성공적으로 수정되었습니다." });
      } else {
        // Create
        const res = await fetch("/api/admin/before-after", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "등록에 실패했습니다.");

        setActionMessage({ type: "success", text: "새 시공 사례가 성공적으로 등록되었습니다." });
      }

      setIsModalOpen(false);
      fetchCases();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "작업 중 오류 발생" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/before-after/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteConfirmId(null);
        setActionMessage({ type: "success", text: "사례가 성공적으로 삭제되었습니다." });
        fetchCases();
      } else {
        const data = await res.json();
        alert(data.error || "삭제 실패");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            시공 전후 (Before & After) 포트폴리오 관리
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
            KOKKIRI 클리닝 및 KOTO 시설/조경/펜스 현장의 시공 전후 사진, 성과 지표를 실시간으로 등록·수정·삭제합니다.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#173F30] text-white text-xs font-bold hover:bg-[#173F30]/90 transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>새 사례 등록</span>
        </button>
      </div>

      {/* Action Notification Message */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-semibold ${
            actionMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="p-1 text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Case Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
        {loading ? (
          <div className="col-span-full py-8 text-center text-xs text-gray-400">사례 목록을 불러오는 중...</div>
        ) : cases.length === 0 ? (
          <div className="col-span-full py-8 text-center text-xs text-gray-400">등록된 시공 사례가 없습니다.</div>
        ) : (
          cases.map((c) => {
            const isSelected = c.id === selectedCaseId;
            const isKokkiri = c.brandSlug === "kokkiri";

            return (
              <div
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                  isSelected
                    ? isKokkiri
                      ? "border-[#173F30] bg-[#173F30]/5 shadow-sm ring-2 ring-[#173F30]/20"
                      : "border-[#243A50] bg-[#243A50]/5 shadow-sm ring-2 ring-[#243A50]/20"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase mb-1">
                  <span className={isKokkiri ? "text-[#173F30]" : "text-[#243A50]"}>
                    {isKokkiri ? "KOKKIRI 클리닝" : "KOTO AI보안 & 시설"}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">{c.category}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(c);
                      }}
                      className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                      title="수정"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(c.id);
                      }}
                      className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
                      title="삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Thumbnails preview */}
                <div className="flex items-center gap-2 my-2">
                  {c.displayMode === "single" || (!c.beforeImage && (c.singleImage || c.afterImage)) ? (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-8 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 relative">
                        {c.singleImage || c.afterImage || c.beforeImage ? (
                          <img
                            src={c.singleImage || c.afterImage || c.beforeImage}
                            alt="단일 사진"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">사진</div>
                        )}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                        단일 사진
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-8 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 relative">
                        {c.beforeImage ? (
                          <img src={c.beforeImage} alt="Before" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">전</div>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">→</span>
                      <div className="w-12 h-8 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 relative">
                        {c.afterImage ? (
                          <img src={c.afterImage} alt="After" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">후</div>
                        )}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        전후 비교
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-xs font-bold text-gray-900 line-clamp-1">{c.title}</div>
                <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{c.metric}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Live Interactive Preview & Action Controls */}
      {selectedCase && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-gray-100 p-2 sm:p-4 rounded-2xl sm:rounded-3xl">
              <BeforeAfterSlider item={selectedCase} />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => openEditModal(selectedCase)}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>선택된 사례 수정하기</span>
              </button>
              <button
                onClick={() => setDeleteConfirmId(selectedCase.id)}
                className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>삭제</span>
              </button>
            </div>
          </div>

          {/* Configuration & Image Upload Guide */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                <ImageIcon className="w-4 h-4 text-[#173F30]" />
                <span>
                  {selectedCase.displayMode === "single" || (!selectedCase.beforeImage && (selectedCase.singleImage || selectedCase.afterImage))
                    ? "현재 적용된 단일 대표 사진"
                    : "현재 적용된 시공 전후 사진"}
                </span>
              </div>

              {selectedCase.displayMode === "single" || (!selectedCase.beforeImage && (selectedCase.singleImage || selectedCase.afterImage)) ? (
                <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-100 aspect-16/10 relative shadow-2xs mb-3">
                  {selectedCase.singleImage || selectedCase.afterImage || selectedCase.beforeImage ? (
                    <img
                      src={selectedCase.singleImage || selectedCase.afterImage || selectedCase.beforeImage}
                      alt="단일 사진"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">사진 없음</div>
                  )}
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-blue-600/90 text-white text-[9px] font-bold">
                    단일 대표 사진
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-100 aspect-16/10 relative shadow-2xs">
                    {selectedCase.beforeImage ? (
                      <img src={selectedCase.beforeImage} alt="Before" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Before 없음</div>
                    )}
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-red-600/90 text-white text-[9px] font-bold">Before</span>
                  </div>
                  <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-100 aspect-16/10 relative shadow-2xs">
                    {selectedCase.afterImage ? (
                      <img src={selectedCase.afterImage} alt="After" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">After 없음</div>
                    )}
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-emerald-600/90 text-white text-[9px] font-bold">After</span>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-gray-50 text-[11px] font-mono text-gray-700 space-y-1.5 border border-gray-200 overflow-x-auto">
                {selectedCase.displayMode === "single" || (!selectedCase.beforeImage && (selectedCase.singleImage || selectedCase.afterImage)) ? (
                  <div>
                    <span className="text-gray-400 text-[10px] block">// 대표 사진 경로:</span>
                    <code className="break-all text-[10px]">{selectedCase.singleImage || selectedCase.afterImage || selectedCase.beforeImage || "미등록"}</code>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="text-gray-400 text-[10px] block">// Before 경로:</span>
                      <code className="break-all text-[10px]">{selectedCase.beforeImage || "미등록"}</code>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block">// After 경로:</span>
                      <code className="break-all text-[10px]">{selectedCase.afterImage || "미등록"}</code>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>권장 이미지 비율: 16:9 또는 16:10</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Before & After 슬라이더 및 단일 사진 모드 지원</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>시공 전/후 상세 설명 항목 실시간 반영</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Case Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  {editingItem ? "시공 사례 수정" : "새 시공 사례 등록"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  비교 슬라이더(2장) 또는 단일 대표 사진(1장) 모드를 선택하고 시공 전/후 상세 항목을 작성할 수 있습니다.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Display Mode Selection */}
              <div className="p-1 rounded-2xl bg-gray-100 p-1.5 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, displayMode: "slider" })}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    formData.displayMode === "slider"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <MoveHorizontal className="w-4 h-4 text-[#173F30]" />
                  <span>Before & After 슬라이더 (2장 비교)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, displayMode: "single" })}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    formData.displayMode === "single"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-[#243A50]" />
                  <span>단일 대표 사진 (1장 등록)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">담당 브랜드 *</label>
                  <select
                    value={formData.brandSlug}
                    onChange={(e) =>
                      setFormData({ ...formData, brandSlug: e.target.value as "kokkiri" | "koto" })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30] bg-white"
                  >
                    <option value="kokkiri">KOKKIRI 클리닝</option>
                    <option value="koto">KOTO 시설·보안·조경·펜스</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">카테고리</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 바닥 특수 코팅, 준공 클리닝, 기업 조경"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">사례 제목 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 강남 프라임 타워 로비 대리석 복원 클리닝"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">고객사 또는 현장 명칭</label>
                <input
                  type="text"
                  placeholder="예: 강남 G-프라임 타워, 판교 테크 캠퍼스"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              {/* Dynamic Image Upload based on Mode */}
              {formData.displayMode === "slider" ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                      <MoveHorizontal className="w-3.5 h-3.5 text-[#173F30]" />
                      <span>Before & After 비교 슬라이더 이미지 설정</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      2장 전후 비교 모드
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImageUploadPicker
                      label="Before (시공 전) 사진 *"
                      value={formData.beforeImage}
                      onChange={(url) => setFormData({ ...formData, beforeImage: url })}
                      category="project"
                      required={formData.displayMode === "slider"}
                      helpText="시공 전 상태 사진을 업로드하거나 선택하세요."
                    />

                    <ImageUploadPicker
                      label="After (시공 후) 사진 *"
                      value={formData.afterImage}
                      onChange={(url) => setFormData({ ...formData, afterImage: url })}
                      category="project"
                      required={formData.displayMode === "slider"}
                      helpText="시공 후 복원 완료 사진을 업로드하거나 선택하세요."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block font-semibold text-gray-600 mb-1">시공 전 상태 라벨</label>
                      <input
                        type="text"
                        placeholder="예: 오염 축적 및 광택도 35% 저하"
                        value={formData.beforeLabel}
                        onChange={(e) => setFormData({ ...formData, beforeLabel: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-600 mb-1">시공 후 복원 라벨</label>
                      <input
                        type="text"
                        placeholder="예: 거울 같은 고광택도 94% 복원 완료"
                        value={formData.afterLabel}
                        onChange={(e) => setFormData({ ...formData, afterLabel: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-700" />
                      <span>단일 대표 시공 사진 설정</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                      1장 단독 사진 모드
                    </span>
                  </div>

                  <ImageUploadPicker
                    label="시공 대표 사진 *"
                    value={formData.singleImage || formData.afterImage}
                    onChange={(url) => setFormData({ ...formData, singleImage: url, afterImage: url })}
                    category="project"
                    required={formData.displayMode === "single"}
                    helpText="단일 현장 사진을 업로드하거나 선택하세요."
                  />

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">사진 배지 라벨 (선택)</label>
                    <input
                      type="text"
                      placeholder="예: 시공 완료 현장 (PHOTO), 4K AI CCTV 시공 완료"
                      value={formData.afterLabel}
                      onChange={(e) => setFormData({ ...formData, afterLabel: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">핵심 수행 성과 (Metric)</label>
                <input
                  type="text"
                  placeholder="예: 바닥 표면 조도 94 GU 복원 달성, 미세먼지 96.8% 저감"
                  value={formData.metric}
                  onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">시공 상세 설명</label>
                <textarea
                  rows={2}
                  placeholder="작업 공정 및 투입된 전문 장비, 복원 효과 설명"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              {/* Before Details Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-amber-950 text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>시공 전 상태 세부 항목 (Before Details)</span>
                      <span className="text-[11px] text-amber-800 font-normal">
                        ({formData.beforeDetails.filter((d) => d.trim()).length}개)
                      </span>
                    </h4>
                    <p className="text-[11px] text-amber-800/80 mt-0.5">
                      카드 하단 노란색 상자에 표출되는 시공 전 문제점 및 오염 상태입니다.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddBeforeDetail("")}
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-amber-300 hover:border-amber-400 text-amber-900 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-600" />
                    <span>Before 항목 추가</span>
                  </button>
                </div>

                {/* Quick Presets for Before */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-amber-700/80 font-semibold">추천 프리셋:</span>
                  {[
                    "천장 및 바닥 미세 시멘트 분진 침착",
                    "벽면 실리콘 잔여물 및 페인트 비산 얼룩",
                    "지게차 타이어 스키드 마크 및 기름때 오염",
                    "바닥 왁스층 산화 및 심각한 황변 오염",
                    "노후 아날로그 카메라로 야간 식별 불가",
                    "외곽 펜스 부식 및 지주 기초 흔들림",
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddBeforeDetail(preset)}
                      className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-900 hover:bg-amber-100 text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                {/* Before Details Inputs */}
                <div className="space-y-2 pt-1">
                  {formData.beforeDetails.length === 0 ? (
                    <div className="p-3 rounded-xl bg-white/80 border border-dashed border-amber-300 text-center text-amber-800/70 text-xs">
                      등록된 Before 항목이 없습니다. [+ Before 항목 추가] 또는 추천 프리셋을 클릭하세요.
                    </div>
                  ) : (
                    formData.beforeDetails.map((det, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[11px] shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="예: 천장 텍스 및 공조 디퓨저 내 미세 시멘트 가루 침착"
                          value={det}
                          onChange={(e) => handleUpdateBeforeDetail(idx, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs text-gray-800"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveBeforeDetail(idx)}
                          className="p-2 rounded-xl text-amber-700 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="항목 삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* After Details Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>시공 후 복원 세부 항목 (After Details)</span>
                      <span className="text-[11px] text-emerald-800 font-normal">
                        ({formData.afterDetails.filter((d) => d.trim()).length}개)
                      </span>
                    </h4>
                    <p className="text-[11px] text-emerald-800/80 mt-0.5">
                      카드 하단 초록색 상자에 표출되는 시공 후 개선 효과 및 적용 장비입니다.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddAfterDetail("")}
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-emerald-300 hover:border-emerald-400 text-emerald-900 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>After 항목 추가</span>
                  </button>
                </div>

                {/* Quick Presets for After */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-emerald-700/80 font-semibold">추천 프리셋:</span>
                  {[
                    "산업용 HEPA 13등급 진공 집진 장비 전면 투입",
                    "무독성 친환경 세정제를 통한 마감재 보호 세척",
                    "피톤치드 초미립자 광촉매 공간 살균 훈증 소독",
                    "이탈리아산 다이아몬드 연마 5단계 크리스탈 코팅",
                    "4K AI 딥러닝 기반 이상 행동 실시간 감지 관제",
                    "고내식 용융 아연도금 및 분체도장 메쉬 펜스 완공",
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddAfterDetail(preset)}
                      className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-900 hover:bg-emerald-100 text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                {/* After Details Inputs */}
                <div className="space-y-2 pt-1">
                  {formData.afterDetails.length === 0 ? (
                    <div className="p-3 rounded-xl bg-white/80 border border-dashed border-emerald-300 text-center text-emerald-800/70 text-xs">
                      등록된 After 항목이 없습니다. [+ After 항목 추가] 또는 추천 프리셋을 클릭하세요.
                    </div>
                  ) : (
                    formData.afterDetails.map((det, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px] shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="예: 산업용 HEPA 13등급 진공 집진 장비 전면 투입"
                          value={det}
                          onChange={(e) => handleUpdateAfterDetail(idx, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-gray-800"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAfterDetail(idx)}
                          className="p-2 rounded-xl text-emerald-700 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="항목 삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#173F30] text-white font-bold hover:bg-[#173F30]/90 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? "수정 완료" : "사례 등록하기"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-gray-900">시공 사례를 삭제하시겠습니까?</h4>
              <p className="text-xs text-gray-500 mt-1">
                삭제하시면 웹사이트의 시공 전후 갤러리 및 슬라이더에서 즉시 제거됩니다.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                확인 (삭제)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
