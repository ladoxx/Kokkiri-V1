import React from "react";
import type { Metadata } from "next";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { CheckCircle2, Shield, CalendarCheck, HelpCircle } from "lucide-react";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "무료 견적 문의 | 청소·시설관리·보안·조경 맞춤 견적 | KOKKIRI",
  description:
    "오피스 클리닝, AI 스마트 CCTV, 24시간 보안 경비, 기업 조경 관리, 산업용 펜스 시공 등 필요한 서비스를 선택하고 무료 방문 실사 및 맞춤 견적서를 받아보세요.",
  path: "/request-quote",
  keywords: [
    "견적문의",
    "무료견적신청",
    "청소견적",
    "시설관리견적",
    "CCTV설치견적",
    "조경견적",
    "펜스견적",
    "무료방문실사",
  ],
});

export default function RequestQuotePage() {
  const breadcrumbs = getBreadcrumbSchema([{ name: "무료 견적 신청", url: "/request-quote" }]);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-2">
            Free Consultation & Quote
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#173F30] tracking-tight mb-6">
            맞춤 서비스 견적 신청
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            공간의 면적, 운영 형태, 희망 주기에 맞춰 가장 경제적이고 체계적인 견적서를 무료로 작성해 드립니다.
          </p>
        </MotionReveal>
      </div>

      {/* Quote Process Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-14 max-w-5xl mx-auto">
        <div className="p-5 rounded-2xl bg-white border border-[#202622]/10 text-center">
          <span className="text-xs font-bold text-[#173F30] block mb-1">STEP 01</span>
          <h4 className="text-sm font-bold text-[#202622] mb-1">온라인 견적 접수</h4>
          <p className="text-[11px] text-gray-500">기본 정보 및 요청사항 입력</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#202622]/10 text-center">
          <span className="text-xs font-bold text-[#173F30] block mb-1">STEP 02</span>
          <h4 className="text-sm font-bold text-[#202622] mb-1">담당 매니저 유선 상담</h4>
          <p className="text-[11px] text-gray-500">1영업일 내 세부 요구사항 확인</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#202622]/10 text-center">
          <span className="text-xs font-bold text-[#173F30] block mb-1">STEP 03</span>
          <h4 className="text-sm font-bold text-[#202622] mb-1">무료 현장 정밀 실사</h4>
          <p className="text-[11px] text-gray-500">면적, 마감재, 설비 상태 분석</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#202622]/10 text-center">
          <span className="text-xs font-bold text-[#173F30] block mb-1">STEP 04</span>
          <h4 className="text-sm font-bold text-[#202622] mb-1">최종 제안서 & 견적 교부</h4>
          <p className="text-[11px] text-gray-500">공정표 및 맞춤 견적서 발송</p>
        </div>
      </div>

      {/* Form */}
      <InquiryForm
        defaultType="클리닝 견적 문의"
        title="무료 견적 요청서 작성"
        subtitle="아래 양식을 작성해 주시면 24시간 이내에 전담 매니저가 연락을 드립니다."
      />
    </div>
  );
}
