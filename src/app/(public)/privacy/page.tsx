import React from "react";
import type { Metadata } from "next";
import { COMPANY_INFO } from "@/lib/data/initial-data";
import { buildPageMetadata, getBreadcrumbSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "개인정보처리방침 | KOKKIRI",
  description:
    "주식회사 코끼리의 개인정보 수집, 이용, 보관 및 파기 등에 관한 공식 안내입니다. 고객 정보보호 및 관련 법령을 철저히 준수합니다.",
  path: "/privacy",
  keywords: ["개인정보처리방침", "코끼리개인정보", "정보보호방침"],
});

export default function PrivacyPolicyPage() {
  const breadcrumbs = getBreadcrumbSchema([{ name: "개인정보처리방침", url: "/privacy" }]);

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbs} />
      <h1 className="text-3xl sm:text-4xl font-black text-[#173F30] mb-8 pb-4 border-b border-black/10">
        개인정보처리방침
      </h1>

      <div className="space-y-8 text-xs sm:text-sm text-[#202622]/80 leading-relaxed">
        <p>
          주식회사 코끼리(이하 &apos;회사&apos;)는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다. 이에 「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보의 처리와 보호에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
        </p>

        <section>
          <h2 className="text-base font-bold text-[#173F30] mb-3">제1조 (개인정보의 처리 목적)</h2>
          <p className="mb-2">회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>고객 서비스 견적 상담 및 현장 실사 일정 조율</li>
            <li>문의 내역 접수 및 처리 결과 회신</li>
            <li>공간 관리 계약 체결 및 이행에 따른 연락 및 알림 발송</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#173F30] mb-3">제2조 (처리하는 개인정보의 항목)</h2>
          <p className="mb-2">회사는 온라인 견적 및 상담 접수 시 다음의 개인정보 항목을 수집하고 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>필수항목:</strong> 성명(담당자명), 연락처(휴대전화번호), 이메일 주소, 문의 내용</li>
            <li><strong>선택항목:</strong> 회사명/사업자명, 현장 주소/지역</li>
            <li><strong>인터넷 서비스 이용과정에서 자동 생성·수집되는 항목:</strong> IP주소, 접속 기록, 쿠키, 서비스 이용 기록</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#173F30] mb-3">제3조 (개인정보의 처리 및 보유 기간)</h2>
          <p className="mb-2">회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>견적 및 일반 문의 기록:</strong> 상담 완료 및 계약 체결 여부 확정 후 1년 (단, 전자상거래법 등 관계 법령에 규정이 있는 경우 해당 법정 기간 동안 보관)</li>
            <li><strong>소비자의 불만 또는 분쟁처리에 관한 기록:</strong> 3년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#173F30] mb-3">제4조 (개인정보의 안전성 확보 조치)</h2>
          <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육</li>
            <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 암호화 통신(SSL/TLS 적용), 보안프로그램 설치</li>
            <li>물리적 조치: 전산실, 자료보관실 등의 비인가자 접근 통제</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#173F30] mb-3">제5조 (개인정보 보호책임자)</h2>
          <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
          <div className="mt-3 p-4 rounded-xl bg-white border border-gray-200">
            <div><strong>성명:</strong> 김코끼 (개인정보보호책임자)</div>
            <div><strong>연락처:</strong> {COMPANY_INFO.phone}</div>
            <div><strong>이메일:</strong> {COMPANY_INFO.email}</div>
          </div>
        </section>

        <p className="pt-4 text-gray-500">
          본 방침은 2026년 3월 1일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
}
