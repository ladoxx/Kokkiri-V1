"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Search,
  Check,
  Trash2,
  Copy,
  ExternalLink,
  ImageIcon,
  Loader2,
  FolderOpen,
} from "lucide-react";

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  category?: string;
  createdAt: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentValue?: string;
  title?: string;
}

export function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  currentValue,
  title = "미디어 보관함 (이미지 선택)",
}: MediaLibraryModalProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
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
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "업로드 실패");

      // Reload list and auto select uploaded image
      await fetchMedia();
      if (data.url) {
        onSelect(data.url);
        onClose();
      }
    } catch (err: any) {
      alert(err.message || "이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("이 이미지를 보관함에서 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "삭제 실패");
      }
    } catch (err) {
      console.error("Delete media error:", err);
    }
  };

  const handleCopyUrl = (e: React.MouseEvent, url: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col space-y-5"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#173F30]/10 text-[#173F30] flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900">{title}</h3>
              <p className="text-xs text-gray-500">
                원하는 이미지를 클릭하여 선택하거나, 컴퓨터에서 새 사진을 바로 업로드하세요.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Drop Zone & Toolbar */}
        <div className="space-y-3">
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
            className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center transition-all ${
              dragActive
                ? "border-[#173F30] bg-[#173F30]/5 scale-[0.99]"
                : "border-gray-200 bg-gray-50/70 hover:border-gray-300"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-xs flex items-center justify-center text-[#173F30]">
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xs font-bold text-gray-800">
                  {uploading
                    ? "이미지를 업로드하고 있습니다..."
                    : "이미지 파일을 여기에 끌어다 놓거나 직접 선택하세요"}
                </div>
                <div className="text-[11px] text-gray-500">
                  JPG, PNG, WebP, GIF, SVG (최대 10MB) — 업로드 즉시 자동 선택됩니다
                </div>
              </div>
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 sm:mt-0 sm:ml-auto px-4 py-2 rounded-xl bg-[#173F30] text-white font-bold text-xs hover:bg-[#173F30]/90 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {uploading ? "업로드 중..." : "컴퓨터에서 사진 찾기"}
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { id: "all", label: "전체 이미지" },
                { id: "uploaded", label: "내 업로드 파일" },
                { id: "product", label: "CHOKO 제품" },
                { id: "project", label: "시공 사례" },
                { id: "cctv", label: "AI CCTV" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    selectedCategory === tab.id
                      ? "bg-[#173F30] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-60">
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
        </div>

        {/* Media Grid View */}
        <div className="flex-1 overflow-y-auto min-h-[260px] max-h-[420px] pr-1">
          {loading ? (
            <div className="h-60 flex flex-col items-center justify-center text-gray-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#173F30]" />
              <span className="text-xs">보관함 이미지를 불러오는 중...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="h-60 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 p-6 text-center">
              <ImageIcon className="w-10 h-10 mb-2 text-gray-300" />
              <p className="text-xs font-bold text-gray-600 mb-1">등록된 이미지가 없습니다.</p>
              <p className="text-[11px] text-gray-400">
                상단의 '컴퓨터에서 사진 찾기'를 눌러 새 이미지를 등록해보세요.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredItems.map((item) => {
                const isSelected = currentValue === item.url;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelect(item.url);
                      onClose();
                    }}
                    className={`group relative rounded-2xl border overflow-hidden cursor-pointer transition-all bg-gray-50 flex flex-col ${
                      isSelected
                        ? "border-[#173F30] ring-2 ring-[#173F30] shadow-md"
                        : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-4/3 w-full bg-gray-200 overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.originalName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Selected check badge */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#173F30] text-white flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}

                      {/* Action buttons on hover */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-1 rounded-lg backdrop-blur-xs">
                        <button
                          type="button"
                          title="URL 복사"
                          onClick={(e) => handleCopyUrl(e, item.url, item.id)}
                          className="p-1 rounded text-white hover:text-emerald-400"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          title="삭제"
                          onClick={(e) => handleDelete(e, item.id)}
                          className="p-1 rounded text-white hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-2.5 bg-white flex-1 flex flex-col justify-between">
                      <div className="text-[11px] font-bold text-gray-800 truncate mb-0.5" title={item.originalName}>
                        {item.originalName}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>{item.url.startsWith("/uploads/") ? "직접 업로드" : "기본 라이브러리"}</span>
                        {item.size > 0 && <span>{(item.size / 1024).toFixed(0)} KB</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>총 {filteredItems.length}개의 이미지</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
