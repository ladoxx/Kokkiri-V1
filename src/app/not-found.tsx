import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, MessageSquareQuote } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F4] px-4 py-16">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-12 rounded-3xl border border-[#202622]/10 shadow-sm">
        <span className="font-mono text-6xl font-black text-[#173F30] block mb-4">404</span>
        <h1 className="text-2xl font-black text-[#202622] mb-3">페이지를 찾을 수 없습니다</h1>
        <p className="text-xs text-[#202622]/70 leading-relaxed mb-8">
          요청하신 페이지가 삭제되었거나 주소가 잘못 입력되었을 수 있습니다. 아래 바로가기 링크를 통해 원하시는 서비스와 페이지로 안전하게 이동하실 수 있습니다.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-[#173F30] text-white text-xs font-bold hover:bg-[#173F30]/90 transition-all shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>홈으로 이동</span>
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>서비스 보기</span>
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border border-[#477B56]/30 text-[#173F30] bg-[#477B56]/5 text-xs font-bold hover:bg-[#477B56]/15 transition-all"
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>문의하기</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
