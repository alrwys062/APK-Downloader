'use client';

import React from 'react';
import { X, CheckCircle2, ShieldCheck, Download, ExternalLink, Globe } from 'lucide-react';
import { SupportedLanguage, translations } from '@/lib/translations';
import { SOURCES_REGISTRY } from '@/lib/sources-registry';

interface SourceStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
}

export const SourceStatusModal: React.FC<SourceStatusModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const t = translations[currentLang];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-2xl border-2 border-cyan-400/80 bg-[#071126] shadow-[0_0_40px_rgba(6,182,212,0.35)] text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/25 flex items-center justify-between bg-[#081530]">
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>حالة المستودعات والمصادر المدعومة</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-cyan-950/50 border border-cyan-500/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sources list */}
        <div className="p-4 sm:p-6 space-y-3 max-h-[75vh] overflow-y-auto">
          {SOURCES_REGISTRY.map((source) => (
            <div
              key={source.id}
              className="p-3.5 rounded-xl border border-cyan-500/20 bg-[#091733] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{source.name}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-950/50 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>نشط ومتاح (Operational)</span>
                  </span>
                </div>
                <p className="text-slate-300/80 mt-1 leading-relaxed text-[11px]">
                  {source.description[currentLang] || source.description.en}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-cyan-300 font-mono">
                  <span>التحميل المباشر: {source.supportsDirectDownload ? 'مدعوم ✓' : 'عبر المرآة المعتمدة'}</span>
                  <span>•</span>
                  <span>التحقق من التوقيع: مدعوم ✓</span>
                </div>
              </div>

              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/50 hover:bg-cyan-900 text-cyan-300 text-xs flex items-center gap-1 transition-colors shrink-0"
              >
                <span>المستودع</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
