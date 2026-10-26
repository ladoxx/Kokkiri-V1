import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { ShieldCheck, Target, HeartHandshake, Award, Sparkles, Building2, Video, Leaf, ArrowRight } from "lucide-react";
import { getCompanyInfo } from "@/lib/data/company-store";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "회사 소개 | 기업 철학과 비전 | KOKKIRI",
  description:
    "주식회사 코끼리의 브랜드 철학, 핵심 가치, 사업 영역을 소개합니다. 공간 위생 케어부터 첨단 시설 보안까지 고객 자산의 가치를 높이는 든든한 비즈니스 파트너입니다.",
  path: "/about",
  keywords: ["회사소개", "코끼리철학", "기업비전", "시설관리", "위생솔루션", "직영관리제", "ESG경영"],
});

export default function AboutPage() {
  const COMPANY_INFO = getCompanyInfo();
  const breadcrumbs = getBreadcrumbSchema([{ name: "회사 소개", url: "/about" }]);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#477B56] uppercase tracking-wider block mb-2">
            Company Philosophy
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#173F30] tracking-tight leading-tight mb-6">
            공간의 품격을 높이고<br />
            지속 가능한 내일을 만듭니다
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            코끼리는 프리미엄 클리닝과 첨단 AI 스마트 보안 및 공간 관리를 넘어, 고객의 소중한 비즈니스 공간이 최상의 가치와 생산성을 발휘할 수 있도록 돕는 통합 공간 솔루션 파트너입니다.
          </p>
        </MotionReveal>
      </div>

      {/* Core Values */}
      <section className="mb-24">
        <h2 className="text-2xl font-black text-[#173F30] text-center mb-12">
          코끼리가 지켜가는 3대 핵심 가치
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-[#202622]/10 shadow-sm text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#173F30]/10 text-[#173F30] flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#202622] mb-3">철저한 표준과 안전</h3>
            <p className="text-xs text-[#202622]/70 leading-relaxed">
              작업자 안전 매뉴얼과 체계적인 위생 프로토콜을 바탕으로 현장 위해 요소를 사전에 차단하고 규격화된 고품질 서비스를 제공합니다.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#202622]/10 shadow-sm text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#243A50]/10 text-[#243A50] flex items-center justify-center mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#202622] mb-3">책임 직영 매니저제</h3>
            <p className="text-xs text-[#202622]/70 leading-relaxed">
              외주 하청 없이 정규 교육을 이수한 숙련된 전문가를 전담 배치하여 사업장별 고유한 니즈에 1:1로 신속하고 유연하게 대응합니다.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#202622]/10 shadow-sm text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#8C6C43]/10 text-[#8C6C43] flex items-center justify-center mb-6">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#202622] mb-3">친환경과 지속 가능성</h3>
            <p className="text-xs text-[#202622]/70 leading-relaxed">
              친환경 인증 약제 도입과 100% 대나무 소재 소비재 보급을 통해 이용자의 건강과 지구 환경 모두를 보호하는 ESG 경영을 실천합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Ecosystem */}
      <section className="mb-24 p-8 sm:p-12 rounded-3xl bg-white border border-[#202622]/10 shadow-sm">
        <h2 className="text-2xl font-black text-[#173F30] mb-6">
          유기적으로 연결된 3대 비즈니스 체계
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#173F30]/5 border border-[#173F30]/15">
            <Sparkles className="w-6 h-6 text-[#173F30] mb-3" />
            <h4 className="text-base font-bold text-[#173F30] mb-1">KOKKIRI</h4>
            <p className="text-xs text-gray-600 mb-4">프리미엄 클리닝 & 위생 관리</p>
            <p className="text-xs text-[#202622]/75 leading-relaxed">
              오피스, 대형 빌딩, 준공 후 특수 시설에 대한 심층 위생 관리 및 주기별 전문 바닥 코팅
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#243A50]/5 border border-[#243A50]/15">
            <Video className="w-6 h-6 text-[#243A50] mb-3" />
            <h4 className="text-base font-bold text-[#243A50] mb-1">KOTO</h4>
            <p className="text-xs text-gray-600 mb-4">AI 스마트 보안 & 시설 솔루션</p>
            <p className="text-xs text-[#202622]/75 leading-relaxed">
              AI 지능형 보안 카메라 & 4K CCTV 구축, 사업장 24시간 보안 관제, 조경 식재 및 외곽 펜스 시공
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#8C6C43]/5 border border-[#8C6C43]/15">
            <Leaf className="w-6 h-6 text-[#8C6C43] mb-3" />
            <h4 className="text-base font-bold text-[#8C6C43] mb-1">CHOKO</h4>
            <p className="text-xs text-gray-600 mb-4">에코 라이프케어 소비재</p>
            <p className="text-xs text-[#202622]/75 leading-relaxed">
              100% 대나무 무형광 화장지, 대나무 일회용 타월, 비건 펫케어 및 피톤치드 탈취제
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Info Table */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-[#173F30] mb-6 text-center">
          기업 개요 (Company Information)
        </h2>
        <div className="bg-white rounded-2xl border border-[#202622]/10 overflow-hidden shadow-sm">
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-5 bg-gray-50 text-left font-bold text-gray-600 w-36">회사명</th>
                <td className="py-3 px-5 text-gray-800">{COMPANY_INFO.name}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-5 bg-gray-50 text-left font-bold text-gray-600">대표자</th>
                <td className="py-3 px-5 text-gray-800">{COMPANY_INFO.ceo}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-5 bg-gray-50 text-left font-bold text-gray-600">사업자등록번호</th>
                <td className="py-3 px-5 text-gray-800">{COMPANY_INFO.businessNumber}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-5 bg-gray-50 text-left font-bold text-gray-600">본사 소재지</th>
                <td className="py-3 px-5 text-gray-800">{COMPANY_INFO.address}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-5 bg-gray-50 text-left font-bold text-gray-600">대표 전화</th>
                <td className="py-3 px-5 text-gray-800">{COMPANY_INFO.phone}</td>
              </tr>
              <tr>
                <th className="py-3 px-5 bg-gray-50 text-left font-bold text-gray-600">주요 사업 부문</th>
                <td className="py-3 px-5 text-gray-800">
                  건물위생관리업, 시설경비업, 조경식재공사업, 친환경 생활용품 및 사료 유통업
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="mt-20 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#173F30] text-white font-bold text-sm hover:bg-[#173F30]/90 transition-all shadow-md"
        >
          <span>맞춤 솔루션 상담 & 문의하기</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
