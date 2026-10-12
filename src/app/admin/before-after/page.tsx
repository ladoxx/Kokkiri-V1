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
    beforeLabel: "오염 축적 상태",
    afterLabel: "신축 수준 복원 완료",
    beforeImage: "/images/projects/project-office-tech.jpg",
    afterImage: "/images/projects/project-building-gangnam.jpg",
    metric: "표면 조도 94 GU 달성",
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
      beforeLabel: "시공 전 오염 상태",
      afterLabel: "시공 후 완벽 복원",
      beforeImage: "/images/projects/project-office-tech.jpg",
      afterImage: "/images/projects/project-building-gangnam.jpg",
      metric: "고객 만족도 99% 달성",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: BeforeAfterItem) => {
    setEditingItem(item);
    setFormData({
      brandSlug: item.brandSlug,
      title: item.title,
      category: item.category,
      client: item.client || "",
      description: item.description,
      beforeLabel: item.beforeLabel || "",
      afterLabel: item.afterLabel || "",
      beforeImage: item.beforeImage || "",
      afterImage: item.afterImage || "",
      metric: item.metric || "",
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setActionMessage(null);

    try {
      if (editingItem) {
        // Update
        const res = await fetch(`/api/admin/before-after/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "수정에 실패했습니다.");

        setActionMessage({ type: "success", text: "시공 전후 사례가 성공적으로 수정되었습니다." });
      } else {
        // Create
        const res = await fetch("/api/admin/before-after", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "등록에 실패했습니다.");

        setActionMessage({ type: "success", text: "새 시공 전후 사례가 성공적으로 등록되었습니다." });
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
                <span>현재 적용된 시공 사진 및 경로</span>
              </div>

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

              <div className="p-3 rounded-xl bg-gray-50 text-[11px] font-mono text-gray-700 space-y-1.5 border border-gray-200 overflow-x-auto">
                <div>
                  <span className="text-gray-400 text-[10px] block">// Before 경로:</span>
                  <code className="break-all text-[10px]">{selectedCase.beforeImage || "미등록"}</code>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">// After 경로:</span>
                  <code className="break-all text-[10px]">{selectedCase.afterImage || "미등록"}</code>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>권장 이미지 비율: 16:9 또는 16:10</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>동일 앵글 및 구도의 전후 촬영 권장</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>모바일 터치 및 마우스 드래그 자동 지원</span>
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
              <h3 className="text-lg font-black text-gray-900">
                {editingItem ? "시공 전후 사례 수정" : "새 시공 전후 사례 등록"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
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

              {/* CRITICAL: Before & After Image URLs */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#173F30]" />
                  <span>비교 슬라이더 이미지 경로 설정</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageUploadPicker
                    label="Before (시공 전) 사진"
                    value={formData.beforeImage}
                    onChange={(url) => setFormData({ ...formData, beforeImage: url })}
                    category="project"
                    required
                    helpText="시공 전 상태 사진을 업로드하거나 선택하세요."
                  />

                  <ImageUploadPicker
                    label="After (시공 후) 사진"
                    value={formData.afterImage}
                    onChange={(url) => setFormData({ ...formData, afterImage: url })}
                    category="project"
                    required
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
                  rows={3}
                  placeholder="작업 공정 및 투입된 전문 장비, 복원 효과 설명"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
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
