"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Search,
  Check,
  Trash2,
  Copy,
  ExternalLink,
  ImageIcon,
  Loader2,
  FolderOpen,
  Plus,
  RefreshCw,
} from "lucide-react";
import { MediaItem } from "@/components/admin/MediaLibraryModal";

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.media) {
        setItems(data.media);
      }
    } catch (err) {
      console.error("Failed to load media:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      let successCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          successCount++;
        }
      }

      setActionMessage({
        type: "success",
        text: `${successCount}개의 이미지가 성공적으로 업로드되었습니다.`,
      });
      await fetchMedia();
    } catch (err: any) {
      setActionMessage({
        type: "error",
        text: err.message || "업로드 중 오류가 발생했습니다.",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 이미지를 영구적으로 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        setActionMessage({ type: "success", text: "이미지가 삭제되었습니다." });
      } else {
        const data = await res.json();
        alert(data.error || "삭제 실패");
      }
    } catch (err) {
      console.error("Delete media error:", err);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setActionMessage({ type: "success", text: `이미지 URL이 클립보드에 복사되었습니다: ${url}` });
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === "all" ||
      (selectedCategory === "uploaded" && item.url.startsWith("/uploads/")) ||
      item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            미디어 라이브러리 (이미지 보관함)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
            웹 사이트에서 사용하는 모든 제품 사진, 시공 사진, 로고 및 CCTV 이미지를 직접 업로드하고 관리합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMedia}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>새로고침</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2.5 rounded-xl bg-[#173F30] text-white text-xs font-bold hover:bg-[#173F30]/90 transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>새 이미지 업로드</span>
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
            actionMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all bg-white ${
          dragActive
            ? "border-[#173F30] bg-[#173F30]/5 scale-[0.99]"
            : "border-gray-200 hover:border-gray-300 shadow-xs"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />

        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#173F30]/10 text-[#173F30] flex items-center justify-center mb-3">
            {uploading ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <Upload className="w-7 h-7" />
            )}
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">
            {uploading ? "이미지를 업로드하고 있습니다..." : "이미지 드래그 & 드롭 또는 파일 선택"}
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            JPG, PNG, WebP, GIF, SVG 파일을 지원합니다 (파일당 최대 10MB, 다중 선택 가능)
          </p>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-xl bg-[#173F30] text-white font-bold text-xs hover:bg-[#173F30]/90 transition-all cursor-pointer shadow-sm"
          >
            내 컴퓨터에서 사진 선택하기
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "all", label: "전체 미디어" },
            { id: "uploaded", label: "업로드된 파일" },
            { id: "product", label: "CHOKO 제품" },
            { id: "project", label: "시공 사례" },
            { id: "cctv", label: "AI CCTV" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === tab.id
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="파일명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
          />
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#173F30]" />
          <span className="text-xs font-semibold">이미지 목록을 불러오는 중...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-200 text-center flex flex-col items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
          <h4 className="text-sm font-bold text-gray-800 mb-1">검색된 미디어가 없습니다</h4>
          <p className="text-xs text-gray-400 max-w-sm">
            상단 업로드 영역에 사진을 드래그하거나 파일 선택을 눌러 새 사진을 등록하세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#173F30]/40 hover:shadow-lg transition-all flex flex-col"
            >
              {/* Image Preview Box */}
              <div className="relative aspect-4/3 w-full bg-gray-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.originalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Hover Action Bar */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.url, item.id)}
                    className="p-2 rounded-xl bg-white/90 text-gray-900 hover:bg-white text-xs font-bold flex items-center gap-1 shadow-sm"
                    title="URL 복사"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[10px]">URL 복사</span>
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/90 text-gray-900 hover:bg-white text-xs shadow-sm"
                    title="새 창에서 원본 보기"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs shadow-sm"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="p-3 flex-1 flex flex-col justify-between text-left">
                <div className="text-xs font-bold text-gray-900 truncate mb-1" title={item.originalName}>
                  {item.originalName}
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span className="truncate max-w-[100px]">{item.url.startsWith("/uploads/") ? "직접 업로드" : "기본 이미지"}</span>
                  {item.size > 0 && <span>{(item.size / 1024).toFixed(0)} KB</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
