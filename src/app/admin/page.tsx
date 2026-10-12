"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  Clock,
  CheckCircle2,
  Bell,
  ArrowUpRight,
  ChevronRight,
  Building,
  ImageIcon,
  ShoppingBag,
  MoveHorizontal,
  Sparkles,
} from "lucide-react";

interface DashboardStats {
  totalInquiries: number;
  newInquiries: number;
  inProgressInquiries: number;
  completedInquiries: number;
  sentNotifications: number;
  failedNotifications: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInquiries: 0,
    newInquiries: 0,
    inProgressInquiries: 0,
    completedInquiries: 0,
    sentNotifications: 0,
    failedNotifications: 0,
  });

  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/inquiries").then((r) => r.json()),
    ])
      .then(([statsRes, inqRes]) => {
        if (statsRes?.stats) setStats(statsRes.stats);
        if (inqRes?.inquiries) setRecentInquiries(inqRes.inquiries.slice(0, 5));
      })
      .catch((err) => console.error("Error loading admin stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">신규</span>;
      case "IN_PROGRESS":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">진행중</span>;
      case "WAITING_FOR_CUSTOMER":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">회신대기</span>;
      case "COMPLETED":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800">완료</span>;
      case "REJECTED":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800">반려</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">대시보드 개요</h1>
          <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
            KOKKIRI 플랫폼의 실시간 문의, 알림 전송 현황 및 채널 지표입니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/inquiries"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#173F30] text-white text-xs font-bold hover:bg-[#173F30]/90 transition-all shadow-sm text-center"
          >
            문의 전체 관리 &rarr;
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase">신규 미확인 문의</div>
            <div className="text-2xl font-black text-emerald-600 mt-1 sm:mt-1.5">{stats.newInquiries}건</div>
            <div className="text-[11px] text-gray-400 mt-0.5 sm:mt-1">즉시 대응 필요</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase">진행 중 상담</div>
            <div className="text-2xl font-black text-blue-600 mt-1 sm:mt-1.5">{stats.inProgressInquiries}건</div>
            <div className="text-[11px] text-gray-400 mt-0.5 sm:mt-1">실사 및 견적 조율</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase">상담 및 계약 완료</div>
            <div className="text-2xl font-black text-gray-900 mt-1 sm:mt-1.5">{stats.completedInquiries}건</div>
            <div className="text-[11px] text-gray-400 mt-0.5 sm:mt-1">누적 성공 계약</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase">알림 발송 완료</div>
            <div className="text-2xl font-black text-purple-600 mt-1 sm:mt-1.5">{stats.sentNotifications}건</div>
            <div className="text-[11px] text-gray-400 mt-0.5 sm:mt-1">
              이메일 및 알림톡 (실패: {stats.failedNotifications}건)
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Inquiries List / Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">최근 접수된 고객 문의</h2>
            <p className="text-xs text-gray-500 mt-0.5">실시간으로 인입된 견적 및 상담 내역입니다.</p>
          </div>
          <Link
            href="/admin/inquiries"
            className="text-xs font-bold text-[#173F30] hover:underline flex items-center gap-1 shrink-0"
          >
            <span className="hidden sm:inline">전체 목록 보기</span>
            <span className="sm:hidden">전체</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 1. Mobile Cards (< sm) */}
        <div className="block sm:hidden divide-y divide-gray-100">
          {recentInquiries.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              접수된 문의 내역이 없습니다.
            </div>
          ) : (
            recentInquiries.map((inq) => (
              <Link
                key={inq.id}
                href={`/admin/inquiries?id=${inq.id}`}
                className="p-4 block hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(inq.status)}
                    <span className="text-xs font-bold text-gray-900">{inq.customer?.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {new Date(inq.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>

                <div className="text-xs text-gray-700 font-semibold mb-1">
                  {inq.inquiryType}
                </div>

                {inq.customer?.company && (
                  <div className="text-[11px] text-gray-500 mb-1 flex items-center gap-1">
                    <Building className="w-3 h-3 text-gray-400" />
                    <span>{inq.customer.company}</span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-xs">
                  <span className="font-mono text-gray-600">{inq.customer?.phone}</span>
                  <span className="text-[11px] font-bold text-[#173F30] flex items-center gap-0.5">
                    <span>열기</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* 2. Structured Table (sm and up) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[620px]">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
              <tr>
                <th className="py-3 px-6">상태</th>
                <th className="py-3 px-6">문의 구분</th>
                <th className="py-3 px-6">고객명 / 회사</th>
                <th className="py-3 px-6">연락처</th>
                <th className="py-3 px-6">희망 서비스 / 지역</th>
                <th className="py-3 px-6">접수 일시</th>
                <th className="py-3 px-6 text-right">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    접수된 문의 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                recentInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-6">{getStatusBadge(inq.status)}</td>
                    <td className="py-3.5 px-6 font-semibold text-gray-900">{inq.inquiryType}</td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-gray-900">{inq.customer?.name}</div>
                      {inq.customer?.company && (
                        <div className="text-[11px] text-gray-500">{inq.customer.company}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-gray-600 font-mono">{inq.customer?.phone}</td>
                    <td className="py-3.5 px-6 text-gray-600">
                      <div>{inq.serviceCategory || "-"}</div>
                      {inq.location && <div className="text-[11px] text-gray-400">{inq.location}</div>}
                    </td>
                    <td className="py-3.5 px-6 text-gray-500">
                      {new Date(inq.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        href={`/admin/inquiries?id=${inq.id}`}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] transition-colors"
                      >
                        열기
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/media"
          className="p-5 rounded-2xl bg-white border border-gray-200/80 hover:border-[#173F30] hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#173F30]/10 text-[#173F30] flex items-center justify-center group-hover:bg-[#173F30] group-hover:text-white transition-all">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">미디어 라이브러리</div>
              <div className="text-[11px] text-gray-400">사진 직접 업로드 및 보관함 관리</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          href="/admin/products"
          className="p-5 rounded-2xl bg-white border border-gray-200/80 hover:border-[#8C6C43] hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#8C6C43]/10 text-[#8C6C43] flex items-center justify-center group-hover:bg-[#8C6C43] group-hover:text-white transition-all">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">CHOKO 제품 관리</div>
              <div className="text-[11px] text-gray-400">네이버·쿠팡 구매 링크 및 사진 수정</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          href="/admin/before-after"
          className="p-5 rounded-2xl bg-white border border-gray-200/80 hover:border-[#243A50] hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#243A50]/10 text-[#243A50] flex items-center justify-center group-hover:bg-[#243A50] group-hover:text-white transition-all">
              <MoveHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">시공 전후 비교 관리</div>
              <div className="text-[11px] text-gray-400">비교 슬라이더 사진 및 성과 수정</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          href="/admin/settings?tab=cinematic"
          className="p-5 rounded-2xl bg-white border border-gray-200/80 hover:border-[#477B56] hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#173F30] to-[#477B56] text-white flex items-center justify-center transition-all shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">시네마틱 UX 설정</div>
              <div className="text-[11px] text-gray-400">오프닝 인트로 & 페이지 전환 제어</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
