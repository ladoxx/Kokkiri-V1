import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Shield, ShieldAlert, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { buildPageMetadata, getBreadcrumbSchema, getServiceSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "보안·경비 서비스 | 시설 보안관리 & 출입 관제 | KOKKIRI",
  description:
    "철저한 출입 통제, 내방객 안내, 심야 순찰 및 24시간 관제 시스템을 갖춘 KOTO 전문 시설 보안 경비 서비스입니다. 사업장 안전과 자산을 철저히 보호합니다.",
  path: "/koto/security",
  keywords: [
    "보안",
    "경비",
    "시설경비",
    "출입통제",
    "사업장보안",
    "야간순찰",
    "관제시스템",
    "파주경비",
    "일산보안",
  ],
});

export default function SecurityPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "시설관리 & AI보안 (KOTO)", url: "/koto" },
    { name: "전문 보안 & 시설 경비", url: "/koto/security" },
  ]);
  const securityServiceSchema = getServiceSchema({
    name: "KOTO 전문 보안 및 시설 경비 서비스",
    description: "24시간 사업장 출입 관제, 내방객 안내 및 야간 정밀 순찰 방범 솔루션",
    serviceType: "SecurityGuardService",
    url: "/koto/security",
  });

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={[breadcrumbs, securityServiceSchema]} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#3E82B8] uppercase tracking-wider block mb-2">
            Security & Guard Systems
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#243A50] tracking-tight mb-6">
            전문 보안 & 시설 경비
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            사업장 내 자산과 임직원의 안전을 위해 전문 경비 지도사의 지휘 하에 24시간 철저한 출입 통제 및 관제 순찰 서비스를 제공합니다.
          </p>
        </MotionReveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        <div className="lg:col-span-8 space-y-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#202622]/10 shadow-sm">
            <h2 className="text-2xl font-black text-[#243A50] mb-4">빈틈없는 24시간 보안 프로토콜</h2>
            <p className="text-sm text-[#202622]/75 leading-relaxed mb-6">
              사옥 로비 안내부터 차량 주차 관제, 비상 사태 발생 시 초동 대처 및 응급 구호(CPR) 훈련을 이수한 신뢰도 높은 보안 전문 요원을 배치합니다.
            </p>

            <div className="space-y-3 pt-4 border-t border-black/5">
              {[
                "사업장 정문 출입 보안 및 비인가 외부인·차량 엄격 통제",
                "지하 주차장 동선 유도, 내방객 발렛 및 주차 요금 정산 관리",
                "사각지대 야간 정기 순찰 및 디지털 NFC 태그 순찰 기록 유지",
                "화재 수신반 연동 및 이상 징후 감지 시 5분 내 초동 조치",
              ].map((text, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-[#202622]/85">
                  <CheckCircle2 className="w-4 h-4 text-[#3E82B8] shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="p-8 rounded-3xl bg-[#243A50] text-white">
            <h3 className="text-xl font-bold mb-3">보안 경비 견적 문의</h3>
            <p className="text-xs text-white/80 leading-relaxed mb-6">
              상주 경비 인원 수, 교대 근무 형태(주야간 2교대/3교대)에 따른 최적 인력 설계를 지원합니다.
            </p>
            <Link
              href="/koto/request-quote?service=보안경비"
              className="inline-flex items-center justify-between w-full py-3.5 px-4 rounded-xl bg-white text-[#243A50] font-bold text-xs hover:bg-gray-100 transition-colors"
            >
              <span>보안 인력 견적 상담</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
