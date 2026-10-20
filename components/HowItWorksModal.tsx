'use client';

import React from 'react';
import { X, Cpu, ShieldCheck, Download, Layers, Monitor, HardDrive } from 'lucide-react';
import { SupportedLanguage, translations } from '@/lib/translations';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
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
            <span className="text-cyan-400">⚡</span>
            <span>{t.howItWorksTitle}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-cyan-950/50 border border-cyan-500/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 text-sm">
          
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-cyan-500/30 bg-[#091733]">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{t.howItWorksStep1}</h3>
              <p className="text-xs text-slate-300/80 mt-1 leading-relaxed">
                {t.howItWorksStep1Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-cyan-500/30 bg-[#091733]">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{t.howItWorksStep2}</h3>
              <p className="text-xs text-slate-300/80 mt-1 leading-relaxed">
                {t.howItWorksStep2Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-cyan-500/30 bg-[#091733]">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{t.howItWorksStep3}</h3>
              <p className="text-xs text-slate-300/80 mt-1 leading-relaxed">
                {t.howItWorksStep3Desc}
              </p>
            </div>
          </div>

          {/* Architecture & Device Guide */}
          <div className="p-4 rounded-xl border border-cyan-500/20 bg-[#060e20] space-y-3">
            <h4 className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>دليل معماريات المعالجات وتثبيت APK على أجهزة الكمبيوتر:</span>
            </h4>
            <ul className="text-xs text-slate-300/80 space-y-1.5 list-disc list-inside">
              <li><strong className="text-white">arm64-v8a:</strong> لمعظم الهواتف الحديثة التي صدرت بعد 2017.</li>
              <li><strong className="text-white">armeabi-v7a:</strong> للأجهزة القديمة 32-bit والساعات الذكية.</li>
              <li><strong className="text-white">x86_64 / x86:</strong> لمحاكيات الكمبيوتر بنظام ويندوز ومعالجات Intel/AMD.</li>
              <li><strong className="text-white">تثبيت ملفات APK على ويندوز:</strong> استخدم محاكي مثل BlueStacks أو LDPlayer أو نظام Windows Subsystem for Android (WSA). اسحب ملف APK إلى نافذة المحاكي للتثبيت الفوري.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
