"use client";

import React, { useEffect, useState } from "react";
import {
  Wrench,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Layers,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { ServiceItem } from "@/lib/data/initial-data";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<"all" | "kokkiri" | "koto">("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    brandSlug: "koto" as "kokkiri" | "koto" | "choko",
    title: "",
    subtitle: "",
    slug: "",
    summary: "",
    description: "",
    features: [""] as string[],
    processSteps: [
      { step: "01", title: "", desc: "" },
      { step: "02", title: "", desc: "" },
    ] as { step: string; title: string; desc: string }[],
    isFeatured: true,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data?.services) {
        setServices(data.services);
      }
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = (brand: "kokkiri" | "koto" = "koto") => {
    setEditingService(null);
    setFormData({
      brandSlug: brand,
      title: "",
      subtitle: "",
      slug: "",
      summary: "",
      description: "",
      features: [
        "전문 자격 인력 전담 배치 및 안전 시공",
        "사전 현장 정밀 실측 및 무료 견적 컨설팅",
        "철저한 사후 무상 점검 및 보증 제공",
      ],
      processSteps: [
        { step: "01", title: "현장 실측 및 맞춤 설계", desc: "고객 요구사항 파악 및 현장 상태 정밀 점검" },
        { step: "02", title: "전문 시공 및 공정 준수", desc: "안전 규격 준수 및 고품질 직영 시공 진행" },
        { step: "03", title: "완공 검수 및 사후 케어", desc: "검수 확인 후 지속적인 유지보수 보증 제공" },
      ],
      isFeatured: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      brandSlug: service.brandSlug,
      title: service.title,
      subtitle: service.subtitle || "",
      slug: service.slug,
      summary: service.summary || "",
      description: service.description || "",
      features: Array.isArray(service.features) && service.features.length > 0 ? service.features : [""],
      processSteps:
        Array.isArray(service.processSteps) && service.processSteps.length > 0
          ? service.processSteps
          : [{ step: "01", title: "", desc: "" }],
      isFeatured: service.isFeatured ?? true,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setActionMessage(null);

    try {
      if (editingService) {
        // Update
        const res = await fetch(`/api/admin/services/${editingService.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "수정에 실패했습니다.");

        setActionMessage({ type: "success", text: "서비스 정보가 성공적으로 수정되었습니다." });
      } else {
        // Create
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "등록에 실패했습니다.");

        setActionMessage({ type: "success", text: "새 서비스가 성공적으로 등록되었습니다." });
      }

      setIsModalOpen(false);
      fetchServices();
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "삭제에 실패했습니다.");

      setActionMessage({ type: "success", text: "서비스가 삭제되었습니다." });
      setDeleteConfirmId(null);
      fetchServices();
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message });
    }
  };

  const filteredServices = services.filter((s) => {
    if (selectedBrand === "all") return true;
    return s.brandSlug === selectedBrand;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-[#173F30]" />
            <span>서비스 & 사업 솔루션 관리</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            코끼리(클리닝) 및 KOTO(펜스, 조경, AI 보안 카메라, 경비 등)의 브랜드별 업무 서비스 항목과 상세 공정을 등록하고 수정합니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openAddModal(selectedBrand === "kokkiri" ? "kokkiri" : "koto")}
            className="px-4 py-2.5 rounded-2xl bg-[#173F30] hover:bg-[#173F30]/90 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>새 서비스 추가</span>
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 ${
            actionMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {actionMessage.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Brand Filters */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setSelectedBrand("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedBrand === "all"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          전체 ({services.length})
        </button>
        <button
          onClick={() => setSelectedBrand("koto")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedBrand === "koto"
              ? "bg-[#243A50] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>KOTO 솔루션 ({services.filter((s) => s.brandSlug === "koto").length})</span>
        </button>
        <button
          onClick={() => setSelectedBrand("kokkiri")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedBrand === "kokkiri"
              ? "bg-[#173F30] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>코끼리 클리닝 ({services.filter((s) => s.brandSlug === "kokkiri").length})</span>
        </button>
      </div>

      {/* Services List Table */}
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-6">브랜드</th>
                <th className="py-3.5 px-6">서비스 명칭 (한/영)</th>
                <th className="py-3.5 px-6">주요 요약</th>
                <th className="py-3.5 px-6">특장점 개수</th>
                <th className="py-3.5 px-6">진행 절차</th>
                <th className="py-3.5 px-6 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#173F30]" />
                    <span>서비스 목록을 불러오는 중...</span>
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    등록된 서비스가 없습니다. 상단 '새 서비스 추가' 버튼을 눌러 등록해 보세요.
                  </td>
                </tr>
              ) : (
                filteredServices.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          s.brandSlug === "koto"
                            ? "bg-[#243A50]/10 text-[#243A50]"
                            : "bg-[#173F30]/10 text-[#173F30]"
                        }`}
                      >
                        {s.brandSlug === "koto" ? "KOTO" : "KOKKIRI"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-bold text-gray-900 text-sm block">{s.title}</span>
                        {s.subtitle && <span className="text-[11px] text-gray-400 font-mono">{s.subtitle}</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <p className="line-clamp-2 text-gray-600">{s.summary || s.description || "-"}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full text-[11px]">
                        {s.features?.length || 0}개 항목
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full text-[11px]">
                        {s.processSteps?.length || 0}단계 공정
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={s.brandSlug === "koto" ? `/koto/services#${s.slug}` : `/cleaning/services#${s.slug}`}
                          target="_blank"
                          className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>보기</span>
                        </Link>
                        <button
                          onClick={() => openEditModal(s)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#173F30]/10 hover:bg-[#173F30]/20 text-[#173F30] font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>수정</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(s.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>삭제</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#173F30]" />
                <span>{editingService ? "서비스 및 사업 솔루션 수정" : "새 서비스 등록"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">소속 브랜드 *</label>
                  <select
                    value={formData.brandSlug}
                    onChange={(e) =>
                      setFormData({ ...formData, brandSlug: e.target.value as "kokkiri" | "koto" | "choko" })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  >
                    <option value="koto">KOTO (AI보안/펜스/조경/경비/시설)</option>
                    <option value="kokkiri">KOKKIRI (상업/오피스/빌딩/준공 클리닝)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">서비스 제목 (한글) *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 보안 펜스 & 외곽 차단 시공"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">영문 서브타이틀</label>
                  <input
                    type="text"
                    placeholder="예: Perimeter Fencing & Barrier Systems"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">URL 식별자 (Slug)</label>
                  <input
                    type="text"
                    placeholder="예: fence (비워둘 시 자동 생성)"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">한 줄 요약 (Summary)</label>
                <input
                  type="text"
                  placeholder="예: 사업장 침입을 방지하고 외관 품격을 높이는 고내구성 산업용·디자인 펜스 시공 솔루션입니다."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">상세 설명 (Description)</label>
                <textarea
                  rows={3}
                  placeholder="서비스의 특성, 공법, 장비 및 차별화된 관리 프로토콜을 설명합니다."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              {/* FEATURES SECTION */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-gray-900 text-xs block">주요 핵심 특장점 (Key Features)</label>
                    <p className="text-[11px] text-gray-500">서비스 상세 안내 카드 내 체크리스트로 표시됩니다.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, features: [...formData.features, ""] })}
                    className="px-2.5 py-1 rounded-lg bg-[#173F30] text-white text-[11px] font-bold hover:bg-[#173F30]/90 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>특장점 추가</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.features.map((feat, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-gray-400 w-5 text-right">{index + 1}.</span>
                      <input
                        type="text"
                        placeholder="예: 용융 아연 도금 강재 적용으로 장기간 부식 방지"
                        value={feat}
                        onChange={(e) => {
                          const updated = [...formData.features];
                          updated[index] = e.target.value;
                          setFormData({ ...formData, features: updated });
                        }}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                      />
                      <button
                        type="button"
                        disabled={formData.features.length <= 1}
                        onClick={() => {
                          const updated = formData.features.filter((_, i) => i !== index);
                          setFormData({ ...formData, features: updated });
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-gray-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PROCESS STEPS SECTION */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-gray-900 text-xs block">진행 절차 (Process Steps)</label>
                    <p className="text-[11px] text-gray-500">작업 진행 공정(Step 01, Step 02 등)을 안내합니다.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        processSteps: [
                          ...formData.processSteps,
                          { step: `0${formData.processSteps.length + 1}`, title: "", desc: "" },
                        ],
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-[#173F30] text-white text-[11px] font-bold hover:bg-[#173F30]/90 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>공정 단계 추가</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.processSteps.map((st, index) => (
                    <div key={index} className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">
                            Step
                          </span>
                          <input
                            type="text"
                            placeholder="예: 01"
                            value={st.step}
                            onChange={(e) => {
                              const updated = [...formData.processSteps];
                              updated[index] = { ...updated[index], step: e.target.value };
                              setFormData({ ...formData, processSteps: updated });
                            }}
                            className="w-16 px-2 py-0.5 rounded border border-gray-200 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-[#173F30]"
                          />
                        </div>
                        <button
                          type="button"
                          disabled={formData.processSteps.length <= 1}
                          onClick={() => {
                            const updated = formData.processSteps.filter((_, i) => i !== index);
                            setFormData({ ...formData, processSteps: updated });
                          }}
                          className="text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-gray-400 cursor-pointer text-[10px] flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>단계 삭제</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="공정 제목 (예: 정밀 실측 & 바닥 타공)"
                          value={st.title}
                          onChange={(e) => {
                            const updated = [...formData.processSteps];
                            updated[index] = { ...updated[index], title: e.target.value };
                            setFormData({ ...formData, processSteps: updated });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                        />
                        <input
                          type="text"
                          placeholder="공정 세부 설명"
                          value={st.desc}
                          onChange={(e) => {
                            const updated = [...formData.processSteps];
                            updated[index] = { ...updated[index], desc: e.target.value };
                            setFormData({ ...formData, processSteps: updated });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                        />
                      </div>
                    </div>
                  ))}
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
                  <span>{editingService ? "수정 완료" : "서비스 등록하기"}</span>
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
              <h4 className="font-bold text-base text-gray-900">서비스를 삭제하시겠습니까?</h4>
              <p className="text-xs text-gray-500 mt-1">
                삭제하시면 서비스 목록 및 안내 페이지에서 즉시 제거되며, 복구할 수 없습니다.
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
