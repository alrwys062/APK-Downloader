'use client';

import React from 'react';
import { Bot, Activity, Globe, Sparkles } from 'lucide-react';
import { SupportedLanguage, translations } from '@/lib/translations';

interface HeaderProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenHowItWorks: () => void;
  onOpenContact: () => void;
  onOpenSourcesStatus: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenHowItWorks,
  onOpenContact,
  onOpenSourcesStatus,
}) => {
  const t = translations[currentLang];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#060b18]/90 border-b border-cyan-500/20 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Brand Logo matching screenshot */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-cyan-400 bg-gradient-to-br from-cyan-950 via-[#071328] to-[#04282e] shadow-[0_0_12px_rgba(6,182,212,0.45)]">
            <div className="flex flex-col items-center justify-center leading-none">
              <span className="text-[8px] sm:text-[10px] font-black tracking-wider text-cyan-300">APK</span>
              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 -mt-0.5" />
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-xl font-black tracking-tight text-white flex items-center gap-1 font-sans">
              APK <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">Downloader</span>
            </span>
            <span className="text-[9px] text-cyan-200/60 font-mono tracking-widest hidden sm:inline">
              MULTI-SOURCE VERIFIED REPO
            </span>
          </div>
        </div>

        {/* Right: Navigation items matching screenshot */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Active Home Tab (Styled with glowing cyan rounded pill as in screenshot) */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-3 sm:px-5 py-1 sm:py-1.5 rounded-lg border-2 border-cyan-400 bg-cyan-500/10 text-cyan-300 font-bold text-xs sm:text-sm shadow-[0_0_14px_rgba(6,182,212,0.4)] hover:bg-cyan-500/20 transition-all flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300" />
            <span>{t.navHome}</span>
          </button>

          {/* How it Works link */}
          <button
            onClick={onOpenHowItWorks}
            className="px-2 sm:px-3 py-1.5 text-slate-300 hover:text-cyan-300 font-medium text-xs sm:text-sm transition-colors hidden sm:block"
          >
            {t.navHowItWorks}
          </button>

          {/* Contact link */}
          <button
            onClick={onOpenContact}
            className="px-2 sm:px-3 py-1.5 text-slate-300 hover:text-cyan-300 font-medium text-xs sm:text-sm transition-colors hidden md:block"
          >
            {t.navContact}
          </button>

          {/* Source Status pill */}
          <button
            onClick={onOpenSourcesStatus}
            className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 text-xs font-mono hover:bg-emerald-900/30 transition-all"
            title="Operational Sources"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>6/6 {t.navSourcesStatus}</span>
            <Activity className="w-3.5 h-3.5" />
          </button>

          {/* Language Selector Dropdown / Toggle */}
          <div className="flex items-center bg-[#09152b] border border-cyan-500/30 rounded-lg p-0.5 text-[11px] sm:text-xs font-semibold">
            <Globe className="w-3 h-3 text-cyan-400 mx-1 hidden sm:block" />
            <button
              onClick={() => onLanguageChange('ar')}
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition-all ${
                currentLang === 'ar'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_6px_rgba(6,182,212,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition-all ${
                currentLang === 'en'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_6px_rgba(6,182,212,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('fr')}
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition-all ${
                currentLang === 'fr'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_6px_rgba(6,182,212,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              FR
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
