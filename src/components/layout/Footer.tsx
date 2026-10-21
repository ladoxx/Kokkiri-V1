import React from "react";
import Link from "next/link";
import { Sparkles, Video, Leaf, Phone, Mail, MapPin, ArrowUpRight, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#17201C] text-[#F8F8F4] pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 3 Brands Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-white/10">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#477B56]/50 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-[#65A377]">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold text-sm tracking-wider uppercase">KOKKIRI</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">프리미엄 클리닝</h4>
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              오피스, 대형 빌딩, 상업 시설 맞춤형 위생 관리 및 정기 클리닝 솔루션
            </p>
            <Link
              href="/cleaning"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#65A377] hover:underline"
            >
              서비스 둘러보기 <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#526B80]/50 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-[#3E82B8]">
              <Video className="w-5 h-5" />
              <span className="font-bold text-sm tracking-wider uppercase">KOTO</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">AI 보안 & 시설 솔루션</h4>
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              AI 지능형 보안 카메라 & 스마트 CCTV 구축, 24시간 보안 경비, 조경 관리 및 펜스 시공
            </p>
            <Link
              href="/koto"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#3E82B8] hover:underline"
            >
              솔루션 둘러보기 <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#8C6C43]/50 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-[#B89366]">
              <Leaf className="w-5 h-5" />
              <span className="font-bold text-sm tracking-wider uppercase">CHOKO</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">에코 라이프케어</h4>
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              친환경 대나무 화장지 & 타월, 비건 반려견 사료, 자연유래 탈취제
            </p>
            <Link
              href="/choko"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#B89366] hover:underline"
            >
              제품 카탈로그 <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-white/10 text-sm">
          <div>
            <h5 className="font-bold text-white mb-4 text-xs uppercase tracking-wider text-white/50">
              회사 소개
            </h5>
            <ul className="space-y-2.5 text-white/80 text-xs">
              <li><Link href="/about" className="hover:text-white transition-colors">기업 소개</Link></li>
              <li><Link href="/brands" className="hover:text-white transition-colors">브랜드 포트폴리오</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">프로젝트 실적</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">뉴스 & 공지사항</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-4 text-xs uppercase tracking-wider text-white/50">
              KOKKIRI 클리닝
            </h5>
            <ul className="space-y-2.5 text-white/80 text-xs">
              <li><Link href="/cleaning/services" className="hover:text-white transition-colors">상업 공간 클리닝</Link></li>
              <li><Link href="/cleaning/services" className="hover:text-white transition-colors">오피스 정기 관리</Link></li>
              <li><Link href="/cleaning/services" className="hover:text-white transition-colors">빌딩 종합 위생</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">클리닝 상담 & 문의</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-4 text-xs uppercase tracking-wider text-white/50">
              KOTO AI 보안·시설
            </h5>
            <ul className="space-y-2.5 text-white/80 text-xs">
              <li><Link href="/koto/facility-management" className="hover:text-white transition-colors">AI 보안 카메라 & CCTV 설치</Link></li>
              <li><Link href="/koto/security" className="hover:text-white transition-colors">전문 보안 경비</Link></li>
              <li><Link href="/koto/landscaping" className="hover:text-white transition-colors">기업 조경 유지관리</Link></li>
              <li><Link href="/koto/fence" className="hover:text-white transition-colors">산업용 펜스 시공</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">AI CCTV & 시설 상담 문의</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-4 text-xs uppercase tracking-wider text-white/50">
              고객센터 & 상담
            </h5>
            <div className="space-y-3 text-xs text-white/80">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#65A377] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white text-base">02-1588-0000</span>
                  <p className="text-[11px] text-white/60">평일 09:00 - 18:00 (점심 12:00-13:00)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#65A377] shrink-0" />
                <span>contact@kokkiri.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#65A377] shrink-0 mt-0.5" />
                <span>서울 강남구 테헤란로 123 코끼리타워 8층</span>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Legal Information */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/60">
          <div className="space-y-1">
            <p>
              <strong>주식회사 코끼리 (KOKKIRI Co., Ltd.)</strong> | 대표자: 김코끼 | 사업자등록번호: 123-45-67890
            </p>
            <p>
              주소: 서울특별시 강남구 테헤란로 123 코끼리타워 8층 | 통신판매업신고: 2026-서울강남-0000호
            </p>
            <p className="text-[11px] text-white/40 pt-1">
              © 2026 KOKKIRI Co., Ltd. All rights reserved. 본 웹사이트의 모든 콘텐츠는 저작권법의 보호를 받습니다.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs shrink-0">
            <Link href="/privacy" className="hover:text-white underline underline-offset-4">
              개인정보처리방침
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="hover:text-white">
              이용약관
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/admin/login" className="flex items-center gap-1 text-white/40 hover:text-white transition-colors">
              <Lock className="w-3 h-3" />
              <span>관리자</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
