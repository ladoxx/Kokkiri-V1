import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { MotionReveal } from "@/components/animations/MotionReveal";
import {
  Video,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Eye,
  Server,
  Cpu,
  BellRing,
  AlertTriangle,
} from "lucide-react";
import { buildPageMetadata, getBreadcrumbSchema, getServiceSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "AI 보안 카메라 & 스마트 CCTV 설치 | 4K 딥러닝 관제 | KOKKIRI",
  description:
    "사각지대 제로 4K 초고화질 AI 지능형 CCTV 설계 및 설치. 사람·차량 정밀 인식, 침입·화재 실시간 스마트폰 앱 알림으로 사업장 자산을 24시간 지킵니다.",
  path: "/koto/facility-management",
  keywords: [
    "AI보안카메라",
    "스마트CCTV",
    "CCTV설치",
    "지능형CCTV",
    "4KCCTV",
    "야간나이트비전",
    "화재감지CCTV",
    "파주CCTV",
    "일산CCTV",
    "고양CCTV",
  ],
});

export default function AiSecurityCameraPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "시설관리 & AI보안 (KOTO)", url: "/koto" },
    { name: "AI 보안 카메라 & CCTV", url: "/koto/facility-management" },
  ]);
  const cctvServiceSchema = getServiceSchema({
    name: "KOTO AI 지능형 보안 카메라 & 스마트 CCTV 설치",
    description: "4K AI 딥러닝 실시간 영상 분석 및 스마트폰 원격 관제 CCTV 구축",
    serviceType: "SecurityCameraInstallationService",
    url: "/koto/facility-management",
  });

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={[breadcrumbs, cctvServiceSchema]} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <MotionReveal direction="down">
          <span className="text-xs font-bold text-[#3E82B8] uppercase tracking-wider block mb-2">
            AI Security Camera & Smart CCTV
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#243A50] tracking-tight mb-6">
            AI 지능형 보안 카메라 & CCTV 설치
          </h1>
          <p className="text-sm sm:text-base text-[#202622]/75 leading-relaxed">
            단순 녹화를 넘어 딥러닝 AI 영상 분석으로 침입, 배회, 화재 연기, 쓰러짐 등 위험 상황을 실시간 감지하고 스마트폰으로 즉시 전송하는 첨단 보안 솔루션입니다.
          </p>
        </MotionReveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        <div className="lg:col-span-8 space-y-8">
          {/* Main Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#202622]/10 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#243A50] text-white flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-[#243A50]">
                사각지대 제로 4K 초고화질 AI 감시 시스템
              </h2>
            </div>

            <p className="text-sm text-[#202622]/75 leading-relaxed mb-6">
              사옥, 제조 공장, 첨단 물류창고, 상가 및 고급 주거단지의 외곽과 내부 사각지대를 정밀 분석하여 최적의 카메라 위치를 설계합니다. 800만 화소 4K Starlight 적외선 센서로 조명이 없는 암흑 속에서도 선명한 컬러 영상과 차량 번호판을 식별합니다.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-black/5">
              <div className="p-4 rounded-2xl bg-[#F2F5F7]">
                <Cpu className="w-5 h-5 text-[#243A50] mb-2" />
                <h4 className="font-bold text-sm text-[#202622] mb-1">AI 딥러닝 영상 분석 엔진</h4>
                <p className="text-xs text-gray-500">
                  사람과 차량 객체만을 정밀 필터링하여 동물이나 바람으로 인한 오경보를 98% 차단
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2F5F7]">
                <Eye className="w-5 h-5 text-[#243A50] mb-2" />
                <h4 className="font-bold text-sm text-[#202622] mb-1">야간 Starlight 적외선 투시</h4>
                <p className="text-xs text-gray-500">
                  야간에도 주간 수준의 선명도를 자랑하는 4K HDR 초저조도 나이트비전 카메라
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2F5F7]">
                <Smartphone className="w-5 h-5 text-[#243A50] mb-2" />
                <h4 className="font-bold text-sm text-[#202622] mb-1">스마트폰 실시간 모니터링</h4>
                <p className="text-xs text-gray-500">
                  이상 징후 포착 즉시 스마트폰 전용 앱으로 위험 알림 푸시 및 고화질 실시간 스트리밍
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2F5F7]">
                <Server className="w-5 h-5 text-[#243A50] mb-2" />
                <h4 className="font-bold text-sm text-[#202622] mb-1">암호화 보안 NVR & 클라우드</h4>
                <p className="text-xs text-gray-500">
                  영상 유출을 방지하는 256비트 암호화 저장 및 네트워크 정전 대비 안전 녹화 시스템
                </p>
              </div>
            </div>
          </div>

          {/* Installation Process */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#202622]/10 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-[#202622]">KOTO AI 카메라 전문 설치 프로세스</h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-xs font-mono font-bold text-[#3E82B8] mb-1">STEP 01</div>
                <div className="font-bold text-sm text-gray-900 mb-1">현장 보안 진단</div>
                <div className="text-[11px] text-gray-500">사각지대 진단 및 최적 화각 앵글 설계</div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-xs font-mono font-bold text-[#3E82B8] mb-1">STEP 02</div>
                <div className="font-bold text-sm text-gray-900 mb-1">AI 맞춤 설계</div>
                <div className="text-[11px] text-gray-500">카메라 스펙 선정 및 PoE NVR 구성</div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-xs font-mono font-bold text-[#3E82B8] mb-1">STEP 03</div>
                <div className="font-bold text-sm text-gray-900 mb-1">정밀 배선 공사</div>
                <div className="text-[11px] text-gray-500">깔끔한 은폐 배선 및 고성능 카메라 고정</div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-xs font-mono font-bold text-[#3E82B8] mb-1">STEP 04</div>
                <div className="font-bold text-sm text-gray-900 mb-1">AI 세팅 & 인계</div>
                <div className="text-[11px] text-gray-500">앱 연동, 경보 테스트 및 고객 교육</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right CTA Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-3xl bg-[#243A50] text-white shadow-md">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
              <BellRing className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI CCTV 무료 현장 실사 신청</h3>
            <p className="text-xs text-white/80 leading-relaxed mb-6">
              사업장 또는 건물의 도면과 필요 카메라 대수를 알려주시면 보안 엔지니어가 무료로 방문하여 최적의 사각지대 제로 견적서를 산출해 드립니다.
            </p>
            <Link
              href="/koto/request-quote"
              className="inline-flex items-center justify-between w-full py-3.5 px-5 rounded-xl bg-white text-[#243A50] font-bold text-xs hover:bg-gray-100 transition-colors shadow-xs"
            >
              <span>AI CCTV 맞춤 견적 요청하기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>KOTO 품질 보증 서비스</span>
            </div>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>정품 규격 카메라 & 2년 무상 A/S 보증</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>외곽 방수·방진 IP67 인증 하우징 시공</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>장애 발생 시 24시간 이내 긴급 기술 점검</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
