"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { COMPANY_INFO } from "@/lib/data/initial-data";
import { UiSettings, DEFAULT_UI_SETTINGS } from "@/lib/types/ui-settings";
import { LeadRoutingSettings, DEFAULT_LEAD_ROUTING } from "@/lib/types/lead-routing";
import { ImageUploadPicker } from "@/components/admin/ImageUploadPicker";
import { CinematicSplash } from "@/components/ui/CinematicSplash";
import {
  Sliders,
  Shield,
  Database,
  Server,
  Check,
  Save,
  Loader2,
  Mail,
  Sparkles,
  Play,
  Building,
  Eye,
  RefreshCw,
  Palette,
  Film,
  Zap,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

function AdminSettingsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: "routing" | "cinematic" | "company" =
    tabParam === "cinematic"
      ? "cinematic"
      : tabParam === "company"
      ? "company"
      : "routing";
  const [activeTab, setActiveTab] = useState<"routing" | "cinematic" | "company">(initialTab);

  // Lead Routing Settings State
  const [routingData, setRoutingData] = useState<LeadRoutingSettings>(DEFAULT_LEAD_ROUTING);
  const [savingRouting, setSavingRouting] = useState(false);
  const [savedRouting, setSavedRouting] = useState(false);
  const [testingDivision, setTestingDivision] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Company Settings State
  const [companyData, setCompanyData] = useState(COMPANY_INFO);
  const [savingCompany, setSavingCompany] = useState(false);
  const [savedCompany, setSavedCompany] = useState(false);

  // UI / Cinematic Settings State
  const [uiData, setUiData] = useState<UiSettings>(DEFAULT_UI_SETTINGS);
  const [savingUi, setSavingUi] = useState(false);
  const [savedUi, setSavedUi] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    // Load Lead Routing Settings
    fetch("/api/admin/settings/lead-routing")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) setRoutingData(data.settings);
      })
      .catch((err) => console.error("Error loading lead routing settings:", err));

    // Load Company Settings
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.company) setCompanyData(data.company);
      })
      .catch((err) => console.error("Error loading company settings:", err));

    // Load UI Settings
    fetch("/api/admin/settings/ui")
      .then((res) => res.json())
      .then((data) => {
        if (data) setUiData(data);
      })
      .catch((err) => console.error("Error loading UI settings:", err));
  }, []);

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCompany(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData),
      });
      if (res.ok) {
        setSavedCompany(true);
        setTimeout(() => setSavedCompany(false), 3000);
      }
    } catch (err) {
      console.error("Save company error:", err);
    } finally {
      setSavingCompany(false);
    }
  };

  const handleSaveUi = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingUi(true);
    try {
      const res = await fetch("/api/admin/settings/ui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uiData),
      });
      if (res.ok) {
        setSavedUi(true);
        setTimeout(() => setSavedUi(false), 3000);
      }
    } catch (err) {
      console.error("Save UI settings error:", err);
    } finally {
      setSavingUi(false);
    }
  };

  const handleSaveRouting = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingRouting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/settings/lead-routing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routingData),
      });
      if (res.ok) {
        setSavedRouting(true);
        setTimeout(() => setSavedRouting(false), 3000);
      }
    } catch (err) {
      console.error("Save routing error:", err);
    } finally {
      setSavingRouting(false);
    }
  };

  const handleTestDivision = async (divisionKey: string) => {
    setTestingDivision(divisionKey);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/settings/lead-routing/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ divisionKey }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({
          type: "success",
          message:
            data.message +
            ` (수신: ${data.details.recipients.join(", ")}${
              data.details.bcc?.length ? ` + BCC: ${data.details.bcc.join(", ")}` : ""
            })`,
        });
      } else {
        setTestResult({
          type: "error",
          message: data.message || "테스트 발송 실패",
        });
      }
    } catch (err: any) {
      setTestResult({ type: "error", message: err.message || "통신 오류" });
    } finally {
      setTestingDivision(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      {/* Live Cinematic Splash Preview Modal */}
      {previewOpen && (
        <CinematicSplash
          forceShow={true}
          initialSettings={uiData}
          onFinish={() => setPreviewOpen(false)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            시스템 & 환경 설정
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
            스마트 리드 라우팅, 시네마틱 오프닝 화면, 기업 기본 고지 정보 및 인프라를 통합 관리합니다.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100/90 rounded-2xl border border-gray-200/80 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab("routing")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "routing"
                ? "bg-white text-[#173F30] shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#477B56]" />
            <span>스마트 이메일 라우팅</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cinematic")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "cinematic"
                ? "bg-white text-[#173F30] shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#477B56]" />
            <span>시네마틱 UX & 오프닝</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("company")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "company"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Building className="w-3.5 h-3.5 text-gray-500" />
            <span>기업 공식 고지</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: SMART LEAD ROUTING & MULTI-RECIPIENT NOTIFICATIONS */}
      {/* ========================================================================= */}
      {activeTab === "routing" && (
        <form onSubmit={handleSaveRouting} className="space-y-6">
          {/* Top Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#173F30] via-[#203D2E] to-[#12241B] text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="absolute right-0 top-0 w-80 h-80 bg-[#477B56]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#86efac] text-[11px] font-bold mb-3 backdrop-blur-xs border border-white/10">
                <Mail className="w-3.5 h-3.5" />
                <span>Smart Multi-Recipient Lead Routing</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight mb-2">
                스마트 이메일 라우팅 & 다중 수신자 분기
              </h2>
              <p className="text-xs text-white/80 leading-relaxed">
                단일 대표 총괄 체제에서 3대 사업 부문(클리닝, KOTO AI보안, CHOKO/일반) 문의를 담당 실무진에게 자동 배분하고, 대표님(Master BCC)에게 100% 실시간 사본을 전달합니다.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-2 self-start sm:self-auto">
              <button
                type="submit"
                disabled={savingRouting}
                className="px-5 py-2.5 rounded-xl bg-[#477B56] hover:bg-[#477B56]/90 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {savingRouting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : savedRouting ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{savedRouting ? "저장 완료!" : "설정 저장"}</span>
              </button>
            </div>
          </div>

          {/* Test Feedback Alert */}
          {testResult && (
            <div
              className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 ${
                testResult.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {testResult.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setTestResult(null)}
                className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer font-bold"
              >
                닫기
              </button>
            </div>
          )}

          {/* SECTION 1: MASTER BOSS CONTROL (대표님 단일 총괄 관리) */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-200/80 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#173F30]/10 flex items-center justify-center text-[#173F30]">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">
                    대표님 마스터 관리 (Master Follow-up & BCC)
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    단일 대표 체제에서 모든 부서의 인입 문의를 100% 누락 없이 모니터링합니다.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#173F30]/10 text-[#173F30] font-bold text-[10px]">
                최고 권한
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Master Email Input */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700">
                  대표님 총괄 이메일 주소 (Master Boss Email)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={routingData.masterBossEmail}
                    onChange={(e) =>
                      setRoutingData({
                        ...routingData,
                        masterBossEmail: e.target.value,
                      })
                    }
                    placeholder="admin@kokkiri.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30] font-medium"
                  />
                </div>
                <p className="text-[11px] text-gray-400">
                  어떤 부서로 문의가 접수되든 대표님께 자동 참조되어 직원의 응대 누락을 방지합니다.
                </p>
              </div>

              {/* Master BCC Switch */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-xs text-gray-900">
                    전체 문의 자동 숨은 참조(BCC)
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    모든 부서의 고객 견적 접수 메일을 대표님 메일로 항상 복사 수신합니다.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setRoutingData({
                      ...routingData,
                      masterBccEnabled: !routingData.masterBccEnabled,
                    })
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    routingData.masterBccEnabled ? "bg-[#173F30]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      routingData.masterBccEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Reply-To Switch */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-xs text-gray-900">
                    고객 직접 답장 지원 (Reply-To)
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    이메일에서 [답장] 클릭 시 문의 고객의 이메일로 바로 회신됩니다.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setRoutingData({
                      ...routingData,
                      enableCustomerReplyTo: !routingData.enableCustomerReplyTo,
                    })
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    routingData.enableCustomerReplyTo ? "bg-[#173F30]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      routingData.enableCustomerReplyTo ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: 3-DIVISION ROUTING RULES (3개 사업 부문별 분기) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900">
                  3대 사업 부문별 라우팅 규칙
                </h3>
                <p className="text-[11px] text-gray-500">
                  문의 카테고리에 따라 담당 실무진의 이메일(쉼표로 여러 명)로 분기 발송됩니다.
                </p>
              </div>
            </div>

            {/* Division 1: KOKKIRI Cleaning */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-emerald-100 hover:border-emerald-300 transition-all space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#173F30]" />
                  <span className="font-extrabold text-xs sm:text-sm text-gray-900">
                    KOKKIRI 프리미엄 클리닝
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    오피스 · 사옥 · 상업시설 · 준공 특수
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestDivision("cleaning")}
                    disabled={testingDivision === "cleaning"}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition-all border border-emerald-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {testingDivision === "cleaning" ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                    <span>클리닝 테스트 발송</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    수신 담당자 이메일 (쉼표로 구분하여 여러 명 입력 가능)
                  </label>
                  <input
                    type="text"
                    value={routingData.cleaning.recipients.join(", ")}
                    onChange={(e) =>
                      setRoutingData({
                        ...routingData,
                        cleaning: {
                          ...routingData.cleaning,
                          recipients: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                    placeholder="cleaning@kokkiri.com, admin@kokkiri.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {routingData.cleaning.recipients.map((em, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-[11px] font-semibold border border-emerald-200"
                      >
                        <Mail className="w-3 h-3 text-emerald-600" />
                        {em}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      이메일 제목 템플릿
                    </label>
                    <input
                      type="text"
                      value={routingData.cleaning.subjectTemplate}
                      onChange={(e) =>
                        setRoutingData({
                          ...routingData,
                          cleaning: {
                            ...routingData.cleaning,
                            subjectTemplate: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      사용 가능 변수: &#123;customerName&#125;, &#123;serviceCategory&#125;, &#123;company&#125;
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      내부 배정 메모 (메일 상단 노출)
                    </label>
                    <input
                      type="text"
                      value={routingData.cleaning.customHeaderNote || ""}
                      onChange={(e) =>
                        setRoutingData({
                          ...routingData,
                          cleaning: {
                            ...routingData.cleaning,
                            customHeaderNote: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Division 2: KOTO AI Security */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-sky-100 hover:border-sky-300 transition-all space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#243A50]" />
                  <span className="font-extrabold text-xs sm:text-sm text-gray-900">
                    KOTO AI 보안 & 시설 솔루션
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
                    4K AI CCTV · 24H 보안 경비 · 조경 · 펜스
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestDivision("koto")}
                    disabled={testingDivision === "koto"}
                    className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-bold transition-all border border-sky-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {testingDivision === "koto" ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                    <span>KOTO 테스트 발송</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    수신 담당자 이메일 (쉼표로 구분하여 여러 명 입력 가능)
                  </label>
                  <input
                    type="text"
                    value={routingData.koto.recipients.join(", ")}
                    onChange={(e) =>
                      setRoutingData({
                        ...routingData,
                        koto: {
                          ...routingData.koto,
                          recipients: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                    placeholder="koto@kokkiri.com, security@kokkiri.com, admin@kokkiri.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#243A50]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {routingData.koto.recipients.map((em, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-900 text-[11px] font-semibold border border-sky-200"
                      >
                        <Mail className="w-3 h-3 text-sky-600" />
                        {em}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      이메일 제목 템플릿
                    </label>
                    <input
                      type="text"
                      value={routingData.koto.subjectTemplate}
                      onChange={(e) =>
                        setRoutingData({
                          ...routingData,
                          koto: {
                            ...routingData.koto,
                            subjectTemplate: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#243A50]"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      사용 가능 변수: &#123;customerName&#125;, &#123;serviceCategory&#125;, &#123;company&#125;
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      내부 배정 메모 (메일 상단 노출)
                    </label>
                    <input
                      type="text"
                      value={routingData.koto.customHeaderNote || ""}
                      onChange={(e) =>
                        setRoutingData({
                          ...routingData,
                          koto: {
                            ...routingData.koto,
                            customHeaderNote: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#243A50]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Division 3: CHOKO & General */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-amber-100 hover:border-amber-300 transition-all space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C6C43]" />
                  <span className="font-extrabold text-xs sm:text-sm text-gray-900">
                    CHOKO 에코 라이프케어 & 본사 일반 문의
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    대나무 화장지 · 펫푸드 제휴 · 채용 · 일반 문의
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestDivision("chokoAndGeneral")}
                    disabled={testingDivision === "chokoAndGeneral"}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold transition-all border border-amber-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {testingDivision === "chokoAndGeneral" ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                    <span>CHOKO/일반 테스트 발송</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    수신 담당자 이메일 (쉼표로 구분하여 여러 명 입력 가능)
                  </label>
                  <input
                    type="text"
                    value={routingData.chokoAndGeneral.recipients.join(", ")}
                    onChange={(e) =>
                      setRoutingData({
                        ...routingData,
                        chokoAndGeneral: {
                          ...routingData.chokoAndGeneral,
                          recipients: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                    placeholder="choko@kokkiri.com, admin@kokkiri.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#8C6C43]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {routingData.chokoAndGeneral.recipients.map((em, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-[11px] font-semibold border border-amber-200"
                      >
                        <Mail className="w-3 h-3 text-amber-600" />
                        {em}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      이메일 제목 템플릿
                    </label>
                    <input
                      type="text"
                      value={routingData.chokoAndGeneral.subjectTemplate}
                      onChange={(e) =>
                        setRoutingData({
                          ...routingData,
                          chokoAndGeneral: {
                            ...routingData.chokoAndGeneral,
                            subjectTemplate: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#8C6C43]"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      사용 가능 변수: &#123;customerName&#125;, &#123;serviceCategory&#125;, &#123;company&#125;
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      내부 배정 메모 (메일 상단 노출)
                    </label>
                    <input
                      type="text"
                      value={routingData.chokoAndGeneral.customHeaderNote || ""}
                      onChange={(e) =>
                        setRoutingData({
                          ...routingData,
                          chokoAndGeneral: {
                            ...routingData.chokoAndGeneral,
                            customHeaderNote: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#8C6C43]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingRouting}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#173F30] hover:bg-[#173F30]/90 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {savingRouting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : savedRouting ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{savedRouting ? "설정 저장 완료!" : "전체 라우팅 설정 저장하기"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: CINEMATIC SPLASH & PAGE TRANSITIONS */}
      {/* ========================================================================= */}
      {activeTab === "cinematic" && (
        <div className="space-y-6">
          {/* Quick Banner with Live Preview */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#173F30] via-[#203D2E] to-[#12241B] text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="absolute right-0 top-0 w-80 h-80 bg-[#477B56]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#86efac] text-[11px] font-bold mb-3 backdrop-blur-xs border border-white/10">
                <Film className="w-3.5 h-3.5" />
                <span>Cinematic Brand Experience</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight mb-2">
                시네마틱 오프닝 & 부드러운 페이지 전환
              </h2>
              <p className="text-xs text-white/80 leading-relaxed">
                고객이 웹사이트에 첫 방문할 때 코끼리 심볼 로고와 슬로건이 우아하게 펼쳐지는 오프닝 인트로를 실행하고, 페이지 이동 시 60fps 시네마틱 페이드 효과를 적용합니다.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="relative z-10 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#173F30] font-bold text-xs hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>오프닝 화면 실시간 미리보기</span>
            </button>
          </div>

          <form onSubmit={handleSaveUi} className="space-y-6">
            {/* Section 1: Cinematic Splash Screen Settings */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-5 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#173F30]/10 text-[#173F30] flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">
                      시네마틱 오프닝 인트로 화면 설정
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      첫 방문 고객에게 브랜드의 신뢰도와 아이덴티티를 각인시키는 풀스크린 인트로입니다.
                    </p>
                  </div>
                </div>

                {/* ON/OFF Switch */}
                <div className="flex items-center gap-3 bg-gray-50 px-3.5 py-2 rounded-2xl border border-gray-200 self-start sm:self-auto">
                  <span className="text-xs font-bold text-gray-700">
                    오프닝 사용 여부
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uiData.splashEnabled}
                      onChange={(e) =>
                        setUiData({ ...uiData, splashEnabled: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#173F30]" />
                  </label>
                  <span
                    className={`text-[11px] font-bold ${
                      uiData.splashEnabled ? "text-[#173F30]" : "text-gray-400"
                    }`}
                  >
                    {uiData.splashEnabled ? "활성 (ON)" : "비활성 (OFF)"}
                  </span>
                </div>
              </div>

              {/* Logo Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageUploadPicker
                    value={uiData.splashLogoUrl}
                    onChange={(url) => setUiData({ ...uiData, splashLogoUrl: url })}
                    label="오프닝 심볼 로고 이미지"
                    placeholder="/brand/kokkiri-elephant-logo.png"
                    category="general"
                    helpText="권장: 투명 배경(PNG) 코끼리 심볼 로고 (512x512 이상)"
                  />
                </div>

                {/* Theme Selector */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-700">
                    오프닝 배경 테마 (Atmosphere Theme)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Dark Forest */}
                    <button
                      type="button"
                      onClick={() => setUiData({ ...uiData, splashTheme: "dark" })}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        uiData.splashTheme === "dark"
                          ? "border-[#173F30] ring-2 ring-[#173F30]/20 bg-[#0C1310] text-white"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#173F30] mb-2 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#86efac]" />
                      </div>
                      <div className="font-bold text-xs">다크 포레스트</div>
                      <div className="text-[10px] opacity-70 mt-0.5">딥 그린 시네마틱</div>
                    </button>

                    {/* Navy */}
                    <button
                      type="button"
                      onClick={() => setUiData({ ...uiData, splashTheme: "navy" })}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        uiData.splashTheme === "navy"
                          ? "border-[#3E82B8] ring-2 ring-[#3E82B8]/20 bg-[#080F18] text-white"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#243A50] mb-2 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#3E82B8]" />
                      </div>
                      <div className="font-bold text-xs">미드나잇 네이비</div>
                      <div className="text-[10px] opacity-70 mt-0.5">테크 & 보안 무드</div>
                    </button>

                    {/* Light */}
                    <button
                      type="button"
                      onClick={() => setUiData({ ...uiData, splashTheme: "light" })}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        uiData.splashTheme === "light"
                          ? "border-[#173F30] ring-2 ring-[#173F30]/20 bg-white text-gray-900"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#F8F8F4] border border-gray-300 mb-2 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#173F30]" />
                      </div>
                      <div className="font-bold text-xs">미니멀 라이트</div>
                      <div className="text-[10px] opacity-70 mt-0.5">깨끗한 아이보리</div>
                    </button>
                  </div>

                  {/* Frequency Selector */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      노출 빈도 설정
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setUiData({ ...uiData, splashFrequency: "once_per_session" })
                        }
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer text-xs ${
                          uiData.splashFrequency === "once_per_session"
                            ? "border-[#173F30] bg-[#173F30]/5 text-[#173F30] font-bold"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <div>세션당 1회 노출 (권장)</div>
                        <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                          브라우저를 닫기 전까지 1회만 재생 (UX 최적화)
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setUiData({ ...uiData, splashFrequency: "always" })
                        }
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer text-xs ${
                          uiData.splashFrequency === "always"
                            ? "border-[#173F30] bg-[#173F30]/5 text-[#173F30] font-bold"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <div>매번 새로고침 시 노출</div>
                        <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                          새로고침할 때마다 항상 오프닝 재생
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Customization Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    메인 브랜드 타이틀
                  </label>
                  <input
                    type="text"
                    value={uiData.splashTitle}
                    onChange={(e) =>
                      setUiData({ ...uiData, splashTitle: e.target.value })
                    }
                    placeholder="KOKKIRI"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    서브 타이틀 (법인명)
                  </label>
                  <input
                    type="text"
                    value={uiData.splashSubtitle}
                    onChange={(e) =>
                      setUiData({ ...uiData, splashSubtitle: e.target.value })
                    }
                    placeholder="주식회사 코끼리"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    슬로건 문구
                  </label>
                  <input
                    type="text"
                    value={uiData.splashTagline}
                    onChange={(e) =>
                      setUiData({ ...uiData, splashTagline: e.target.value })
                    }
                    placeholder="공간의 가치를 높이는 새로운 기준"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  />
                </div>
              </div>

              {/* Duration & Badges options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    오프닝 재생 시간
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { ms: 1800, label: "1.8초 (빠름)" },
                      { ms: 2400, label: "2.4초 (표준)" },
                      { ms: 3200, label: "3.2초 (여유)" },
                    ].map((item) => (
                      <button
                        key={item.ms}
                        type="button"
                        onClick={() =>
                          setUiData({ ...uiData, splashDurationMs: item.ms })
                        }
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                          uiData.splashDurationMs === item.ms
                            ? "border-[#173F30] bg-[#173F30] text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end p-3 rounded-2xl bg-gray-50 border border-gray-200">
                  <input
                    type="checkbox"
                    id="showPillars"
                    checked={uiData.splashShowPillars}
                    onChange={(e) =>
                      setUiData({ ...uiData, splashShowPillars: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#173F30] focus:ring-[#173F30] cursor-pointer"
                  />
                  <label
                    htmlFor="showPillars"
                    className="text-xs font-bold text-gray-700 cursor-pointer select-none"
                  >
                    3대 비즈니스 배지 표시 (클리닝 · AI 보안 · 라이프케어)
                  </label>
                </div>
              </div>
            </div>

            {/* Section 2: Page Transitions Settings */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-5 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">
                      페이지 간 시네마틱 전환 효과
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      메뉴나 링크 클릭 시 깜빡임 없이 부드러운 60fps/120fps 애니메이션으로 페이지를 전환합니다.
                    </p>
                  </div>
                </div>

                {/* Transitions Toggle Switch */}
                <div className="flex items-center gap-3 bg-gray-50 px-3.5 py-2 rounded-2xl border border-gray-200 self-start sm:self-auto">
                  <span className="text-xs font-bold text-gray-700">전환 효과 여부</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uiData.transitionsEnabled}
                      onChange={(e) =>
                        setUiData({
                          ...uiData,
                          transitionsEnabled: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#173F30]" />
                  </label>
                  <span
                    className={`text-[11px] font-bold ${
                      uiData.transitionsEnabled ? "text-[#173F30]" : "text-gray-400"
                    }`}
                  >
                    {uiData.transitionsEnabled ? "활성 (ON)" : "비활성 (OFF)"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Transition Style */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    전환 애니메이션 스타일
                  </label>
                  <div className="space-y-2.5">
                    {[
                      {
                        key: "cinematic_curtain",
                        name: "시네마틱 그린 커튼 & 브랜드명 노출 (권장 / 0.7s)",
                        desc: "화면을 덮는 딥 그린 유기적 커튼, 대형 브랜드명(KOTO, KOKKIRI) 노출 및 새 페이지 줌인 등장",
                      },
                      {
                        key: "fade_blur",
                        name: "시네마틱 페이드 & 블러 (0.4s)",
                        desc: "고급스러운 미세 블러 디졸브와 부드러운 페이드인",
                      },
                      {
                        key: "smooth_slide",
                        name: "스무스 슬라이드 & 페이드 (0.35s)",
                        desc: "왼쪽에서 부드럽게 미끄러지듯 나타나는 모던 스타일",
                      },
                    ].map((st) => (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() =>
                          setUiData({
                            ...uiData,
                            transitionStyle: st.key as any,
                          })
                        }
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer text-xs ${
                          uiData.transitionStyle === st.key
                            ? "border-[#173F30] bg-[#173F30]/5 text-[#173F30] font-bold ring-1 ring-[#173F30]/20"
                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-bold">{st.name}</div>
                        <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                          {st.desc}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Live Curtain Test Buttons */}
                  <div className="pt-3">
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      실시간 전환 효과 테스트 (1.3초 시네마틱 연출)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(
                            new CustomEvent("kokkiri_preview_curtain", {
                              detail: { path: "/choko" },
                            })
                          );
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#8C6C43] text-white text-[11px] font-bold hover:bg-[#8C6C43]/90 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>CHOKO 전환 테스트 (1.3s)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(
                            new CustomEvent("kokkiri_preview_curtain", {
                              detail: { path: "/koto" },
                            })
                          );
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#243A50] text-white text-[11px] font-bold hover:bg-[#243A50]/90 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>KOTO 전환 테스트 (1.3s)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(
                            new CustomEvent("kokkiri_preview_curtain", {
                              detail: { path: "/cleaning" },
                            })
                          );
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#173F30] text-white text-[11px] font-bold hover:bg-[#173F30]/90 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>KOKKIRI 클리닝 테스트</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(
                            new CustomEvent("kokkiri_preview_curtain", {
                              detail: { path: "/about" },
                            })
                          );
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#23533E] text-white text-[11px] font-bold hover:bg-[#23533E]/90 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>KOKKIRI 회사 소개 테스트</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(
                            new CustomEvent("kokkiri_preview_curtain", {
                              detail: { path: "/" },
                            })
                          );
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#0F281E] text-white text-[11px] font-bold hover:bg-[#0F281E]/90 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>KOKKIRI 메인 홈 테스트</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transition Scope & Duration */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      전환 노출 범위 (Context Scope)
                    </label>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() =>
                          setUiData({
                            ...uiData,
                            transitionScope: "brand_change_only",
                          })
                        }
                        className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer text-xs ${
                          (uiData.transitionScope || "brand_change_only") ===
                          "brand_change_only"
                            ? "border-[#173F30] bg-[#173F30]/5 text-[#173F30] font-bold ring-1 ring-[#173F30]/20"
                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>브랜드 전환 시에만 노출 (권장)</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#173F30]/10 text-[#173F30]">
                            UX 최적화
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 font-normal mt-0.5 leading-relaxed">
                          CHOKO, KOTO, KOKKIRI 등 다른 브랜드로 이동할 때만 1회 실행됩니다. 같은 브랜드 내 상품/하위 페이지 이동 시에는 반복 노출되지 않아 쾌적합니다.
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setUiData({
                            ...uiData,
                            transitionScope: "every_page",
                          })
                        }
                        className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer text-xs ${
                          uiData.transitionScope === "every_page"
                            ? "border-[#173F30] bg-[#173F30]/5 text-[#173F30] font-bold ring-1 ring-[#173F30]/20"
                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-bold">모든 페이지 이동 시 노출</div>
                        <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                          하위 메뉴를 포함한 모든 링크 클릭 시마다 항상 커튼 효과 실행
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Curtain Hold Duration */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      브랜드 노출 및 커튼 지속 시간
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { ms: 1000, label: "1.0초 (약간 빠름)" },
                        { ms: 1300, label: "1.3초 (표준 / 권장)" },
                        { ms: 1600, label: "1.6초 (여유로움)" },
                      ].map((dur) => (
                        <button
                          key={dur.ms}
                          type="button"
                          onClick={() =>
                            setUiData({
                              ...uiData,
                              curtainDurationMs: dur.ms,
                            })
                          }
                          className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                            (uiData.curtainDurationMs || 1300) === dur.ms
                              ? "border-[#173F30] bg-[#173F30] text-white"
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          {dur.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-gray-200">
              <div className="text-xs text-gray-500">
                {savedUi ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <Check className="w-4 h-4" />
                    <span>시네마틱 UX 설정이 저장되었습니다.</span>
                  </span>
                ) : (
                  <span>설정을 변경한 후 반드시 ‘저장하기’를 눌러주세요.</span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>미리보기</span>
                </button>

                <button
                  type="submit"
                  disabled={savingUi}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#173F30] text-white font-bold text-xs hover:bg-[#173F30]/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {savingUi ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>시네마틱 설정 저장</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COMPANY INFORMATION & INFRASTRUCTURE */}
      {/* ========================================================================= */}
      {activeTab === "company" && (
        <div className="space-y-6">
          {/* Quick Navigation to SMTP & Notifications */}
          <div className="p-4 rounded-2xl bg-[#173F30]/5 border border-[#173F30]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#173F30] text-white flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">
                  SMTP 메일 서버 및 카카오톡 알림 설정
                </div>
                <div className="text-[11px] text-gray-500">
                  발송 호스트, 포트, 비밀번호, 발신자 표기 및 테스트 발송
                </div>
              </div>
            </div>
            <Link
              href="/admin/notifications"
              className="px-4 py-2 rounded-xl bg-[#173F30] text-white text-xs font-bold hover:bg-[#173F30]/90 transition-all text-center shrink-0"
            >
              SMTP 설정 바로가기 &rarr;
            </Link>
          </div>

          {/* System Diagnostics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2">
                <Server className="w-4 h-4 text-[#173F30]" />
                <span>애플리케이션 환경</span>
              </div>
              <div className="text-base font-bold text-gray-900">
                Next.js 16 (App Router)
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                Node v22 / React 19 / TypeScript
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span>데이터베이스 엔진</span>
              </div>
              <div className="text-base font-bold text-gray-900">
                PostgreSQL (Prisma ORM)
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                22개 엔티티 스키마 및 마이그레이션 활성화
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>인증 & RBAC 보안</span>
              </div>
              <div className="text-base font-bold text-gray-900">
                Bcrypt + HTTP-Only JWT
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                SUPER_ADMIN / ADMIN / MANAGER / STAFF
              </div>
            </div>
          </div>

          {/* Company Information Form */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-gray-100 gap-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900">
                  기업 공식 고지 정보
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  웹사이트 하단 푸터 및 법적 고지란에 노출되는 사업자 정보입니다.
                </p>
              </div>
              {savedCompany && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg shrink-0">
                  <Check className="w-4 h-4" />
                  <span>성공적으로 저장되었습니다</span>
                </span>
              )}
            </div>

            <form
              onSubmit={handleSaveCompany}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  상호 / 법인명
                </label>
                <input
                  type="text"
                  value={companyData.name}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  대표자 성명
                </label>
                <input
                  type="text"
                  value={companyData.ceo}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, ceo: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  사업자등록번호
                </label>
                <input
                  type="text"
                  value={companyData.businessNumber}
                  onChange={(e) =>
                    setCompanyData({
                      ...companyData,
                      businessNumber: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  대표 전화
                </label>
                <input
                  type="text"
                  value={companyData.phone}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1.5">
                  사업장 소재지 주소
                </label>
                <input
                  type="text"
                  value={companyData.address}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, address: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  대표 이메일
                </label>
                <input
                  type="email"
                  value={companyData.email}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  견적 접수 전용 이메일
                </label>
                <input
                  type="email"
                  value={companyData.quoteEmail}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, quoteEmail: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                />
              </div>

              <div className="sm:col-span-2 pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={savingCompany}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#173F30] text-white font-bold text-xs hover:bg-[#173F30]/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {savingCompany ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>설정 저장하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-gray-400">
          설정 불러오는 중...
        </div>
      }
    >
      <AdminSettingsContent />
    </Suspense>
  );
}
