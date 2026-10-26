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
  Briefcase,
  FileText,
  Menu,
  Mail,
  KeyRound,
  RefreshCw,
  FolderTree,
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
      {/* 1. Top Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#173F30] via-[#204E3E] to-[#121915] text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-[#86efac]">
              KOKKIRI Central Admin
            </span>
            <span className="text-[11px] text-gray-300">실시간 통합 관제</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            KOKKIRI 통합 관리자 콘솔
          </h1>
          <p className="text-xs text-gray-300 max-w-xl">
            고객 견적 문의 접수, 브랜드별 서비스/제품 관리, 네이버 쇼핑몰 연동 및 시스템 설정을 한눈에 관리합니다.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/inquiries"
            className="px-4 py-2.5 rounded-xl bg-[#86efac] text-gray-900 text-xs font-black hover:bg-[#86efac]/90 transition-all shadow-xs flex items-center gap-1"
          >
            <span>신규 문의 확인하기</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPI Cards Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase">신규 미확인 문의</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{stats.newInquiries}건</div>
            <div className="text-[11px] text-gray-400 mt-0.5">즉시 대응 필요</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase">진행 중 상담</div>
            <div className="text-2xl font-black text-blue-600 mt-1">{stats.inProgressInquiries}건</div>
            <div className="text-[11px] text-gray-400 mt-0.5">실사 및 견적 조율</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase">상담 계약 완료</div>
            <div className="text-2xl font-black text-gray-900 mt-1">{stats.completedInquiries}건</div>
            <div className="text-[11px] text-gray-400 mt-0.5">누적 체결 실적</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase">알림 발송 완료</div>
            <div className="text-2xl font-black text-purple-600 mt-1">{stats.sentNotifications}건</div>
            <div className="text-[11px] text-gray-400 mt-0.5">이메일 & 알림톡 로그</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Structured 4-Zone Master Navigation Hub */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-6 space-y-6">
        <div>
          <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-[#173F30]" />
            <span>관리자 패널 전체 섹션 & 링크 안내</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            어느 메뉴에서 어떤 작업을 수행하는지 4개 영역으로 체계화되어 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Zone 1 */}
          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase text-gray-400">1. 고객 관리 & CRM</div>
              <h3 className="font-bold text-xs text-gray-900 mt-0.5">상담 및 알림 로그</h3>
              <p className="text-[11px] text-gray-500 mt-1">고객의 온라인 견적 접수 내역과 이메일/알림톡 발송 이력</p>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-gray-200">
              <Link
                href="/admin/inquiries"
                className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200/80 text-xs font-bold text-gray-800 hover:text-emerald-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Inbox className="w-3.5 h-3.5 text-emerald-600" />
                  <span>고객 문의 & CRM</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link
                href="/admin/notifications"
                className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-purple-50 border border-gray-200/80 text-xs font-bold text-gray-800 hover:text-purple-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-purple-600" />
                  <span>알림 발송 기록</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Zone 2 */}
          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase text-gray-400">2. 비즈니스 & 상품/서비스</div>
              <h3 className="font-bold text-xs text-gray-900 mt-0.5">서비스·쇼핑몰·시공실적</h3>
              <p className="text-[11px] text-gray-500 mt-1">청소·AI보안 서비스 목록과 CHOKO 친환경 제품 및 SEO 관리</p>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-gray-200">
              <Link
                href="/admin/services"
                className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-blue-50 border border-gray-200/80 text-xs font-bold text-gray-800 hover:text-blue-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>브랜드 서비스 관리</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200/80 text-xs font-bold text-gray-800 hover:text-emerald-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#8C6C43]" />
                  <span>CHOKO 제품 & SEO</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link
                href="/admin/before-after"
                className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200/80 text-xs font-bold text-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MoveHorizontal className="w-3.5 h-3.5 text-[#243A50]" />
                  <span>시공 전후 갤러리</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Zone 3 */}
          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase text-gray-400">3. 콘텐츠 & 사이트 CMS</div>
              <h3 className="font-bold text-xs text-gray-900 mt-0.5">문구·메뉴·미디어 사진</h3>
              <p className="text-[11px] text-gray-500 mt-1">웹사이트 텍스트 문구, 헤더/푸터 메뉴 구조, 이미지 라이브러리</p>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-gray-200">
              <Link
                href="/admin/content"
                className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200/80 text-xs font-bold text-gray-800 hover:text-emerald-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-gray-700" />
                  <span>문구 & 텍스트 편집</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link
                href="/admin/navigation"
                className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200/80 text-xs font-bold text-gray-800 hover:text-emerald-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Menu className="w-3.5 h-3.5 text-gray-700" />
                  <span>네비게이션 메뉴 구조</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link
                href="/admin/media"
                className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200/80 text-xs font-bold text-gray-800 hover:text-emerald-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>미디어 파일 보관함</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Zone 4 */}
          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase text-gray-400">4. 시스템 설정 & 보안</div>
              <h3 className="font-bold text-xs text-gray-900 mt-0.5">설정·보안·업데이트</h3>
              <p className="text-[11px] text-gray-500 mt-1">이메일 라우팅, 비밀번호 보안, 회사 정보, 시스템 롤백</p>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-gray-200">
              <Link
                href="/admin/settings?tab=routing"
                className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200/80 text-xs font-bold text-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-600" />
                  <span>통합 이메일 라우팅</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link
                href="/admin/settings?tab=company"
                className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200/80 text-xs font-bold text-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  <span>회사 정보 & 연락처</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link
                href="/admin/settings?tab=cinematic"
                className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200/80 text-xs font-bold text-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>시네마틱 UX 설정</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link
                href="/admin/settings?tab=security"
                className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200/80 text-xs font-bold text-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-red-600" />
                  <span>계정 & 비밀번호 보안</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link
                href="/admin/updates"
                className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200/80 text-xs font-bold text-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                  <span>시스템 버전 & 롤백</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Inquiries List / Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">최근 접수된 고객 문의</h2>
            <p className="text-xs text-gray-500 mt-0.5">실시간으로 인입된 견적 및 상담 내역입니다.</p>
          </div>
          <Link
            href="/admin/inquiries"
            className="text-xs font-bold text-[#173F30] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>전체 문의 관리</span>
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
                    <span>상세보기</span>
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
                        상세보기
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
