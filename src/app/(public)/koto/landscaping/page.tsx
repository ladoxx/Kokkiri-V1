import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Trees, CheckCircle2, ArrowRight } from "lucide-react";
import { buildPageMetadata, getBreadcrumbSchema, getServiceSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "조경 서비스 | 조경관리·수목 전정·시설관리 | KOKKIRI",
  description:
    "사옥 정원, 옥상 녹화, 조경 수목 전정(가지치기), 잔디 예초, 친환경 병충해 방제까지 사계절 쾌적한 기업 녹지 공간을 조성하는 KOTO 조경 관리 솔루션입니다.",
  path: "/koto/landscaping",
  keywords: [
    "조경",
    "조경관리",
    "시설관리",
    "수목전정",
    "가지치기",
    "잔디예초",
    "병충해방제",
    "사옥정원",
    "파주조경",
    "일산조경",
  ],
});

export default function LandscapingPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "시설관리 & AI보안 (KOTO)", url: "/koto" },
    { name: "기업 조경 & 정원 유지관리", url: "/koto/landscaping" },
  ]);
  const landscapingServiceSchema = getServiceSchema({
    name: "KOTO 기업 조경 및 정원 유지관리 서비스",
    description: "사옥 수목 전정, 잔디 예초, 친환경 병충해 방제 및 사계절 녹지 공간 케어",
    serviceType: "LandscapingService",
    url: "/koto/landscaping",
  });

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={[breadcrumbs, landscapingServiceSchema]} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#3E82B8] uppercase tracking-wider block mb-2">
            Commercial Landscaping & Green Care
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#243A50] tracking-tight mb-6">
            기업 조경 & 정원 유지관리
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            사옥 주변과 옥상 정원의 푸르름을 사계절 내내 유지하는 조경 기술자 중심의 수목 전정, 잔디 예초 및 친환경 방제 솔루션입니다.
          </p>
        </MotionReveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        <div className="lg:col-span-8 space-y-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#202622]/10 shadow-sm">
            <h2 className="text-2xl font-black text-[#243A50] mb-4">사계절 수목 생육 캘린더 관리</h2>
            <p className="text-sm text-[#202622]/75 leading-relaxed mb-6">
              봄철 시비(비료 주기)부터 여름철 집중 제초와 잔디 깎기, 가을철 수형 다듬기 전정과 겨울철 동해(凍害) 방지 짚싸기 작업까지 연간 계획에 따라 조경의 아름다움과 건강을 지킵니다.
            </p>

            <div className="space-y-3 pt-4 border-t border-black/5">
              {[
                "소나무, 단풍나무, 회양목 등 주요 관상 수목 전문 전정 작업",
                "천연 잔디 디트래칭(묵은 풀 제거), 에어레이션 및 정기 예초",
                "식물 보호제 및 미생물 친환경 제제를 활용한 연간 4회 병충해 방제",
                "태풍 및 폭설 대비 대형 수목 지주목 설치 및 위험목 사전 제거",
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
            <h3 className="text-xl font-bold mb-3">조경 유지관리 견적</h3>
            <p className="text-xs text-white/80 leading-relaxed mb-6">
              정원 면적과 식재된 수목의 종류 및 수량에 맞는 연간 유지관리 플랜을 무료로 제안해 드립니다.
            </p>
            <Link
              href="/contact?service=조경관리"
              className="inline-flex items-center justify-between w-full py-3.5 px-4 rounded-xl bg-white text-[#243A50] font-bold text-xs hover:bg-gray-100 transition-colors"
            >
              <span>조경 상담 & 문의하기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
