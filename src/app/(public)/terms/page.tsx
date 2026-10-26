import React from "react";
import type { Metadata } from "next";
import { getCompanyInfo } from "@/lib/data/company-store";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "이용약관 | KOKKIRI",
  description:
    "주식회사 코끼리 비즈니스 플랫폼 웹사이트 이용조건 및 절차, 이용자와 회사의 권리·의무 및 책임사항을 규정한 이용약관입니다.",
  path: "/terms",
  keywords: ["이용약관", "코끼리이용약관", "서비스이용약관"],
});

export default function TermsPage() {
  const COMPANY_INFO = getCompanyInfo();
  const breadcrumbs = getBreadcrumbSchema([{ name: "이용약관", url: "/terms" }]);

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      <h1 className="text-3xl sm:text-4xl font-black text-[#173F30] mb-8 pb-4 border-b border-black/10">
        서비스 이용약관
      </h1>

      <div className="space-y-8 text-xs sm:text-sm text-[#202622]/80 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-[#173F30] mb-3">제1조 (목적)</h2>
          <p>
            본 약관은 {COMPANY_INFO.name}(이하 &apos;회사&apos;)가 운영하는 KOKKIRI 비즈니스 플랫폼 웹사이트(이하 &apos;웹사이트&apos;)에서 제공하는 기업 정보, 클리닝 및 AI 보안·시설 견적 신청, 제품 카탈로그 안내 등 제반 서비스(이하 &apos;서비스&apos;)의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#173F30] mb-3">제2조 (용어의 정의)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>&apos;웹사이트&apos;</strong>란 회사가 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래하거나 정보를 제공할 수 있도록 설정한 가상의 영업장을 말합니다.</li>
            <li><strong>&apos;이용자&apos;</strong>란 웹사이트에 접속하여 본 약관에 따라 회사가 제공하는 서비스를 받는 고객을 말합니다.</li>
            <li><strong>&apos;견적 신청&apos;</strong>이란 이용자가 공간 관리, 클리닝, AI 보안 및 시설 엔지니어링 계약을 위해 웹사이트 양식을 통해 기본 제원을 제출하는 행위를 말합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#173F30] mb-3">제3조 (외부 쇼핑몰 연결에 관한 특칙)</h2>
          <p>
            회사의 브랜드 CHOKO 제품 안내 페이지에서 제공하는 구매 링크는 외부 오픈마켓(네이버 스마트스토어, 쿠팡 등)으로 연결됩니다. 외부 판매처에서 이루어지는 상품 주문, 결제, 배송 및 환불 등은 해당 외부 판매처의 약관 및 정책에 따르며, 회사의 본 웹사이트에서는 자체 결제 또는 장바구니 기능을 일체 제공하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#173F30] mb-3">제4조 (저작권의 귀속 및 이용제한)</h2>
          <p>
            회사가 작성한 저작물에 대한 저작권 및 기타 지식재산권은 회사에 귀속합니다. 이용자는 웹사이트를 이용함으로써 얻은 정보 중 회사에게 지식재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
          </p>
        </section>

        <p className="pt-4 text-gray-500">
          공고일자: 2026년 3월 1일 | 시행일자: 2026년 3월 1일
        </p>
      </div>
    </div>
  );
}
