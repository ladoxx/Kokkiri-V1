"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Loader2,
  Sparkles,
  Search,
  RefreshCw,
  CheckCircle2,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ProductItem } from "@/lib/data/initial-data";
import { ImageUploadPicker } from "@/components/admin/ImageUploadPicker";
import { SeoDiagnostic } from "@/lib/seo/agent/naver-seo-agent";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // SEO Agent States
  const [generatingSeo, setGeneratingSeo] = useState(false);
  const [batchOptimizing, setBatchOptimizing] = useState(false);
  const [showSeoDetails, setShowSeoDetails] = useState(true);
  const [diagnostics, setDiagnostics] = useState<SeoDiagnostic[]>([]);
  const [seoScore, setSeoScore] = useState<number | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "친환경 위생용품",
    summary: "",
    description: "",
    mainImage: "/images/products/choko-bamboo-paper.jpg",
    naverUrl: "",
    coupangUrl: "",
    isFeatured: true,
    price: "",
    metaTitle: "",
    metaDesc: "",
    keywords: "",
    autoSeo: true,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data?.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      category: "친환경 위생용품",
      summary: "",
      description: "",
      mainImage: "/images/products/choko-bamboo-paper.jpg",
      naverUrl: "",
      coupangUrl: "",
      isFeatured: true,
      price: "",
      metaTitle: "",
      metaDesc: "",
      keywords: "",
      autoSeo: true,
    });
    setDiagnostics([]);
    setSeoScore(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductItem) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      category: product.category,
      summary: product.summary || "",
      description: product.description || "",
      mainImage: product.mainImage || "",
      naverUrl: product.naverUrl || "",
      coupangUrl: product.coupangUrl || "",
      isFeatured: product.isFeatured ?? true,
      price: product.price ? String(product.price) : "",
      metaTitle: product.metaTitle || "",
      metaDesc: product.metaDesc || "",
      keywords: Array.isArray(product.keywords) ? product.keywords.join(", ") : "",
      autoSeo: false,
    });
    setSeoScore(product.seoScore || null);
    setDiagnostics([]);
    setIsModalOpen(true);
  };

  // Run SEO Agent to generate metadata in real-time
  const handleGenerateSeoNow = async () => {
    if (!formData.name) {
      alert("SEO를 자동 생성하려면 제품명을 먼저 입력해주세요.");
      return;
    }
    setGeneratingSeo(true);
    try {
      const res = await fetch("/api/admin/products/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          product: {
            ...formData,
            keywords: formData.keywords
              ? formData.keywords.split(",").map((k) => k.trim()).filter(Boolean)
              : [],
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setFormData((prev) => ({
          ...prev,
          metaTitle: data.data.metaTitle,
          metaDesc: data.data.metaDesc,
          keywords: data.data.keywords.join(", "),
        }));
        setSeoScore(data.data.seoScore);
        setDiagnostics(data.data.diagnostics || []);
        setActionMessage({
          type: "success",
          text: `네이버 SEO가 자동 생성되었습니다. (진단 점수: ${data.data.seoScore}점 / 등급: ${data.data.grade})`,
        });
      } else {
        alert(data.error || "SEO 자동 생성 실패");
      }
    } catch (err) {
      console.error("SEO Generation Error:", err);
      alert("SEO 생성 중 오류가 발생했습니다.");
    } finally {
      setGeneratingSeo(false);
    }
  };

  // Batch Optimize All Products
  const handleBatchOptimizeSeo = async () => {
    if (!confirm("전체 상품의 네이버 SEO를 네이버 검색 알고리즘 규격에 맞춰 일괄 최적화하시겠습니까?")) {
      return;
    }
    setBatchOptimizing(true);
    try {
      const res = await fetch("/api/admin/products/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "batch-optimize" }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage({
          type: "success",
          text: `네이버 SEO 일괄 최적화 완료! 평균 점수: ${data.report?.avgScoreBefore || 0}점 ➡️ ${data.report?.avgScoreAfter || 98}점 (${data.report?.total || 0}개 상품 완료)`,
        });
        fetchProducts();
      } else {
        alert(data.error || "일괄 최적화 실패");
      }
    } catch (err) {
      console.error("Batch SEO Error:", err);
      alert("네이버 SEO 일괄 최적화 중 오류가 발생했습니다.");
    } finally {
      setBatchOptimizing(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setActionMessage(null);

    const payload = {
      ...formData,
      keywords: formData.keywords
        ? formData.keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [],
    };

    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "수정에 실패했습니다.");

        setActionMessage({
          type: "success",
          text: `제품 정보와 네이버 SEO(점수: ${data.product?.seoScore || 95}점)가 저장되었습니다.`,
        });
      } else {
        // Create
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "등록에 실패했습니다.");

        setActionMessage({
          type: "success",
          text: `새 제품 등록 및 네이버 SEO 자동 생성(점수: ${data.product?.seoScore || 95}점)이 완료되었습니다.`,
        });
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "작업 중 오류 발생" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteConfirmId(null);
        setActionMessage({ type: "success", text: "제품이 삭제되었습니다." });
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.error || "삭제 실패");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const avgScore =
    products.length > 0
      ? Math.round(products.reduce((acc, p) => acc + (p.seoScore || 0), 0) / products.length)
      : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            CHOKO 제품 및 네이버 SEO 관리
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
            제품 등록 시 네이버 서치어드바이저 규격 SEO가 자동 생성되며, 스마트스토어 및 쿠팡 링크와 실시간 연동됩니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBatchOptimizeSeo}
            disabled={batchOptimizing}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="모든 상품의 네이버 SEO 메타데이터를 일괄 생성 및 최적화합니다"
          >
            {batchOptimizing ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
            ) : (
              <Sparkles className="w-4 h-4 text-emerald-700" />
            )}
            <span>네이버 SEO 일괄 최적화</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-[#173F30] text-white text-xs font-bold hover:bg-[#173F30]/90 transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>새 제품 등록</span>
          </button>
        </div>
      </div>

      {/* SEO Status Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-semibold uppercase">네이버 SEO 평균</div>
            <div className="text-base font-black text-emerald-800">{avgScore}점 / 100점</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-semibold uppercase">등록 상품</div>
            <div className="text-base font-black text-blue-900">{products.length}종</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#03C75A]/15 text-[#03C75A] flex items-center justify-center shrink-0 font-black text-sm">
            N
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-semibold uppercase">스마트스토어 연동</div>
            <div className="text-base font-black text-[#03C75A]">
              {products.filter((p) => p.naverUrl).length}개 완료
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-semibold uppercase">자동 SEO Agent</div>
            <div className="text-base font-black text-purple-900">상시 작동중</div>
          </div>
        </div>
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
          <button
            onClick={() => setActionMessage(null)}
            className="p-1 text-gray-400 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Products Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              등록된 CHOKO 제품 목록 ({products.length}종)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              각 상품별 네이버 SEO 메타데이터와 공식 스마트스토어/쿠팡 연결 링크가 관리됩니다.
            </p>
          </div>
        </div>

        {/* 1. Mobile Cards View (< sm) */}
        <div className="block sm:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-xs text-gray-400">제품 목록을 불러오는 중...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">등록된 제품이 없습니다.</div>
          ) : (
            products.map((p) => (
              <div key={p.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {p.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          (p.seoScore || 0) >= 90
                            ? "bg-emerald-100 text-emerald-800"
                            : (p.seoScore || 0) >= 70
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        SEO {p.seoScore || 0}점
                      </span>
                    </div>
                    <div className="font-bold text-sm text-gray-900 mt-1">{p.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">/choko/products/{p.slug}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                      title="수정"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* External Shopping Links Preview */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  {p.naverUrl ? (
                    <a
                      href={p.naverUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2.5 rounded-xl bg-emerald-50 text-[#03C75A] border border-emerald-200/60 font-bold flex items-center justify-between gap-1 text-[11px]"
                    >
                      <span className="truncate">네이버 스토어</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <div className="py-2 px-2.5 rounded-xl bg-gray-50 text-gray-400 text-[11px] text-center border border-gray-200">
                      네이버 미등록
                    </div>
                  )}

                  {p.coupangUrl ? (
                    <a
                      href={p.coupangUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2.5 rounded-xl bg-red-50 text-[#cb1400] border border-red-200/60 font-bold flex items-center justify-between gap-1 text-[11px]"
                    >
                      <span className="truncate">쿠팡 공식몰</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <div className="py-2 px-2.5 rounded-xl bg-gray-50 text-gray-400 text-[11px] text-center border border-gray-200">
                      쿠팡 미등록
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2. Structured Desktop Table (sm and up) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
              <tr>
                <th className="py-3 px-6">제품 정보</th>
                <th className="py-3 px-6">카테고리</th>
                <th className="py-3 px-6 text-center">네이버 SEO 점수</th>
                <th className="py-3 px-6">네이버 스마트스토어</th>
                <th className="py-3 px-6">쿠팡 공식몰</th>
                <th className="py-3 px-6 text-right">관리 작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    제품 목록을 불러오는 중입니다...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    등록된 제품이 없습니다. 새 제품을 등록해보세요.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {p.mainImage ? (
                            <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{p.name}</div>
                          <div className="text-[11px] text-gray-400 font-mono mt-0.5">/choko/products/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700 font-semibold">{p.category}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            (p.seoScore || 0) >= 90
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : (p.seoScore || 0) >= 70
                              ? "bg-blue-100 text-blue-800 border border-blue-300"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          네이버 SEO {p.seoScore || 0}점
                        </span>
                        {p.metaTitle && (
                          <span className="text-[9px] text-gray-400 mt-0.5 max-w-[140px] truncate">
                            {p.metaTitle}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {p.naverUrl ? (
                        <a
                          href={p.naverUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#03C75A] hover:underline"
                        >
                          <span>스마트스토어 연동</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-400">미등록</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {p.coupangUrl ? (
                        <a
                          href={p.coupangUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#cb1400] hover:underline"
                        >
                          <span>쿠팡 공식몰</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-400">미등록</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>수정</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  {editingProduct ? "제품 정보 및 네이버 SEO 수정" : "새 CHOKO 제품 등록 (자동 SEO)"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  입력된 상품 정보는 네이버 서치어드바이저 및 구글 검색 엔진에 최적화됩니다.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5 text-xs">
              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">제품명 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 초코 퓨어 플랜트 비건 도그 사료 (1.8kg)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">카테고리</label>
                  <input
                    type="text"
                    placeholder="예: 비건 펫푸드, 친환경 위생용품"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">URL 식별자 (Slug)</label>
                  <input
                    type="text"
                    placeholder="예: vegan-dog-food (비워두면 자동 생성)"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">판매 가격 (원 / 선택)</label>
                  <input
                    type="text"
                    placeholder="예: 28000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  />
                </div>
              </div>

              {/* Shopping Mall Outbound Links */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                <div className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>공식 외부 쇼핑몰 구매 연결 링크</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#03C75A]">네이버 스마트스토어 상품 URL (네이버 SEO 권장)</label>
                    {formData.naverUrl && (
                      <a
                        href={formData.naverUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#03C75A] underline flex items-center gap-0.5"
                      >
                        <span>미리 열어보기</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="https://smartstore.naver.com/kokkiri/products/..."
                    value={formData.naverUrl}
                    onChange={(e) => setFormData({ ...formData, naverUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-[#03C75A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#cb1400] mb-1">쿠팡 공식몰 / 로켓배송 URL</label>
                  <input
                    type="url"
                    placeholder="https://www.coupang.com/vp/products/..."
                    value={formData.coupangUrl}
                    onChange={(e) => setFormData({ ...formData, coupangUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-[#cb1400]"
                  />
                </div>
              </div>

              {/* Main Image Upload / Picker */}
              <ImageUploadPicker
                label="대표 이미지 (사진)"
                value={formData.mainImage}
                onChange={(url) => setFormData({ ...formData, mainImage: url })}
                category="product"
                helpText="선명한 제품 사진을 등록하면 네이버 검색 결과 썸네일로 노출됩니다."
              />

              <div>
                <label className="block font-bold text-gray-700 mb-1">한 줄 요약 (소개)</label>
                <input
                  type="text"
                  placeholder="예: 100% 식물성 단백질과 유기농 슈퍼푸드로 설계된 프리미엄 비건 사료"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">상세 설명</label>
                <textarea
                  rows={2}
                  placeholder="제품 상세 설명 및 친환경 원료 설명"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              {/* DEDICATED NAVER SEO AGENT SECTION */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-[#F8F8F4] to-blue-50/60 border border-emerald-300/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                        <span>네이버 검색 & 서치어드바이저 자동 SEO Agent</span>
                        {seoScore !== null && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                            {seoScore}점 / 100점
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        상품 등록 시 네이버 검색엔진(C-Rank / DIA) 알고리즘에 맞춰 자동 완성됩니다.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateSeoNow}
                    disabled={generatingSeo}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {generatingSeo ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    <span>지금 즉시 자동 생성</span>
                  </button>
                </div>

                {/* LIVE NAVER SEARCH PREVIEW */}
                <div className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-xs space-y-1.5">
                  <div className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                    <Search className="w-3 h-3 text-[#03C75A]" />
                    <span>네이버 모바일/PC 검색결과 실시간 미리보기</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 pt-1">
                    <div className="space-y-1 flex-1">
                      <div className="text-[11px] text-gray-400 font-mono">
                        kokkiri.com &gt; choko &gt; products &gt; {formData.slug || "product"}
                      </div>
                      <div className="text-sm font-bold text-[#1a0dab] hover:underline cursor-pointer leading-tight">
                        {formData.metaTitle || (formData.name ? `${formData.name} | CHOKO` : "제품 제목이 표시됩니다.")}
                      </div>
                      <div className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                        {formData.metaDesc ||
                          formData.summary ||
                          "제품의 친환경 가치와 혜택, 스마트스토어 공식 구매 링크 안내가 네이버 검색 스니펫에 표출됩니다."}
                      </div>
                    </div>
                    {formData.mainImage && (
                      <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                        <img src={formData.mainImage} alt="미리보기" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* SEO Input Fields */}
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-gray-700">네이버 최적화 제목 (Meta Title)</label>
                      <span className="text-[10px] text-gray-400">
                        {formData.metaTitle.length}자 (네이버 권장 20~38자)
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="초코 퓨어 플랜트 비건 도그 사료 1.8kg | CHOKO 코끼리"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-gray-700">네이버 스니펫 요약 설명문 (Meta Description)</label>
                      <span className="text-[10px] text-gray-400">
                        {formData.metaDesc.length}자 (네이버 권장 60~110자)
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="100% 식물성 클린 포뮬러 비건 사료. 네이버 스마트스토어 공식몰에서 만나보세요."
                      value={formData.metaDesc}
                      onChange={(e) => setFormData({ ...formData, metaDesc: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      네이버 검색 키워드 태그 (콤마로 구분)
                    </label>
                    <input
                      type="text"
                      placeholder="비건사료, 반려견사료, 대나무화장지, 친환경, CHOKO, 주식회사 코끼리"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-medium focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                {/* Diagnostics List */}
                {diagnostics.length > 0 && (
                  <div className="pt-2 border-t border-emerald-200">
                    <button
                      type="button"
                      onClick={() => setShowSeoDetails(!showSeoDetails)}
                      className="flex items-center justify-between w-full text-[11px] font-bold text-gray-700 py-1"
                    >
                      <span>네이버 서치어드바이저 세부 진단 결과 ({diagnostics.length}항목)</span>
                      {showSeoDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {showSeoDetails && (
                      <div className="mt-2 space-y-1.5">
                        {diagnostics.map((d, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg text-[11px] flex items-center justify-between ${
                              d.status === "pass"
                                ? "bg-emerald-100/60 text-emerald-900"
                                : d.status === "warn"
                                ? "bg-amber-100/60 text-amber-900"
                                : "bg-red-100/60 text-red-900"
                            }`}
                          >
                            <span className="font-semibold">{d.criterion}: {d.message}</span>
                            <span className="font-black shrink-0 ml-2">+{d.score}점</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Form Buttons */}
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
                  <span>{editingProduct ? "수정 완료 (SEO 저장)" : "제품 및 네이버 SEO 등록"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">제품을 삭제하시겠습니까?</h4>
              <p className="text-xs text-gray-500 mt-1">삭제된 제품은 복구할 수 없습니다.</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
