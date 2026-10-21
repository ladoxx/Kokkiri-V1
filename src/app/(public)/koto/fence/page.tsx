import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Warehouse, CheckCircle2, ArrowRight } from "lucide-react";
import { buildPageMetadata, getBreadcrumbSchema, getServiceSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "펜스·울타리 시공 | 산업용 메쉬 펜스 & 게이트 공사 | KOKKIRI",
  description:
    "공장, 물류센터, 사옥 외곽 경계를 완벽히 보호하는 고강도 메쉬 펜스, 디자인 펜스, 전동 슬라이딩 게이트 정밀 시공 서비스입니다. 견고한 외곽 차단망을 구축합니다.",
  path: "/koto/fence",
  keywords: [
    "펜스",
    "울타리",
    "메쉬펜스",
    "디자인펜스",
    "슬라이딩게이트",
    "펜스시공",
    "외곽보안",
    "공장펜스",
    "파주펜스",
    "일산펜스",
    "고양펜스",
  ],
});

export default function FencePage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "시설관리 & AI보안 (KOTO)", url: "/koto" },
    { name: "보안 펜스 & 외곽 차단 시공", url: "/koto/fence" },
  ]);
  const fenceServiceSchema = getServiceSchema({
    name: "KOTO 산업용 보안 펜스 및 게이트 시공 서비스",
    description: "공장 및 사옥 외곽 메쉬 펜스, 디자인 펜스, 전동 게이트 정밀 기초 시공",
    serviceType: "FenceInstallationService",
    url: "/koto/fence",
  });

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={[breadcrumbs, fenceServiceSchema]} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#3E82B8] uppercase tracking-wider block mb-2">
            Perimeter Fencing & Barrier Systems
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#243A50] tracking-tight mb-6">
            보안 펜스 & 외곽 차단 시공
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            사업장 경계 침입을 방지하고 시설물의 외관 품격을 높이는 고내구성 산업용·디자인 펜스 설계 및 정밀 기초 시공 솔루션입니다.
          </p>
        </MotionReveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        <div className="lg:col-span-8 space-y-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#202622]/10 shadow-sm">
            <h2 className="text-2xl font-black text-[#243A50] mb-4">내구성과 보안성을 겸비한 맞춤 시공</h2>
            <p className="text-sm text-[#202622]/75 leading-relaxed mb-6">
              염분이나 비바람 등 가혹한 기후 조건에도 부식이 없는 용융 아연 도금 강재와 분체 도장 기술을 적용하여 장기간 흔들림 없는 안전한 외곽 경계를 구축합니다.
            </p>

            <div className="space-y-3 pt-4 border-t border-black/5">
              {[
                "표준 메쉬 펜스(Mesh Fence): 공장 및 물류센터 경계용 표준 규격 시공",
                "아트 디자인 펜스: 사옥 전면부 및 고급 주거 시설 어울림 디자인",
                "차량 및 보행자용 전동 슬라이딩 게이트 및 번호 인식기 연동 설치",
                "경사지 및 불규칙 암반 지형에 맞춘 콘크리트 앵커링 기초 공법 적용",
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
            <h3 className="text-xl font-bold mb-3">펜스 실측 및 견적 문의</h3>
            <p className="text-xs text-white/80 leading-relaxed mb-6">
              시공 구간의 총 연장(m)과 높이(H), 지반 상태를 확인하고 상세 시공 견적을 산출해 드립니다.
            </p>
            <Link
              href="/contact?service=펜스시공"
              className="inline-flex items-center justify-between w-full py-3.5 px-4 rounded-xl bg-white text-[#243A50] font-bold text-xs hover:bg-gray-100 transition-colors"
            >
              <span>펜스 시공 무료 상담 문의</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
