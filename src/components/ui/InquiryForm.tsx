"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";

interface InquiryFormProps {
  defaultType?: string;
  defaultService?: string;
  title?: string;
  subtitle?: string;
}

export function InquiryForm({
  defaultType = "클리닝 견적 문의",
  defaultService = "",
  title = "견적 및 서비스 상담 문의",
  subtitle = "문의 내용을 남겨주시면 전담 전문 매니저가 확인 후 1영업일 이내에 상세 견적과 안내를 드립니다.",
}: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    inquiryType: defaultType,
    serviceCategory: defaultService,
    location: "",
    message: "",
    preferredContactMethod: "PHONE" as "PHONE" | "EMAIL" | "KAKAO",
    consentGiven: false,
  });

  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<{ inquiryId: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const inquiryTypes = [
    "클리닝 견적 문의",
    "AI 보안 카메라 & CCTV 설치 견적",
    "보안 및 시설 경비 문의",
    "기업 조경 & 펜스 시공",
    "CHOKO 제품 대량 구매/제휴",
    "채용 및 파트너십 문의",
    "기타 일반 문의",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (!formData.consentGiven) {
      setErrorMessage("개인정보 수집 및 이용에 동의해 주셔야 문의가 접수됩니다.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const errors: Record<string, string> = {};
          for (const key of Object.keys(data.details)) {
            errors[key] = Array.isArray(data.details[key]) ? data.details[key][0] : data.details[key];
          }
          setFieldErrors(errors);
        }
        throw new Error(data.error || "문의 접수 중 오류가 발생했습니다.");
      }

      setSuccessResult({
        inquiryId: data.inquiryId,
        message: data.message,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "서버 통신 실패";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  if (successResult) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#173F30]/10 text-center max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-[#e8f5e9] text-[#173F30] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-[#173F30] mb-3">문의가 성공적으로 접수되었습니다</h3>
        <p className="text-sm text-[#202622]/70 leading-relaxed mb-6">
          {successResult.message}
        </p>
        <div className="bg-[#F8F8F4] p-4 rounded-xl text-xs text-[#202622]/80 mb-8 inline-block text-left w-full">
          <div className="flex justify-between py-1 border-b border-black/5">
            <span className="font-semibold text-[#173F30]">접수 번호</span>
            <span className="font-mono">{successResult.inquiryId}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-black/5">
            <span className="font-semibold text-[#173F30]">신청자</span>
            <span>{formData.name} ({formData.phone})</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-semibold text-[#173F30]">문의 항목</span>
            <span>{formData.inquiryType}</span>
          </div>
        </div>
        <button
          onClick={() => {
            setSuccessResult(null);
            setFormData({
              name: "",
              company: "",
              email: "",
              phone: "",
              inquiryType: defaultType,
              serviceCategory: "",
              location: "",
              message: "",
              preferredContactMethod: "PHONE",
              consentGiven: false,
            });
          }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#173F30] text-[#F8F8F4] text-sm font-semibold hover:bg-[#173F30]/90 transition-colors"
        >
          <span>새로운 문의 작성하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#202622]/10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#173F30] tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-sm text-[#202622]/70 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Inquiry Type */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#173F30] uppercase tracking-wider mb-2">
              문의 구분 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.inquiryType}
              onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#173F30] focus:border-transparent transition-all"
              required
            >
              {inquiryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-[#173F30] uppercase tracking-wider mb-2">
              담당자 성함 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="예: 홍길동"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border ${
                fieldErrors.name ? "border-red-500 bg-red-50/30" : "border-gray-300"
              } text-sm focus:outline-none focus:ring-2 focus:ring-[#173F30]`}
              required
            />
            {fieldErrors.name && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs font-bold text-[#173F30] uppercase tracking-wider mb-2">
              회사명 / 사업자명 (선택)
            </label>
            <input
              type="text"
              placeholder="예: (주)코끼리테크"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#173F30]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-[#173F30] uppercase tracking-wider mb-2">
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="예: 010-1234-5678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border ${
                fieldErrors.phone ? "border-red-500 bg-red-50/30" : "border-gray-300"
              } text-sm focus:outline-none focus:ring-2 focus:ring-[#173F30]`}
              required
            />
            {fieldErrors.phone && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-[#173F30] uppercase tracking-wider mb-2">
              이메일 주소 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="예: name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border ${
                fieldErrors.email ? "border-red-500 bg-red-50/30" : "border-gray-300"
              } text-sm focus:outline-none focus:ring-2 focus:ring-[#173F30]`}
              required
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Location */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#173F30] uppercase tracking-wider mb-2">
              지역 / 현장 주소 (선택)
            </label>
            <input
              type="text"
              placeholder="예: 서울시 강남구 테헤란로 또는 경기도 성남시 분당구"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#173F30]"
            />
          </div>

          {/* Message */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#173F30] uppercase tracking-wider mb-2">
              문의 및 견적 요청 상세 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="공간 면적(평형), 희망 주기(주 3회, 일일, 준공 등), 특수 요청사항을 자유롭게 작성해 주세요."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border ${
                fieldErrors.message ? "border-red-500 bg-red-50/30" : "border-gray-300"
              } text-sm focus:outline-none focus:ring-2 focus:ring-[#173F30]`}
              required
            />
            {fieldErrors.message && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.message}</p>
            )}
          </div>

          {/* Preferred Contact Method */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#173F30] uppercase tracking-wider mb-2">
              희망 연락 방식
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "PHONE", label: "전화 상담" },
                { id: "EMAIL", label: "이메일 견적서 수신" },
                { id: "KAKAO", label: "카카오톡 알림 상담" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center justify-center p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    formData.preferredContactMethod === opt.id
                      ? "border-[#173F30] bg-[#173F30]/5 text-[#173F30]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="preferredContactMethod"
                    value={opt.id}
                    checked={formData.preferredContactMethod === opt.id}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        preferredContactMethod: opt.id as "PHONE" | "EMAIL" | "KAKAO",
                      })
                    }
                    className="sr-only"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy Policy Consent */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consentGiven}
              onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
              className="mt-1 w-4 h-4 rounded text-[#173F30] focus:ring-[#173F30] border-gray-300"
              required
            />
            <span className="text-xs text-[#202622]/80 leading-relaxed">
              [필수] 개인정보 수집 및 이용에 동의합니다. (수집 항목: 성명, 회사명, 연락처, 이메일 | 수집 목적: 견적 상담 및 서비스 안내 | 보유 기간: 상담 종료 후 1년 또는 관련 법령에 따른 보존 기간)
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#173F30] text-[#F8F8F4] font-bold text-base hover:bg-[#173F30]/90 disabled:opacity-50 transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>견적 요청을 안전하게 전송하는 중...</span>
              </>
            ) : (
              <>
                <span>무료 맞춤 견적 신청하기</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
