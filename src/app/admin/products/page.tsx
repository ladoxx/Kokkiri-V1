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
  Image as ImageIcon,
  Link as LinkIcon,
  ChevronRight,
} from "lucide-react";
import { ProductItem } from "@/lib/data/initial-data";
import { ImageUploadPicker } from "@/components/admin/ImageUploadPicker";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
    });
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
      isFeatured: product.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setActionMessage(null);

    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "수정에 실패했습니다.");

        setActionMessage({ type: "success", text: "제품 정보가 성공적으로 수정되었습니다." });
      } else {
        // Create
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "등록에 실패했습니다.");

        setActionMessage({ type: "success", text: "새 제품이 성공적으로 등록되었습니다." });
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

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            CHOKO 제품 및 구매 링크 관리
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
            제품 사진, 상세 설명, 네이버 스마트스토어 및 쿠팡 공식몰 링크를 실시간으로 등록·수정·삭제합니다.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#173F30] text-white text-xs font-bold hover:bg-[#173F30]/90 transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>새 제품 등록</span>
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
              자체 결제 없이 공식 네이버 및 쿠팡 스토어로 안전하게 연결됩니다.
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
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {p.category}
                    </span>
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

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-gray-400 truncate max-w-[200px]">
                    이미지: {p.mainImage ? p.mainImage.split("/").pop() : "기본 이미지"}
                  </span>
                  <a
                    href={`/choko/products/${p.slug}`}
                    target="_blank"
                    className="text-xs font-bold text-[#173F30] flex items-center gap-0.5"
                  >
                    <span>사이트 보기</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2. Structured Desktop Table (sm and up) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
              <tr>
                <th className="py-3 px-6">제품 정보</th>
                <th className="py-3 px-6">카테고리</th>
                <th className="py-3 px-6">네이버 스마트스토어 링크</th>
                <th className="py-3 px-6">쿠팡 공식몰/파트너스 링크</th>
                <th className="py-3 px-6 text-center">공개 상태</th>
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
                    <td className="py-4 px-6">
                      {p.naverUrl ? (
                        <a
                          href={p.naverUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#03C75A] hover:underline"
                        >
                          <span>네이버 스토어</span>
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
                    <td className="py-4 px-6 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        공개중
                      </span>
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
            className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900">
                {editingProduct ? "제품 및 구매 링크 수정" : "새 CHOKO 제품 등록"}
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
                  <label className="block font-bold text-gray-700 mb-1">제품명 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 초코 비건 도그 사료 (1.8kg)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">카테고리</label>
                  <input
                    type="text"
                    placeholder="예: 친환경 위생용품, 비건 펫푸드"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">URL 식별자 (Slug)</label>
                <input
                  type="text"
                  placeholder="예: vegan-dog-food (비워두면 제품명으로 자동 생성)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              {/* CRITICAL: External Links (Naver & Coupang) */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                <div className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>공식 외부 쇼핑몰 구매 연결 링크 (핵심 설정)</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#03C75A]">네이버 스마트스토어 상품 URL</label>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#cb1400]">쿠팡 공식몰 / 로켓배송 URL</label>
                    {formData.coupangUrl && (
                      <a
                        href={formData.coupangUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#cb1400] underline flex items-center gap-0.5"
                      >
                        <span>미리 열어보기</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
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
                helpText="컴퓨터·스마트폰에서 사진을 직접 업로드하거나 보관함에서 선택하세요."
              />

              <div>
                <label className="block font-bold text-gray-700 mb-1">요약 문구 (한 줄 소개)</label>
                <input
                  type="text"
                  placeholder="예: 나무를 베지 않는 100% 대나무 펄프로 만든 무형광 3겹 화장지"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">상세 설명</label>
                <textarea
                  rows={3}
                  placeholder="제품 상세 설명 및 친환경 원료 설명"
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
                  <span>{editingProduct ? "수정 완료" : "제품 등록하기"}</span>
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
              <h4 className="font-bold text-base text-gray-900">제품을 삭제하시겠습니까?</h4>
              <p className="text-xs text-gray-500 mt-1">
                삭제하시면 웹사이트 및 목록에서 즉시 제거되며, 복구할 수 없습니다.
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
