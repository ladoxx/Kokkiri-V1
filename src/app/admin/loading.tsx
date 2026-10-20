import React from "react";
import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#173F30] text-[#F8F8F4] flex items-center justify-center font-bold text-xl shadow-md animate-pulse">
          K
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#173F30]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>관리자 데이터를 불러오는 중입니다...</span>
        </div>
      </div>
    </div>
  );
}
