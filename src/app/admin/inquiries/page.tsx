"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle,
  Clock,
  Send,
  User,
  Phone,
  Mail,
  Building,
  MapPin,
  Calendar,
  MessageSquare,
  FileText,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

function InquiriesContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");

  const [inquiries, setInquiries] = useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);

  const fetchInquiries = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (typeFilter !== "ALL") params.set("type", typeFilter);
    if (searchQuery) params.set("q", searchQuery);

    fetch(`/api/inquiries?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.inquiries) {
          setInquiries(data.inquiries);
          if (initialId && !selectedInquiry) {
            const found = data.inquiries.find((i: any) => i.id === initialId);
            if (found) setSelectedInquiry(found);
          } else if (selectedInquiry) {
            const updated = data.inquiries.find((i: any) => i.id === selectedInquiry.id);
            if (updated) setSelectedInquiry(updated);
          }
        }
      })
      .catch((err) => console.error("Error fetching inquiries:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, typeFilter]);

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedInquiry) return;
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/inquiries/${selectedInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        fetchInquiries();
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !newNote.trim()) return;

    try {
      const res = await fetch(`/api/inquiries/${selectedInquiry.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });
      if (res.ok) {
        const data = await res.json();
        const updatedNotes = [data.note, ...(selectedInquiry.notes || [])];
        setSelectedInquiry({ ...selectedInquiry, notes: updatedNotes });
        setNewNote("");
        fetchInquiries();
      }
    } catch (err) {
      console.error("Note creation error:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">신규</span>;
      case "IN_PROGRESS":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">진행중</span>;
      case "WAITING_FOR_CUSTOMER":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">회신대기</span>;
      case "COMPLETED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800">완료</span>;
      case "REJECTED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">반려</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  // Reusable Detail View Content
  const renderDetailPanel = (isMobileModal = false) => {
    if (!selectedInquiry) return null;

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">문의 관리</span>
            {getStatusBadge(selectedInquiry.status)}
          </div>
          <button
            onClick={() => setSelectedInquiry(null)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Contact Bar */}
        <div className="grid grid-cols-2 gap-2">
          {selectedInquiry.customer?.phone && (
            <a
              href={`tel:${selectedInquiry.customer.phone}`}
              className="py-2.5 px-3 rounded-xl bg-[#173F30] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#173F30]/90 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>전화 연결</span>
            </a>
          )}
          {selectedInquiry.customer?.email && (
            <a
              href={`mailto:${selectedInquiry.customer.email}`}
              className="py-2.5 px-3 rounded-xl bg-gray-100 text-gray-800 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gray-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              <span>이메일 발송</span>
            </a>
          )}
        </div>

        {/* Status Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
            진행 상태 변경
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "NEW", label: "신규" },
              { id: "IN_PROGRESS", label: "진행중" },
              { id: "WAITING_FOR_CUSTOMER", label: "회신대기" },
              { id: "COMPLETED", label: "완료" },
              { id: "REJECTED", label: "반려" },
            ].map((s) => (
              <button
                key={s.id}
                disabled={savingStatus}
                onClick={() => handleStatusChange(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedInquiry.status === s.id
                    ? "bg-[#173F30] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Details Info */}
        <div className="p-4 rounded-xl bg-gray-50 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-semibold">고객 성명</span>
            <span className="font-bold text-gray-900">{selectedInquiry.customer?.name}</span>
          </div>
          {selectedInquiry.customer?.company && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-semibold">회사명</span>
              <span className="font-bold text-gray-900">{selectedInquiry.customer.company}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-semibold">연락처</span>
            <a href={`tel:${selectedInquiry.customer?.phone}`} className="font-mono font-bold text-[#173F30] underline">
              {selectedInquiry.customer?.phone}
            </a>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-semibold">이메일</span>
            <a href={`mailto:${selectedInquiry.customer?.email}`} className="text-gray-700 underline truncate max-w-[200px]">
              {selectedInquiry.customer?.email}
            </a>
          </div>
          {selectedInquiry.serviceCategory && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-semibold">관심 서비스</span>
              <span className="font-semibold text-gray-800">{selectedInquiry.serviceCategory}</span>
            </div>
          )}
          {selectedInquiry.location && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-semibold">현장 위치</span>
              <span className="text-gray-800">{selectedInquiry.location}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-semibold">접수 일시</span>
            <span className="text-gray-700">{new Date(selectedInquiry.createdAt).toLocaleString("ko-KR")}</span>
          </div>
        </div>

        {/* Message Body */}
        <div>
          <div className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
            고객 문의 내용
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
            {selectedInquiry.message || "남기신 상세 내용이 없습니다."}
          </div>
        </div>

        {/* Internal Notes Section */}
        <div>
          <div className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
            관리자 내부 업무 메모 ({selectedInquiry.notes?.length || 0})
          </div>

          <form onSubmit={handleAddNote} className="mb-3 flex gap-2">
            <input
              type="text"
              placeholder="상담 진행 상황, 견적 전달 내역 메모"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-[#173F30] text-white text-xs font-bold hover:bg-[#173F30]/90 transition-colors shrink-0 cursor-pointer"
            >
              등록
            </button>
          </form>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {selectedInquiry.notes && selectedInquiry.notes.length > 0 ? (
              selectedInquiry.notes.map((note: any) => (
                <div key={note.id} className="p-2.5 rounded-lg bg-gray-50 text-[11px] border border-gray-100">
                  <div className="flex items-center justify-between text-gray-400 mb-1">
                    <span className="font-bold text-gray-700">{note.author?.name || "관리자"}</span>
                    <span>{new Date(note.createdAt).toLocaleTimeString("ko-KR")}</span>
                  </div>
                  <div className="text-gray-800">{note.content}</div>
                </div>
              ))
            ) : (
              <div className="text-[11px] text-gray-400 text-center py-2">
                작성된 내부 메모가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">고객 문의 & CRM 관리</h1>
        <p className="text-xs text-gray-500 mt-1">
          인입된 모든 견적 문의와 상담을 추적하고 담당자 배정 및 업무 메모를 기록합니다.
        </p>
      </div>

      {/* Filters and Search Bar (Mobile-responsive stacking) */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173F30] bg-white cursor-pointer"
          >
            <option value="ALL">전체 상태</option>
            <option value="NEW">신규</option>
            <option value="IN_PROGRESS">진행중</option>
            <option value="WAITING_FOR_CUSTOMER">회신대기</option>
            <option value="COMPLETED">완료</option>
            <option value="REJECTED">반려</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173F30] bg-white cursor-pointer"
          >
            <option value="ALL">전체 문의 구분</option>
            <option value="클리닝 견적 문의">클리닝 견적</option>
            <option value="AI 보안 카메라 & CCTV 설치 견적">AI 보안 카메라 & CCTV 설치</option>
            <option value="보안 및 시설 경비 문의">보안 및 시설 경비</option>
            <option value="기업 조경 & 펜스 시공">조경 & 펜스</option>
            <option value="기타 일반 문의">기타 문의</option>
          </select>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchInquiries();
          }}
          className="flex items-center gap-2 w-full md:w-80"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="고객명, 연락처, 회사명 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors shrink-0 cursor-pointer"
          >
            검색
          </button>
        </form>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Table for Tablets/Desktop, Cards for Small Screens */}
        <div className={`bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden ${selectedInquiry ? "lg:col-span-7" : "lg:col-span-12"}`}>
          {/* 1. Mobile Cards View (< sm) */}
          <div className="block sm:hidden divide-y divide-gray-100">
            {inquiries.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">
                검색 조건과 일치하는 문의가 없습니다.
              </div>
            ) : (
              inquiries.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className={`p-4 transition-colors cursor-pointer active:bg-gray-100 ${
                      isSelected ? "bg-emerald-50/70" : "hover:bg-gray-50"
                    }`}
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
                  </div>
                );
              })
            )}
          </div>

          {/* 2. Structured Table (sm and up) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[560px]">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">상태</th>
                  <th className="py-3 px-4">문의 구분</th>
                  <th className="py-3 px-4">고객 성명</th>
                  <th className="py-3 px-4">연락처</th>
                  <th className="py-3 px-4">접수 일시</th>
                  <th className="py-3 px-4 text-right">선택</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      검색 조건과 일치하는 문의가 없습니다.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inq) => {
                    const isSelected = selectedInquiry?.id === inq.id;
                    return (
                      <tr
                        key={inq.id}
                        onClick={() => setSelectedInquiry(inq)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-emerald-50/60" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="py-3 px-4">{getStatusBadge(inq.status)}</td>
                        <td className="py-3 px-4 font-semibold text-gray-900">{inq.inquiryType}</td>
                        <td className="py-3 px-4 font-bold text-gray-900">
                          {inq.customer?.name}
                          {inq.customer?.company && (
                            <span className="text-[10px] text-gray-400 block font-normal">
                              {inq.customer.company}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600 font-mono">{inq.customer?.phone}</td>
                        <td className="py-3 px-4 text-gray-400">
                          {new Date(inq.createdAt).toLocaleDateString("ko-KR")}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInquiry(inq);
                            }}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                              isSelected ? "bg-[#173F30] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            보기
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Desktop Detail Panel (Only on lg and up) */}
        {selectedInquiry && (
          <div className="hidden lg:block lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-md p-6 sticky top-20">
            {renderDetailPanel(false)}
          </div>
        )}
      </div>

      {/* Mobile / Tablet Full-Screen Bottom-Sheet Modal (< lg) */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 lg:hidden flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] sm:max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-4"
          >
            {renderDetailPanel(true)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminInquiriesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-400">로딩 중...</div>}>
      <InquiriesContent />
    </Suspense>
  );
}
