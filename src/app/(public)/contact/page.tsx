import React from "react";
import type { Metadata } from "next";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { COMPANY_INFO } from "@/lib/data/initial-data";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "문의하기 | 고객센터 & 본사 안내 | KOKKIRI",
  description:
    "주식회사 코끼리 본사 위치, 대표 연락처, 운영 시간 및 온라인 상담 접수 안내입니다. 청소, 시설관리, AI 보안, 조경, 펜스 견적 및 제휴 문의를 남겨주세요.",
  path: "/contact",
  keywords: [
    "문의하기",
    "코끼리고객센터",
    "시설관리상담",
    "청소견적문의",
    "본사위치",
    "고객센터",
  ],
});

export default function ContactPage() {
  const breadcrumbs = getBreadcrumbSchema([{ name: "문의하기", url: "/contact" }]);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-2">
            Contact & Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#173F30] tracking-tight mb-6">
            고객센터 & 상담 문의
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            서비스 상담, 제휴 문의, 채용 관련 등 궁금하신 점을 남겨주시면 담당 부서에서 신속하고 정확하게 안내해 드립니다.
          </p>
        </MotionReveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-[#202622]/10 shadow-sm">
            <h3 className="text-xl font-bold text-[#173F30] mb-6">고객 상담 안내</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#173F30]/10 text-[#173F30] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-semibold">대표 전화</div>
                  <div className="text-lg font-bold text-[#202622]">{COMPANY_INFO.phone}</div>
                  <div className="text-xs text-[#202622]/60 mt-0.5">{COMPANY_INFO.operatingHours}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#173F30]/10 text-[#173F30] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-semibold">이메일 문의</div>
                  <div className="text-sm font-bold text-[#202622]">{COMPANY_INFO.email}</div>
                  <div className="text-xs text-[#202622]/60 mt-0.5">견적 문의: {COMPANY_INFO.quoteEmail}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#173F30]/10 text-[#173F30] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-semibold">본사 주소</div>
                  <div className="text-sm font-bold text-[#202622]">{COMPANY_INFO.address}</div>
                  <div className="text-xs text-[#202622]/60 mt-0.5">2호선 역삼역/강남역 도보 5분 거리</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#243A50]/10 text-[#243A50] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-semibold">긴급 시설 대응 (24시간)</div>
                  <div className="text-sm font-bold text-[#243A50]">{COMPANY_INFO.emergencyPhone}</div>
                  <div className="text-xs text-[#202622]/60 mt-0.5">계약 사업장 긴급 누수·정전·설비 장애 지원</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7">
          <InquiryForm
            defaultType="기타 일반 문의"
            title="온라인 문의 접수"
            subtitle="문의 내용을 남겨주시면 담당자가 검토 후 등록하신 연락처 또는 이메일로 답변드립니다."
          />
        </div>
      </div>
    </div>
  );
}
