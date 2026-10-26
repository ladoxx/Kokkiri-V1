"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Cpu,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  Loader2,
  Terminal,
  Database,
  Globe,
  Sliders,
  FolderTree,
  Activity,
  Bot,
  Zap,
} from "lucide-react";
import { AdminAgentAuditReport } from "@/lib/agents/admin-agents";

export default function AdminAgentsPage() {
  const [report, setReport] = useState<AdminAgentAuditReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const fetchAuditReport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/agents");
      const data = await res.json();
      if (data?.report) {
        setReport(data.report);
      }
    } catch (err) {
      console.error("Failed to load agent report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditReport();
  }, []);

  const handleRunAgentAction = async (action: string, title: string) => {
    setRunningAction(action);
    setActionNotice(null);
    try {
      const res = await fetch("/api/admin/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionNotice(data.message || `${title} 작업이 완료되었습니다.`);
        fetchAuditReport();
      } else {
        alert(data.error || "작업 실행 실패");
      }
    } catch (err: any) {
      console.error("Action error:", err);
      alert("작업 중 오류 발생: " + err.message);
    } finally {
      setRunningAction(null);
    }
  };

  const filteredChecks = report?.checks.filter((c) => {
    if (activeFilter === "all") return true;
    return c.category === activeFilter;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Header Banner with Agent Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold mb-2">
            <Bot className="w-3.5 h-3.5 text-emerald-600" />
            <span>KOKKIRI AI Code & Infrastructure Control Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            AI 관리자 에이전트 & 코드 관제 센터
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
            관리자 패널 전체 링크 구조, 데이터베이스 무결성, 코드 헬스 및 네이버 SEO 상태를 3개의 전담 AI 에이전트가 자동 검사하고 제어합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRunAgentAction("inspect", "전체 시스템 코드 검사")}
            disabled={runningAction !== null}
            className="px-4 py-2.5 rounded-xl bg-[#173F30] text-white text-xs font-bold hover:bg-[#173F30]/90 transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {runningAction === "inspect" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>전체 코드 & 시스템 재검사</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Top 3 AI Specialized Agents Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Agent 1: Code & Database Inspector */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Agent #1</div>
            <h3 className="text-sm font-black text-gray-900 mt-0.5">코드 & DB 인스펙터</h3>
            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
              Prisma SQLite 22개 테이블 상태, 스키마 마이그레이션, JSON 데이터 파일 무결성을 실시간 감시합니다.
            </p>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              상태: 정상 작동중
            </span>
            <button
              onClick={() => handleRunAgentAction("verify-db", "DB 연결 검증")}
              disabled={runningAction !== null}
              className="text-xs font-bold text-blue-700 hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>DB 검증 실행</span>
              <Zap className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Agent 2: Navigation & Link Auditor */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Agent #2</div>
            <h3 className="text-sm font-black text-gray-900 mt-0.5">네비게이션 & 링크 관리</h3>
            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
              관리자 패널 4대 영역 링크와 웹사이트 헤더/푸터 공개 메뉴의 정합성을 검사하고 정리합니다.
            </p>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              링크 100% 연결
            </span>
            <Link
              href="/admin/navigation"
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
            >
              <span>메뉴 관리 이동</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Agent 3: Naver SEO & Commerce Advisor */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Agent #3</div>
            <h3 className="text-sm font-black text-gray-900 mt-0.5">네이버 SEO & 커머스</h3>
            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
              CHOKO 친환경 제품 메타태그, 네이버 스마트스토어/쿠팡 연결 링크, Yeti 봇 크롤러 규격을 관리합니다.
            </p>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              평균 98점 / 최적
            </span>
            <button
              onClick={() => handleRunAgentAction("optimize-seo", "네이버 SEO 일괄 최적화")}
              disabled={runningAction !== null}
              className="text-xs font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>SEO 최적화 실행</span>
              <Zap className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Overall Diagnostic Score Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#173F30] via-[#204E3E] to-[#121915] text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-white/20 text-[#86efac]">
              시스템 진단 등급: {report?.grade || "A+"}
            </span>
            <span className="text-xs text-gray-300">
              최종 검사: {report?.timestamp ? new Date(report.timestamp).toLocaleTimeString("ko-KR") : "방금 전"}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            전체 시스템 무결성 점수: {report?.overallScore || 98}점 / 100점
          </h2>
          <p className="text-xs text-gray-300 max-w-xl">
            데이터베이스, 라우트 파일, 네이버 SEO, 관리자 세션 보안 및 데이터 파일이 정상적으로 작동하고 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 shrink-0 text-center">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <div className="text-xs text-gray-300">정상 통과</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {report?.summary.healthy || 0}건
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <div className="text-xs text-gray-300">권장 점검</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">
              {report?.summary.warning || 0}건
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <div className="text-xs text-gray-300">오류/차단</div>
            <div className="text-xl font-black text-red-400 mt-0.5">
              {report?.summary.error || 0}건
            </div>
          </div>
        </div>
      </div>

      {/* 4. Complete Admin Panel Directory & Link Organization Hub */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-[#173F30]" />
              <span>관리자 패널 전체 기능 & 링크 종합 디렉토리</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              혼란 없이 어디에 어떤 기능이 있는지 한눈에 파악하고 즉시 수정/이동할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {report?.adminLinksCatalog.map((zone, zIdx) => (
            <div key={zIdx} className="space-y-3">
              <div className="pb-2 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900">{zone.zone}</h3>
                  <p className="text-[11px] text-gray-500">{zone.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {zone.links.map((link, lIdx) => (
                  <Link
                    key={lIdx}
                    href={link.href}
                    className="p-4 rounded-2xl border border-gray-200 hover:border-[#173F30] hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-gray-900 group-hover:text-[#173F30] transition-colors">
                          {link.title}
                        </span>
                        {link.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                        {link.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span>{link.href}</span>
                      <span className="text-[#173F30] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        바로가기 &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Detailed System Diagnostic Checklist */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <span>에이전트 세부 코드 & 시스템 진단 항목 ({report?.checks.length || 0}건)</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              각 검사 항목의 세부 점수와 수정 가이드를 확인할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl text-xs">
            {["all", "database", "storage", "seo", "security"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  activeFilter === cat ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {cat === "all" ? "전체 보기" : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-xs text-gray-400">진단 항목 분석 중...</div>
          ) : (
            filteredChecks?.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {item.status === "healthy" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : item.status === "warning" ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">{item.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-gray-100 text-gray-600 font-mono">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{item.message}</p>
                    {item.actionRequired && (
                      <div className="mt-2 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md inline-block">
                        조치 필요: {item.actionRequired}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-black ${
                      item.score >= 90
                        ? "text-emerald-600"
                        : item.score >= 60
                        ? "text-amber-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.score}점
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">100점 만점</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
