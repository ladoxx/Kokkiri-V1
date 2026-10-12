"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F4] px-4 py-16">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-12 rounded-3xl border border-red-200 shadow-sm">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-[#202622] mb-3">일시적인 오류가 발생했습니다</h2>
        <p className="text-xs text-[#202622]/70 leading-relaxed mb-6">
          요청을 처리하는 도중 예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해 주시기 바랍니다.
        </p>

        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#173F30] text-white text-xs font-bold hover:bg-[#173F30]/90 transition-all shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>다시 시도하기</span>
        </button>
      </div>
    </div>
  );
}
