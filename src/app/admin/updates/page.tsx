"use client";

import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  GitBranch,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  ArrowUpCircle,
  RotateCcw,
  Shield,
  Server,
  Database,
  Calendar,
  Clock,
  ExternalLink,
  Save,
  Trash2,
  PlusCircle,
  HelpCircle,
  Layers,
  Terminal,
} from "lucide-react";
import { RestorePoint, UpdateSettings, SystemUpdateInfo } from "@/lib/types/updates";

export default function AdminUpdatesPage() {
  const [updateInfo, setUpdateInfo] = useState<SystemUpdateInfo | null>(null);
  const [checking, setChecking] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyResult, setApplyResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [snapshots, setSnapshots] = useState<RestorePoint[]>([]);
  const [loadingSnapshots, setLoadingSnapshots] = useState(true);
  const [creatingSnapshot, setCreatingSnapshot] = useState(false);
  const [newSnapshotNote, setNewSnapshotNote] = useState("");
  const [rollingBackId, setRollingBackId] = useState<string | null>(null);

  const [settings, setSettings] = useState<UpdateSettings>({
    coolifyWebhookUrl: "",
    gitRepo: "ladoxx/Kokkiri-V1",
    branch: "main",
    autoBackupBeforeUpdate: true,
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Load initial status & snapshots
  const loadUpdateInfo = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/admin/updates/check");
      const data = await res.json();
      if (data.success) {
        setUpdateInfo(data);
      }
    } catch (err) {
      console.error("Failed to check updates:", err);
    } finally {
      setChecking(false);
    }
  };

  const loadSnapshots = async () => {
    setLoadingSnapshots(true);
    try {
      const res = await fetch("/api/admin/updates/snapshots");
      const data = await res.json();
      if (data.success && Array.isArray(data.snapshots)) {
        setSnapshots(data.snapshots);
      }
    } catch (err) {
      console.error("Failed to load snapshots:", err);
    } finally {
      setLoadingSnapshots(false);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/updates/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error("Failed to load update settings:", err);
    }
  };

  useEffect(() => {
    loadUpdateInfo();
    loadSnapshots();
    loadSettings();
  }, []);

  // Actions
  const handleApplyUpdate = async () => {
    if (!confirm("Sistemi yeni sürüme güncellemek istediğinizden emin misiniz?\nİşlem öncesi otomatik tam veri ve sistem yedeği oluşturulacaktır.")) {
      return;
    }
    setApplying(true);
    setApplyResult(null);
    try {
      const res = await fetch("/api/admin/updates/apply", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setApplyResult({
          type: "success",
          message: data.message || "Güncelleme başarıyla uygulandı!",
        });
        await loadUpdateInfo();
        await loadSnapshots();
      } else {
        setApplyResult({
          type: "error",
          message: data.error || data.message || "Güncelleme uygulanamadı.",
        });
      }
    } catch (err: any) {
      setApplyResult({
        type: "error",
        message: err.message || "İşlem sırasında bağlantı hatası oluştu.",
      });
    } finally {
      setApplying(false);
    }
  };

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingSnapshot(true);
    try {
      const res = await fetch("/api/admin/updates/snapshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: newSnapshotNote || "Yönetici Manuel Sistem Yedeği" }),
      });
      const data = await res.json();
      if (data.success) {
        setNewSnapshotNote("");
        await loadSnapshots();
      } else {
        alert(data.error || "Yedek oluşturulamadı.");
      }
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setCreatingSnapshot(false);
    }
  };

  const handleRollback = async (snapshot: RestorePoint) => {
    const confirmMsg =
      `DİKKAT: Sistemi '${snapshot.commitHash}' (${new Date(snapshot.createdAt).toLocaleString("tr-TR")}) sürümüne ve o anki veri durumuna geri yüklemek üzeresiniz.\n\n` +
      `Geri alma öncesinde mevcut durumunuzun da bir güvenlik yedeği otomatik alınacaktır.\n\nDevam etmek istiyor musunuz?`;

    if (!confirm(confirmMsg)) return;

    setRollingBackId(snapshot.id);
    setApplyResult(null);
    try {
      const res = await fetch("/api/admin/updates/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snapshotId: snapshot.id }),
      });
      const data = await res.json();
      if (data.success) {
        setApplyResult({
          type: "success",
          message: data.message || "Sistem başarıyla eski sürüme geri döndürüldü!",
        });
        await loadUpdateInfo();
        await loadSnapshots();
      } else {
        setApplyResult({
          type: "error",
          message: data.error || "Geri alma işlemi başarısız oldu.",
        });
      }
    } catch (err: any) {
      setApplyResult({
        type: "error",
        message: "Bağlantı hatası: " + err.message,
      });
    } finally {
      setRollingBackId(null);
    }
  };

  const handleDeleteSnapshot = async (id: string) => {
    if (!confirm("Bu geri yükleme noktasını ve ilişkili disk yedeğini silmek istediğinizden emin misiniz?")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/updates/snapshots?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setSnapshots((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.error || "Silme başarısız.");
      }
    } catch (err: any) {
      alert("Hata: " + err.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSaved(false);
    try {
      const res = await fetch("/api/admin/updates/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save update settings:", err);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173F30]/10 text-[#173F30] text-[11px] font-bold mb-2">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sistem Güncelleme & Sürüm Yönetimi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Güncelleme & Güvenli Geri Alma (Rollback)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Tek tıkla yeni sürümleri yükleyin, otomatik sistem yedeği alın ve olası bir problemde eski sürümlere anında geri dönün.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadUpdateInfo}
            disabled={checking}
            className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all flex items-center gap-2 shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin text-[#173F30]" : ""}`} />
            <span>{checking ? "Kontrol Ediliyor..." : "Güncellemeleri Denetle"}</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {applyResult && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 ${
            applyResult.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {applyResult.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{applyResult.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setApplyResult(null)}
            className="text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
          >
            Kapat
          </button>
        </div>
      )}

      {/* SECTION 1: HERO UPDATE STATUS BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-gray-200/80 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-gray-100 pb-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                updateInfo?.hasUpdate
                  ? "bg-amber-100 text-amber-700"
                  : "bg-[#173F30]/10 text-[#173F30]"
              }`}
            >
              {updateInfo?.hasUpdate ? (
                <ArrowUpCircle className="w-6 h-6 animate-bounce" />
              ) : (
                <CheckCircle2 className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-black text-base text-gray-900">
                  {updateInfo?.hasUpdate ? "Yeni Bir Güncelleme Mevcut!" : "Sisteminiz En Son Sürümde"}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  v{updateInfo?.currentVersion || "1.0.1"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gray-100 text-gray-700">
                  #{updateInfo?.currentCommit || "8f0c03b"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {updateInfo?.hasUpdate
                  ? "GitHub üzerinde sitenize uygulanabilecek yeni kod ve geliştirmeler tespit edildi."
                  : "Web siteniz GitHub üzerindeki en son kararlı sürümle birebir eşleşiyor. Tüm sistem sağlıklı."}
              </p>
            </div>
          </div>

          <div>
            {updateInfo?.hasUpdate ? (
              <button
                type="button"
                onClick={handleApplyUpdate}
                disabled={applying}
                className="w-full md:w-auto px-6 py-3 rounded-2xl bg-[#173F30] hover:bg-[#173F30]/90 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {applying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUpCircle className="w-4 h-4" />
                )}
                <span>{applying ? "Güncelleme Uygulanıyor..." : "Şimdi Güncelle (Tek Tıkla)"}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApplyUpdate}
                disabled={applying}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${applying ? "animate-spin" : ""}`} />
                <span>Yeniden Eşitle / Zorla Güncelle</span>
              </button>
            )}
          </div>
        </div>

        {/* Remote Update Details if Available */}
        {updateInfo?.hasUpdate && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-amber-700" />
                <span>Yeni Sürüm Değişiklik Notu:</span>
              </span>
              <span className="font-mono text-[11px] bg-amber-200/60 px-2 py-0.5 rounded">
                #{updateInfo.remoteCommit}
              </span>
            </div>
            <p className="text-xs font-semibold text-amber-950 font-mono bg-white/70 p-3 rounded-xl border border-amber-200/50">
              {updateInfo.remoteCommitMessage || "Yeni güncellemeler ve iyileştirmeler"}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-amber-800">
              <span>Geliştirici: {updateInfo.remoteAuthor || "Kokkiri Core Team"}</span>
              <span>
                {updateInfo.remoteCommitDate
                  ? new Date(updateInfo.remoteCommitDate).toLocaleString("tr-TR")
                  : ""}
              </span>
            </div>
          </div>
        )}

        {/* System & Git Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/70">
            <div className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5 mb-1">
              <GitBranch className="w-3.5 h-3.5" />
              <span>Git Dalı (Branch)</span>
            </div>
            <div className="text-xs font-extrabold text-gray-800 font-mono">
              {updateInfo?.branch || "main"}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/70">
            <div className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5 mb-1">
              <GitCommit className="w-3.5 h-3.5" />
              <span>Aktif Commit</span>
            </div>
            <div className="text-xs font-extrabold text-gray-800 font-mono">
              #{updateInfo?.currentCommit || "8f0c03b"}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/70">
            <div className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5 mb-1">
              <Server className="w-3.5 h-3.5" />
              <span>Coolify Dağıtım</span>
            </div>
            <div className="text-xs font-extrabold text-gray-800">
              {updateInfo?.isCoolifyConfigured ? (
                <span className="text-emerald-700 font-bold">Webhook Bağlı</span>
              ) : (
                <span className="text-gray-500">Doğrudan Git</span>
              )}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/70">
            <div className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5 mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Güvenlik Yedeği</span>
            </div>
            <div className="text-xs font-extrabold text-emerald-700">
              Otomatik Aktif
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: RESTORE POINTS & ROLLBACK (GERİ YÜKLEME NOKTALARI) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-gray-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#173F30]" />
              <span>Geri Yükleme Noktaları (Rollback Snapshots)</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Her güncelleme öncesi verileriniz otomatik yedeklenir. İstediğiniz zaman önceki bir sürüme ve veri durumuna tek tıkla dönebilirsiniz.
            </p>
          </div>

          {/* Quick Create Snapshot Form */}
          <form onSubmit={handleCreateSnapshot} className="flex items-center gap-2 self-start sm:self-auto">
            <input
              type="text"
              value={newSnapshotNote}
              onChange={(e) => setNewSnapshotNote(e.target.value)}
              placeholder="Yedek açıklama notu..."
              className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs w-44 sm:w-56 focus:outline-none focus:ring-2 focus:ring-[#173F30]"
            />
            <button
              type="submit"
              disabled={creatingSnapshot}
              className="px-3.5 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{creatingSnapshot ? "Alınıyor..." : "Manuel Yedek Al"}</span>
            </button>
          </form>
        </div>

        {/* Snapshots List */}
        {loadingSnapshots ? (
          <div className="py-8 text-center text-xs text-gray-400">
            Geri yükleme noktaları yükleniyor...
          </div>
        ) : snapshots.length === 0 ? (
          <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-2xl space-y-2">
            <Database className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs font-bold text-gray-600">Henüz kayıtlı bir geri yükleme noktası yok.</p>
            <p className="text-[11px] text-gray-400">
              Yukarıdaki butona tıklayarak ilk manuel sistem yedeğinizi hemen oluşturabilirsiniz.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {snapshots.map((snap) => {
              const isRollingBack = rollingBackId === snap.id;
              const dateStr = new Date(snap.createdAt).toLocaleString("tr-TR", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={snap.id}
                  className="p-4 sm:p-5 rounded-2xl border border-gray-200 hover:border-gray-300 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-xs text-gray-900 font-mono">
                        #{snap.commitHash}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-gray-700 border border-gray-200">
                        v{snap.version}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          snap.type === "automatic_pre_update"
                            ? "bg-amber-100 text-amber-800"
                            : snap.type === "rollback"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {snap.type === "automatic_pre_update"
                          ? "Güncelleme Öncesi Otomatik"
                          : snap.type === "rollback"
                          ? "Geri Alma Öncesi"
                          : "Manuel Yedek"}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{dateStr}</span>
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-gray-700 break-words">
                      {snap.note}
                    </p>

                    <div className="text-[10px] text-gray-400 flex items-center gap-3">
                      <span>Yedeklenen Dosya Sayısı: {snap.filesCount} adet (CMS + SQLite)</span>
                      <span>•</span>
                      <span className="font-mono text-[9px]">{snap.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleRollback(snap)}
                      disabled={isRollingBack}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 text-amber-600 ${isRollingBack ? "animate-spin" : ""}`} />
                      <span>{isRollingBack ? "Geri Yükleniyor..." : "Bu Sürüme Geri Dön"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSnapshot(snap.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Yedeği Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 3: COOLIFY & GITHUB SETTINGS */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-gray-200/80 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-[#173F30]" />
            <span>Coolify & Dağıtım Entegrasyonu</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Coolify veya Docker üzerinde çalışırken zero-downtime otomatik güncelleme tetikleyicilerini yapılandırın.
          </p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Coolify Deploy Webhook URL (İsteğe Bağlı)
            </label>
            <input
              type="url"
              value={settings.coolifyWebhookUrl}
              onChange={(e) => setSettings({ ...settings, coolifyWebhookUrl: e.target.value })}
              placeholder="https://coolify.yourdomain.com/api/v1/deploy?uuid=..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#173F30]"
            />
            <p className="text-[11px] text-gray-500 mt-1.5">
              Coolify panelinde uygulamanızın <strong>"Webhooks"</strong> sekmesinde bulunan Deploy URL adresidir. Buraya girdiğinizde &quot;Şimdi Güncelle&quot; butonuna bastığınız an Coolify yeni Docker konteynerinizi sıfır kesintiyle derler ve yayına alır.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                GitHub Deposu (Repository)
              </label>
              <input
                type="text"
                value={settings.gitRepo}
                onChange={(e) => setSettings({ ...settings, gitRepo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#173F30]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                İzlenen Dal (Branch)
              </label>
              <input
                type="text"
                value={settings.branch}
                onChange={(e) => setSettings({ ...settings, branch: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#173F30]"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={settings.autoBackupBeforeUpdate}
                onChange={(e) =>
                  setSettings({ ...settings, autoBackupBeforeUpdate: e.target.checked })
                }
                className="w-4 h-4 rounded text-[#173F30] focus:ring-[#173F30] cursor-pointer"
              />
              <span className="text-xs font-bold text-gray-800 group-hover:text-[#173F30]">
                Her güncelleme öncesinde otomatik geri yükleme noktası oluştur (Tavsiye edilir)
              </span>
            </label>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <a
              href="https://github.com/ladoxx/Kokkiri-V1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 font-semibold"
            >
              <span>GitHub Deposunu Aç</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="submit"
              disabled={savingSettings}
              className="px-6 py-2.5 rounded-xl bg-[#173F30] hover:bg-[#173F30]/90 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-2xs"
            >
              {savingSettings ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : settingsSaved ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{settingsSaved ? "Kaydedildi!" : "Entegrasyon Ayarlarını Kaydet"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
