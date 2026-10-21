'use client';

import React, { useState } from 'react';
import { AppIcon } from './AppIcon';
import {
  X,
  Download,
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Smartphone,
  HardDrive,
  Key,
  Layers,
  Copy,
  Check,
  ExternalLink,
  Activity,
  CheckCircle2,
  AlertCircle,
  Tablet,
  Tv,
  Monitor
} from 'lucide-react';
import { SupportedLanguage, translations } from '@/lib/translations';
import { ApkItem } from '@/lib/types';

interface AppDetailModalProps {
  app: ApkItem | null;
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
  onDownload: (url: string, filename: string) => void;
}

interface InspectionResult {
  isReachable: boolean;
  httpStatus: number;
  formattedSize: string;
  sizeBytes: number | null;
  contentType: string;
  latencyMs: number;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  isOpen,
  onClose,
  currentLang,
  onDownload,
}) => {
  const t = translations[currentLang];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<InspectionResult | null>(null);

  if (!isOpen || !app) return null;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleInspectUrl = async (urlToInspect: string) => {
    setIsInspecting(true);
    setInspectionResult(null);
    try {
      const res = await fetch('/api/apk/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToInspect })
      });
      const data = await res.json();
      if (data.success) {
        setInspectionResult({
          isReachable: data.isReachable,
          httpStatus: data.httpStatus,
          formattedSize: data.formattedSize,
          sizeBytes: data.sizeBytes,
          contentType: data.contentType,
          latencyMs: data.latencyMs
        });
      }
    } catch (e) {
      console.error('Inspection error:', e);
    } finally {
      setIsInspecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-2xl border-2 border-cyan-400/80 bg-[#071126] shadow-[0_0_40px_rgba(6,182,212,0.35)] text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with neon glow */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/25 flex items-center justify-between bg-[#081530]">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-cyan-400 bg-slate-900 shrink-0 shadow-md">
              <AppIcon src={app.iconUrl} alt={app.title} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">{app.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{app.developer}</span>
                <span>•</span>
                <span className="text-cyan-400 font-mono">{app.packageName}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-cyan-950/50 border border-cyan-500/20 transition-all"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Security & Authenticity Banner */}
          {app.isOfficial ? (
            <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-emerald-300 block">{t.officialBadge}</span>
                <span className="text-emerald-200/80">{app.securityStatus.details}</span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-amber-500/50 bg-amber-950/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-300 block">{t.modBadge}</span>
                <span className="text-amber-200/90 leading-relaxed">{t.modWarning}</span>
                {app.modFeatures && (
                  <ul className="mt-2 list-disc list-inside text-amber-200/70 space-y-0.5">
                    {app.modFeatures.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            
            <div className="bg-[#091733] border border-cyan-500/20 rounded-xl p-3">
              <span className="text-slate-400 block text-[10px]">{t.version}:</span>
              <span className="font-bold text-white block mt-0.5 font-mono">{app.version}</span>
              <span className="text-[10px] text-cyan-400 font-mono">Code: {app.versionCode}</span>
            </div>

            <div className="bg-[#091733] border border-cyan-500/20 rounded-xl p-3">
              <span className="text-slate-400 block text-[10px]">{t.fileSize}:</span>
              <span className="font-bold text-cyan-300 block mt-0.5 font-mono">{app.formattedSize || t.unknownSize}</span>
              <span className="text-[10px] text-slate-400">Content-Length verified</span>
            </div>

            <div className="bg-[#091733] border border-cyan-500/20 rounded-xl p-3">
              <span className="text-slate-400 block text-[10px]">{t.minAndroid}:</span>
              <span className="font-bold text-white block mt-0.5">{app.minAndroidVersion}</span>
              <span className="text-[10px] text-cyan-400 font-mono">Min SDK {app.minSdk}</span>
            </div>

            <div className="bg-[#091733] border border-cyan-500/20 rounded-xl p-3">
              <span className="text-slate-400 block text-[10px]">{t.category}:</span>
              <span className="font-bold text-white block mt-0.5">{app.category}</span>
            </div>

            <div className="bg-[#091733] border border-cyan-500/20 rounded-xl p-3">
              <span className="text-slate-400 block text-[10px]">{t.releaseDate}:</span>
              <span className="font-bold text-white block mt-0.5 font-mono">{app.updateDate}</span>
            </div>

            <div className="bg-[#091733] border border-cyan-500/20 rounded-xl p-3">
              <span className="text-slate-400 block text-[10px]">{t.sourceFilter}:</span>
              <span className="font-bold text-cyan-300 block mt-0.5 uppercase font-mono">{app.source}</span>
            </div>

          </div>

          {/* CPU Architecture Compatibility Matrix */}
          <div className="bg-[#091733] border border-cyan-500/20 rounded-xl p-4">
            <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mb-2.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>{t.supportedCpu}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {['arm64-v8a', 'armeabi-v7a', 'x86_64', 'x86', 'universal'].map((arch) => {
                const isSupported = app.architectures.includes(arch as any) || app.architectures.includes('universal');
                return (
                  <div
                    key={arch}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 ${
                      isSupported
                        ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                        : 'border-slate-800 bg-slate-900/40 text-slate-500 opacity-60'
                    }`}
                  >
                    {isSupported ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    <span>{arch}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Target Device Suitability */}
          <div className="bg-[#091733] border border-cyan-500/20 rounded-xl p-4">
            <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mb-2.5">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>{t.deviceSuitability}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              
              <div className={`p-2 rounded-lg border flex items-center gap-2 ${app.deviceCompatibility.phone ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-200' : 'border-slate-800 text-slate-500'}`}>
                <Smartphone className="w-4 h-4" />
                <span>{t.devicePhone}</span>
              </div>

              <div className={`p-2 rounded-lg border flex items-center gap-2 ${app.deviceCompatibility.tablet ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-200' : 'border-slate-800 text-slate-500'}`}>
                <Tablet className="w-4 h-4" />
                <span>{t.deviceTablet}</span>
              </div>

              <div className={`p-2 rounded-lg border flex items-center gap-2 ${app.deviceCompatibility.tv ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-200' : 'border-slate-800 text-slate-500'}`}>
                <Tv className="w-4 h-4" />
                <span>{t.deviceTV}</span>
              </div>

              <div className={`p-2 rounded-lg border flex items-center gap-2 ${app.deviceCompatibility.pcEmulator ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-200' : 'border-slate-800 text-slate-500'}`}>
                <Monitor className="w-4 h-4" />
                <span>{t.devicePC}</span>
              </div>

            </div>
            {app.deviceCompatibility.note && (
              <p className="mt-2 text-[11px] text-slate-400">
                {app.deviceCompatibility.note}
              </p>
            )}
          </div>

          {/* Cryptographic SHA-256 Checksum */}
          {app.sha256 && (
            <div className="bg-[#091733] border border-cyan-500/20 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
              <div className="truncate mr-2">
                <span className="text-slate-400 text-[10px] block font-sans">{t.sha256Checksum}:</span>
                <span className="text-cyan-300 truncate block">{app.sha256}</span>
              </div>
              <button
                type="button"
                onClick={() => copyText(app.sha256!, 'sha256')}
                className="px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 text-xs transition-colors shrink-0 flex items-center gap-1"
              >
                {copiedKey === 'sha256' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ</span>
              </button>
            </div>
          )}

          {/* Live HTTP Headers & Size Inspection Tool */}
          <div className="bg-[#08152e] border border-cyan-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>{t.inspectFile}</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  يقوم الخادم بالاتصال المباشر برابط التحميل وفحص ترويسات Content-Length والتأكد من توافر الملف دون تنزيل وهمي.
                </p>
              </div>
              <button
                onClick={() => handleInspectUrl(app.downloadUrl || app.sourceUrl)}
                disabled={isInspecting}
                className="px-3.5 py-1.5 rounded-lg border border-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs transition-all shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.3)] disabled:opacity-50"
              >
                {isInspecting ? t.inspecting : 'فحص الرابط الآن'}
              </button>
            </div>

            {inspectionResult && (
              <div className="mt-3 p-3 rounded-lg bg-[#050e21] border border-cyan-500/20 text-xs font-mono space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">حالة الخادم (HTTP Status):</span>
                  <span className={inspectionResult.isReachable ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {inspectionResult.httpStatus} {inspectionResult.isReachable ? '✓ صالح وجاهز' : '✗ غير متاح'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">الحجم الفعلي المؤكد:</span>
                  <span className="text-cyan-300 font-bold">{inspectionResult.formattedSize}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">نوع المحتوى (MIME):</span>
                  <span className="text-slate-300">{inspectionResult.contentType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">سرعة الاستجابة (Latency):</span>
                  <span className="text-slate-300">{inspectionResult.latencyMs} ms</span>
                </div>
              </div>
            )}
          </div>

          {/* Download Mirrors Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
              {t.downloadOptions}:
            </h4>

            {/* Direct Official Download */}
            {app.downloadUrl && (
              <div className="p-3 rounded-xl border border-cyan-400/60 bg-gradient-to-r from-cyan-950/60 to-blue-950/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {app.verifiedDirectDownload ? t.directDownload : t.mirrorDownload}
                    </span>
                    <span className="text-[11px] text-cyan-300 font-mono">
                      {app.formattedSize} • {app.version}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (app.verifiedDirectDownload) {
                      const ext = app.fileFormat === 'xapk' ? 'xapk' : 'apk';
                      onDownload(app.downloadUrl!, `${app.packageName}_v${app.version}.${ext}`);
                    } else {
                      window.open(app.downloadUrl, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="px-5 py-2 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {app.verifiedDirectDownload
                      ? app.fileFormat === 'xapk'
                        ? 'تحميل مباشر (XAPK)'
                        : 'تحميل مباشر (APK)'
                      : 'فتح صفحة المصدر'}
                  </span>
                </button>
              </div>
            )}

            {/* Additional Mirrors */}
            {app.mirrors && app.mirrors.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {app.mirrors.map((mirror, idx) => (
                  <a
                    key={idx}
                    href={mirror.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-cyan-500/20 bg-[#09152b] hover:bg-cyan-950/40 text-xs flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-white uppercase block">{mirror.source}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{mirror.size}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-1">وصف التطبيق:</h4>
            <p className="text-xs text-slate-300/80 leading-relaxed bg-[#081224] p-3 rounded-xl border border-cyan-500/10">
              {app.description}
            </p>
          </div>

          {/* Permissions List */}
          {app.permissions && app.permissions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.permissionsCount} ({app.permissions.length}):</span>
              </h4>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-[#081224] rounded-xl border border-cyan-500/10">
                {app.permissions.map((perm, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20 text-cyan-200"
                  >
                    {perm.replace('android.permission.', '')}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
