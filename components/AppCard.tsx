'use client';

import React, { useState } from 'react';
import {
  Download,
  Info,
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Layers,
  Copy,
  Check,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { SupportedLanguage, translations } from '@/lib/translations';
import { ApkItem } from '@/lib/types';

import { AppIcon } from './AppIcon';

interface AppCardProps {
  app: ApkItem;
  currentLang: SupportedLanguage;
  onOpenDetails: (app: ApkItem) => void;
  onDownloadDirect: (app: ApkItem) => void;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  currentLang,
  onOpenDetails,
  onDownloadDirect,
}) => {
  const t = translations[currentLang];
  const [copied, setCopied] = useState(false);

  const copyPackageName = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(app.packageName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSourceBadgeStyle = (source: string) => {
    switch (source) {
      case 'googleplay':
        return 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40';
      case 'fdroid':
        return 'border-sky-500/40 text-sky-300 bg-sky-950/40';
      case 'apkpure':
        return 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40';
      case 'apkcombo':
        return 'border-teal-500/40 text-teal-300 bg-teal-950/40';
      case 'aptoide':
        return 'border-orange-500/40 text-orange-300 bg-orange-950/40';
      case 'apkmirror':
        return 'border-amber-500/40 text-amber-300 bg-amber-950/40';
      case 'apkfab':
        return 'border-purple-500/40 text-purple-300 bg-purple-950/40';
      case 'uptodown':
        return 'border-blue-500/40 text-blue-300 bg-blue-950/40';
      case 'apkba':
        return 'border-indigo-500/40 text-indigo-300 bg-indigo-950/40';
      default:
        return 'border-slate-500/40 text-slate-300 bg-slate-900/40';
    }
  };

  return (
    <div className="group relative rounded-xl sm:rounded-2xl border border-cyan-500/25 bg-[#081226]/85 backdrop-blur-sm p-3.5 sm:p-5 transition-all hover:border-cyan-400/80 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] flex flex-col justify-between">
      
      {/* Top Section: Icon, Titles, Badges */}
      <div>
        <div className="flex items-start gap-3 sm:gap-3.5">
          
          {/* App Icon */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#060c1d] shrink-0 shadow-md">
            <AppIcon src={app.iconUrl} alt={app.title} />
          </div>

          {/* Title & Metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Official vs MOD status */}
              {app.isOfficial ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{t.officialBadge}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>{t.modBadge}</span>
                </span>
              )}

              {/* Source Repository Badge */}
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${getSourceBadgeStyle(app.source)}`}>
                {app.source}
              </span>

              {/* Format Badge (APK / XAPK) */}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300">
                {app.fileFormat.toUpperCase()}
              </span>

            </div>

            <h3 className="mt-1 text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
              {app.title}
            </h3>

            <p className="text-xs text-slate-400 truncate">
              {app.developer}
            </p>

            {/* Package ID with copy */}
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-cyan-400/80 font-mono">
              <span className="truncate">{app.packageName}</span>
              <button
                type="button"
                onClick={copyPackageName}
                className="hover:text-white p-0.5 transition-colors"
                title="Copy package ID"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

          </div>

        </div>

        {/* Technical Attributes Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-t border-cyan-500/15 pt-3">
          
          <div className="bg-[#09152d]/60 rounded-lg p-2 border border-cyan-500/10">
            <span className="text-slate-400 block text-[10px]">{t.version}:</span>
            <span className="font-semibold text-white truncate block">{app.version}</span>
          </div>

          <div className="bg-[#09152d]/60 rounded-lg p-2 border border-cyan-500/10">
            <span className="text-slate-400 block text-[10px]">{t.size}:</span>
            <span className="font-semibold text-cyan-300 truncate block">
              {app.formattedSize || t.unknownSize}
            </span>
          </div>

          <div className="bg-[#09152d]/60 rounded-lg p-2 border border-cyan-500/10 col-span-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px]">{app.minAndroidVersion.split('(')[0]}</span>
            </div>
            
            {/* Architecture Pills */}
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              {app.architectures.slice(0, 2).map((arch) => (
                <span key={arch} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                  {arch}
                </span>
              ))}
              {app.architectures.length > 2 && (
                <span className="text-[10px] font-mono text-slate-400">
                  +{app.architectures.length - 2}
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Short description */}
        <p className="mt-3 text-xs text-slate-300/80 line-clamp-2 leading-relaxed">
          {app.description}
        </p>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-4 pt-3 border-t border-cyan-500/15 flex items-center gap-2">
        
        {/* Primary Download Button */}
        <button
          onClick={() => onDownloadDirect(app)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>
            {app.verifiedDirectDownload
              ? app.fileFormat === 'xapk'
                ? 'تحميل مباشر (XAPK)'
                : 'تحميل مباشر (APK)'
              : app.source === 'googleplay'
              ? 'صفحة Google Play'
              : `تحميل عبر ${app.source.toUpperCase()}`}
          </span>
        </button>

        {/* Details Button */}
        <button
          onClick={() => onOpenDetails(app)}
          className="px-3 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 font-semibold text-xs transition-colors flex items-center gap-1"
          title={t.viewDetails}
        >
          <Info className="w-4 h-4" />
          <span className="hidden sm:inline">{t.viewDetails}</span>
        </button>

        {/* External direct link */}
        <a
          href={app.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl border border-cyan-500/30 bg-[#09152b] hover:bg-cyan-950 text-slate-300 hover:text-white transition-colors"
          title="Visit source page"
        >
          <ExternalLink className="w-4 h-4" />
        </a>

      </div>

    </div>
  );
};
