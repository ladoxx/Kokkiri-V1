"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Send,
  Loader2,
  Save,
  Check,
  Eye,
  EyeOff,
  Server,
  KeyRound,
  ShieldCheck,
  X,
} from "lucide-react";

export default function AdminNotificationsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // SMTP Configuration State
  const [smtpConfig, setSmtpConfig] = useState({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    user: "notification@kokkiri.com",
    pass: "",
    from: "KOKKIRI 알림센터 <notification@kokkiri.com>",
    adminNotificationEmail: "admin@kokkiri.com",
    hasPassword: false,
    kakaoSenderKey: "SANDBOX_PROFILE_KEY",
    kakaoApiKey: "SANDBOX_API_KEY",
    kakaoTestMode: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [verifyingSmtp, setVerifyingSmtp] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [testTargetEmail, setTestTargetEmail] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchJobs = () => {
    setLoading(true);
    fetch("/api/admin/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data?.jobs) setJobs(data.jobs);
      })
      .catch((err) => console.error("Error loading notification jobs:", err))
      .finally(() => setLoading(false));
  };

  const fetchSmtpConfig = () => {
    fetch("/api/admin/smtp")
      .then((res) => res.json())
      .then((data) => {
        if (data?.config) {
          setSmtpConfig((prev) => ({
            ...prev,
            ...data.config,
            pass: data.config.passMasked || "",
            hasPassword: data.config.hasPassword,
          }));
          if (data.config.adminNotificationEmail) {
            setTestTargetEmail(data.config.adminNotificationEmail);
          }
        }
      })
      .catch((err) => console.error("Error loading SMTP config:", err));
  };

  useEffect(() => {
    fetchJobs();
    fetchSmtpConfig();
  }, []);

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSmtp(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          config: smtpConfig,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "저장 실패");

      setFeedback({ type: "success", message: data.message || "SMTP 설정이 저장되었습니다." });
      fetchSmtpConfig();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "설정 저장 중 오류가 발생했습니다." });
    } finally {
      setSavingSmtp(false);
    }
  };

  const handleVerifySmtp = async () => {
    setVerifyingSmtp(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          config: smtpConfig,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", message: data.message });
      } else {
        setFeedback({ type: "error", message: data.message || "SMTP 서버 연결 실패" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "연결 테스트 중 오류 발생" });
    } finally {
      setVerifyingSmtp(false);
    }
  };

  const handleSendTestEmail = async () => {
    setSendingTest(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_test",
          config: smtpConfig,
          sendTestTo: testTargetEmail || smtpConfig.adminNotificationEmail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          message: `${testTargetEmail || smtpConfig.adminNotificationEmail} (으)로 테스트 이메일이 발송되었습니다.`,
        });
        fetchJobs();
      } else {
        setFeedback({ type: "error", message: data.error || "테스트 메일 발송 실패" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "발송 요청 오류" });
    } finally {
      setSendingTest(false);
    }
  };

  const handleRetryJob = async (jobId: string) => {
    try {
      await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      fetchJobs();
    } catch (err) {
      console.error("Retry failed:", err);
    }
  };

  const renderStatusBadge = (status: string) => {
    if (status === "SENT") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
          발송완료
        </span>
      );
    } else if (status === "FAILED") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
          실패
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
          {status}
        </span>
      );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          알림 & SMTP 발송 계정 설정 센터
        </h1>
        <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
          신규 고객 문의 접수 시 자동 발송되는 SMTP 메일 서버 호스트, 계정 인증키, 알림톡 연동 상태를 관리합니다.
        </p>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SMTP Configuration Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#173F30]/10 text-[#173F30] flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">SMTP 메일 서버 연동 및 발송 계정</h2>
              <p className="text-xs text-gray-500">문의 인입 시 관리자 알림 및 고객 접수 확인 메일을 발송합니다.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TLS / SSL 암호화 지원</span>
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveSmtp} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-gray-400" />
                <span>SMTP 서버 호스트 (Host) *</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: smtp.gmail.com, smtp.worksmobile.com"
                value={smtpConfig.host}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#173F30]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">포트 번호 (Port) *</label>
              <input
                type="number"
                required
                placeholder="587 또는 465"
                value={smtpConfig.port}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, port: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#173F30]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-gray-400" />
                <span>SMTP 계정 이메일 / 사용자명 *</span>
              </label>
              <input
                type="email"
                required
                placeholder="예: notification@kokkiri.com"
                value={smtpConfig.user}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-gray-700">비밀번호 / 앱 비밀번호 *</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-gray-500 hover:text-gray-800 flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? "숨기기" : "표시"}</span>
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Google 앱 비밀번호 또는 메일 서버 비밀번호"
                value={smtpConfig.pass}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, pass: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#173F30]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">발신자 표기 (From Header)</label>
              <input
                type="text"
                placeholder="예: KOKKIRI 알림센터 <notification@kokkiri.com>"
                value={smtpConfig.from}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, from: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">관리자 알림 수신 이메일</label>
              <input
                type="email"
                placeholder="예: admin@kokkiri.com"
                value={smtpConfig.adminNotificationEmail}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, adminNotificationEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="smtpSecure"
              checked={smtpConfig.secure}
              onChange={(e) => setSmtpConfig({ ...smtpConfig, secure: e.target.checked })}
              className="w-4 h-4 rounded text-[#173F30] focus:ring-[#173F30]"
            />
            <label htmlFor="smtpSecure" className="text-xs text-gray-700 font-medium cursor-pointer">
              SSL 직접 암호화 (포트 465 사용 시 활성화 권장, 587 사용 시 체크 해제)
            </label>
          </div>

          {/* Action Buttons Bar */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleVerifySmtp}
                disabled={verifyingSmtp}
                className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {verifyingSmtp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-[#173F30]" />}
                <span>연결 테스트</span>
              </button>

              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={sendingTest}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {sendingTest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-emerald-600" />}
                <span>테스트 메일 즉시 발송</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={savingSmtp}
              className="px-6 py-2.5 rounded-xl bg-[#173F30] text-white font-bold hover:bg-[#173F30]/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {savingSmtp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>설정 저장하기</span>
            </button>
          </div>
        </form>
      </div>

      {/* KakaoTalk Alimtalk Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">카카오톡 알림톡 (비즈메시지) 연동</h2>
              <p className="text-xs text-gray-500">고객 휴대전화로 공식 접수 확인 알림톡을 발송합니다.</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
            {smtpConfig.kakaoTestMode ? "샌드박스 (테스트 모드)" : "실서비스 운영 모드"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">발신 프로필 키 (Sender Profile Key)</label>
            <input
              type="text"
              value={smtpConfig.kakaoSenderKey}
              onChange={(e) => setSmtpConfig({ ...smtpConfig, kakaoSenderKey: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">승인 템플릿 코드 (Template Code)</label>
            <input
              type="text"
              readOnly
              value="INQUIRY_RECEIVED_01"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 font-mono text-[11px] text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Notification Queue Log */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">알림 발송 작업 큐 (Job Queue)</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              지수 백오프(Exponential Backoff) 재시도 로직이 적용된 백그라운드 발송 이력입니다.
            </p>
          </div>
          <button
            onClick={fetchJobs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 cursor-pointer shrink-0"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">새로고침</span>
          </button>
        </div>

        {/* 1. Mobile Cards (< sm) */}
        <div className="block sm:hidden divide-y divide-gray-100">
          {jobs.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              발송 큐 기록이 없습니다.
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-xs">
                    {job.channel === "EMAIL" ? (
                      <span className="flex items-center gap-1 text-emerald-700">
                        <Mail className="w-3.5 h-3.5" /> 이메일
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-700">
                        <MessageSquare className="w-3.5 h-3.5" /> 알림톡
                      </span>
                    )}
                  </span>
                  {renderStatusBadge(job.status)}
                </div>

                <div className="text-xs font-mono text-gray-700 truncate">{job.recipient}</div>

                {job.subject && (
                  <div className="text-xs text-gray-800 line-clamp-1">{job.subject}</div>
                )}

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-50">
                  <span>
                    재시도: {job.retryCount}/{job.maxRetries}
                  </span>
                  <span>{job.sentAt ? new Date(job.sentAt).toLocaleString("ko-KR") : "-"}</span>
                  {job.status !== "SENT" && (
                    <button
                      onClick={() => handleRetryJob(job.id)}
                      className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold"
                    >
                      재전송
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2. Structured Table (sm and up) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[660px]">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
              <tr>
                <th className="py-3 px-6">채널</th>
                <th className="py-3 px-6">수신자</th>
                <th className="py-3 px-6">내용 요약</th>
                <th className="py-3 px-6">상태</th>
                <th className="py-3 px-6">재시도</th>
                <th className="py-3 px-6">발송 시각</th>
                <th className="py-3 px-6 text-right">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    발송 큐 기록이 없습니다.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-6 font-semibold">
                      {job.channel === "EMAIL" ? (
                        <span className="flex items-center gap-1.5 text-emerald-700">
                          <Mail className="w-3.5 h-3.5" /> 이메일
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-amber-700">
                          <MessageSquare className="w-3.5 h-3.5" /> 알림톡
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-gray-700">{job.recipient}</td>
                    <td className="py-3.5 px-6 text-gray-800 max-w-xs truncate">{job.subject || "-"}</td>
                    <td className="py-3.5 px-6">{renderStatusBadge(job.status)}</td>
                    <td className="py-3.5 px-6 text-gray-500 font-mono">
                      {job.retryCount} / {job.maxRetries}
                    </td>
                    <td className="py-3.5 px-6 text-gray-500">
                      {job.sentAt ? new Date(job.sentAt).toLocaleString("ko-KR") : "-"}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      {job.status !== "SENT" && (
                        <button
                          onClick={() => handleRetryJob(job.id)}
                          className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold cursor-pointer"
                        >
                          재전송
                        </button>
                      )}
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
