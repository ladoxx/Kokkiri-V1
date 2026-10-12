"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FolderOpen,
  X,
  ExternalLink,
  ImageIcon,
  Loader2,
  Check,
} from "lucide-react";
import { MediaLibraryModal } from "./MediaLibraryModal";

interface ImageUploadPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  helpText?: string;
  category?: "product" | "project" | "cctv" | "general";
  required?: boolean;
}

export function ImageUploadPicker({
  value,
  onChange,
  label = "대표 이미지",
  placeholder = "이미지를 업로드하거나 보관함에서 선택하세요",
  helpText,
  category = "general",
  required = false,
}: ImageUploadPickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImgError(false);
  }, [value]);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    try {
      setIsUploading(true);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "업로드 실패");

      if (data.url) {
        onChange(data.url);
      }
    } catch (err: any) {
      alert(err.message || "이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and Actions */}
      <div className="flex items-center justify-between">
        <label className="block font-bold text-gray-700 text-xs flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#173F30]" />
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </label>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-gray-400 hover:text-gray-700 underline cursor-pointer"
        >
          {showUrlInput ? "URL 입력창 숨기기" : "URL 직접 입력"}
        </button>
      </div>

      {/* Main Upload / Preview Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFileChange(e.dataTransfer.files);
        }}
        className={`relative rounded-2xl border-2 transition-all p-3.5 bg-gray-50/60 flex flex-col sm:flex-row items-center gap-4 ${
          isDragOver
            ? "border-[#173F30] bg-[#173F30]/5 scale-[0.99]"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />

        {/* Thumbnail Preview Area */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-200 border border-gray-300 overflow-hidden shrink-0 flex items-center justify-center group shadow-xs">
          {value && !imgError ? (
            <>
              <img
                src={value}
                alt="미리보기"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-white/80 text-gray-800 hover:bg-white"
                  title="새 창에서 원본 보기"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700"
                  title="이미지 제거"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : value && imgError ? (
            <div className="flex flex-col items-center justify-center text-amber-600 p-2 text-center">
              <ImageIcon className="w-6 h-6 mb-1 text-amber-500" />
              <span className="text-[10px] font-bold">이미지 로드 대기</span>
              <button
                type="button"
                onClick={() => setImgError(false)}
                className="text-[9px] underline mt-0.5 text-gray-500 hover:text-gray-800"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 p-2 text-center">
              <ImageIcon className="w-6 h-6 mb-1 text-gray-300" />
              <span className="text-[10px] text-gray-400">사진 없음</span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-xs">
              <Loader2 className="w-5 h-5 animate-spin mb-1 text-emerald-400" />
              <span className="text-[10px] font-bold">업로드 중...</span>
            </div>
          )}
        </div>

        {/* Actions & Buttons */}
        <div className="flex-1 w-full flex flex-col justify-center space-y-2 text-center sm:text-left">
          <div className="text-xs font-bold text-gray-800 truncate" title={value || placeholder}>
            {value ? (
              <span className="text-emerald-700 font-mono text-[11px] flex items-center gap-1 justify-center sm:justify-start">
                <Check className="w-3.5 h-3.5" />
                <span>{value.length > 45 ? "..." + value.slice(-42) : value}</span>
              </span>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>

          <p className="text-[11px] text-gray-400 leading-tight">
            컴퓨터·스마트폰에서 사진을 직접 선택하거나, 보관함에서 기존 사진을 고르세요.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            {/* Direct Upload Button */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#173F30] text-white text-xs font-bold hover:bg-[#173F30]/90 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>{value ? "다른 사진으로 교체" : "사진 직접 업로드"}</span>
            </button>

            {/* Media Library Picker Button */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer shadow-xs"
            >
              <FolderOpen className="w-3.5 h-3.5 text-gray-500" />
              <span>보관함에서 선택</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>제거</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Optional Direct URL Input Field */}
      {showUrlInput && (
        <div className="animate-in fade-in duration-150">
          <input
            type="text"
            placeholder="https://... 또는 /uploads/..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-mono text-[11px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
          />
        </div>
      )}

      {helpText && <p className="text-[11px] text-gray-400 mt-1">{helpText}</p>}

      {/* Modal instance */}
      <MediaLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(url) => onChange(url)}
        currentValue={value}
        title={`${label} 선택`}
      />
    </div>
  );
}
