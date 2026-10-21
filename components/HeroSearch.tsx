'use client';

import React, { useState } from 'react';
import {
  Download,
  Search,
  Settings2,
  ChevronDown,
  X,
  ShieldCheck,
  Cpu,
  Smartphone,
  Layers,
  Sparkles,
  AlertTriangle,
  Monitor,
  Tv,
  Tablet,
  Check
} from 'lucide-react';
import { SupportedLanguage, translations } from '@/lib/translations';
import {
  ApkSource,
  CpuArchitecture,
  DeviceType,
  FileFormat,
  SearchFilters,
  SourceType
} from '@/lib/types';

interface HeroSearchProps {
  currentLang: SupportedLanguage;
  filters: SearchFilters;
  onFilterChange: (newFilters: Partial<SearchFilters>) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  currentLang,
  filters,
  onFilterChange,
  onSearch,
  isLoading,
}) => {
  const t = translations[currentLang];
  const [activeDropdown, setActiveDropdown] = useState<'arch' | 'android' | 'format' | null>(null);

  const architecturesList: { id: CpuArchitecture; label: string; desc: string }[] = [
    { id: 'arm64-v8a', label: 'ARM 64-bit (arm64-v8a)', desc: 'الأجهزة الحديثة (أندرويد 8+)' },
    { id: 'armeabi-v7a', label: 'ARM 32-bit (armeabi-v7a)', desc: 'الأجهزة القديمة والساعات' },
    { id: 'x86_64', label: 'x86_64 64-bit', desc: 'محاكيات الكمبيوتر وأجهزة Intel 64' },
    { id: 'x86', label: 'x86 32-bit', desc: 'معالجات Intel 32 القديمة' },
    { id: 'universal', label: 'Universal (شامل)', desc: 'يعمل على أي معالج' }
  ];

  const androidVersionsList = [
    { api: '', label: t.allAndroid },
    { api: '35', label: 'Android 15 (Vanilla Ice Cream, API 35)' },
    { api: '34', label: 'Android 14 (Upside Down Cake, API 34)' },
    { api: '33', label: 'Android 13 (Tiramisu, API 33)' },
    { api: '31', label: 'Android 12 / 12L (Snow Cone, API 31/32)' },
    { api: '30', label: 'Android 11 (Red Velvet, API 30)' },
    { api: '29', label: 'Android 10 (Quince Tart, API 29)' },
    { api: '28', label: 'Android 9.0 (Pie, API 28)' },
    { api: '26', label: 'Android 8.0 (Oreo, API 26)' },
    { api: '24', label: 'Android 7.0 (Nougat, API 24)' },
    { api: '21', label: 'Android 5.0 (Lollipop, API 21)' },
  ];

  const formatList: { id: FileFormat | 'all'; label: string; ext: string }[] = [
    { id: 'all', label: t.allFormats, ext: 'All' },
    { id: 'apk', label: 'Standalone APK', ext: '.apk' },
    { id: 'xapk', label: 'XAPK Package (OBB+Splits)', ext: '.xapk' },
    { id: 'split', label: 'Split APKs', ext: '.apks' },
    { id: 'bundle', label: 'Android App Bundle', ext: '.aab' },
  ];

  const sourcesList: { id: ApkSource | 'all'; label: string }[] = [
    { id: 'all', label: t.allSources },
    { id: 'googleplay', label: 'Google Play' },
    { id: 'apkpure', label: 'APKPure' },
    { id: 'apkcombo', label: 'APKCombo' },
    { id: 'aptoide', label: 'Aptoide' },
    { id: 'apkmirror', label: 'APKMirror' },
    { id: 'apkfab', label: 'APKFab' },
    { id: 'uptodown', label: 'Uptodown' },
    { id: 'fdroid', label: 'F-Droid' },
    { id: 'apksupport', label: 'APKSupport' },
    { id: 'taptap', label: 'TapTap' },
    { id: 'apkmonk', label: 'APKMonk' },
    { id: 'aurora', label: 'Aurora Store' },
    { id: 'softpedia', label: 'Softpedia' },
    { id: 'apkba', label: 'APKBA' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (text) {
      onFilterChange({ query: text });
      if (text.includes('play.google.com') || text.includes('id=') || (text.includes('.') && !text.includes(' '))) {
        setTimeout(() => {
          onSearch();
        }, 100);
      }
    }
  };

  const toggleArch = (arch: CpuArchitecture) => {
    if (arch === 'universal') {
      onFilterChange({ architectures: [] });
      return;
    }
    const current = [...filters.architectures];
    const index = current.indexOf(arch);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(arch);
    }
    onFilterChange({ architectures: current });
  };

  const getArchLabel = () => {
    if (filters.architectures.length === 0) return t.selectArch;
    if (filters.architectures.length === 1) return filters.architectures[0];
    return `${filters.architectures.length} معماريات مختارة`;
  };

  const getAndroidLabel = () => {
    if (!filters.androidVersion || filters.androidVersion === 'all') return t.selectAndroid;
    const item = androidVersionsList.find(v => v.api === filters.androidVersion);
    return item ? item.label.split('(')[0] : t.selectAndroid;
  };

  const getFormatLabel = () => {
    if (!filters.format || filters.format === 'all') return t.selectFormat;
    const item = formatList.find(f => f.id === filters.format);
    return item ? item.label : t.selectFormat;
  };

  return (
    <section className="relative pt-4 sm:pt-8 pb-6 sm:pb-12 px-3 sm:px-6 lg:px-8 overflow-hidden w-full">
      
      {/* Background Cyber Glow & Geometric Lines matching screenshot */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[250px] bg-blue-600/10 blur-[100px] rounded-full" />
        
        {/* Curved fiber circuit lines matching screenshot */}
        <svg className="absolute w-full h-full opacity-40" preserveAspectRatio="none" viewBox="0 0 1200 600">
          <defs>
            <linearGradient id="cyanLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0099ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="amberLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M 0,450 C 300,420 500,480 1200,320" stroke="url(#cyanLineGrad)" strokeWidth="2.5" fill="none" />
          <path d="M 0,480 C 400,450 650,560 1200,380" stroke="url(#cyanLineGrad)" strokeWidth="1.5" fill="none" />
          <path d="M 1200,430 C 800,420 600,520 0,550" stroke="url(#amberLineGrad)" strokeWidth="1.5" fill="none" />
        </svg>

        {/* Ambient Matrix Grid floating dots */}
        <div className="absolute top-12 left-10 text-cyan-400/20 text-xs font-mono select-none leading-relaxed hidden lg:block">
          <div>0 1 5 3 1</div>
          <div>3 0 2 1 5</div>
          <div>1 0 2 1 9</div>
        </div>
        <div className="absolute top-12 right-12 text-cyan-400/20 text-xs font-mono select-none leading-relaxed hidden lg:block">
          <div>1 9 3 9 4</div>
          <div>5 8 0 0 2</div>
          <div>1 2 5 0 1</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center w-full">
        
        {/* Main Title matching screenshot */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_20px_rgba(6,182,212,0.6)] leading-tight px-1">
          {t.heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="mt-2.5 sm:mt-4 text-xs sm:text-base md:text-lg text-cyan-100/80 max-w-2xl font-medium px-2">
          {t.heroSubtitle}
        </p>

        {/* Prominent Glowing Cyan Search Bar matching screenshot */}
        <div className="w-full mt-5 sm:mt-8 relative px-0.5">
          <div className="relative rounded-xl sm:rounded-2xl border-2 border-cyan-400 bg-[#081329]/95 p-1.5 sm:p-2.5 neon-glow-cyan transition-all hover:border-cyan-300">
            
            {/* Cyber Grid Interior Pattern */}
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl cyber-grid-dense opacity-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2">
              
              {/* Fetch Action Button (Left side in screenshot when viewed with RTL layout) */}
              <button
                onClick={onSearch}
                disabled={isLoading}
                className="order-2 sm:order-1 flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 active:scale-[0.98] transition-all shadow-[0_0_18px_rgba(6,182,212,0.6)] disabled:opacity-50 cursor-pointer text-sm sm:text-lg shrink-0"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>{t.searching}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                    <span>{t.fetchButton}</span>
                  </>
                )}
              </button>

              {/* Input Field with Search Icon */}
              <div className="order-1 sm:order-2 flex-1 relative flex items-center">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400/70 absolute right-3 pointer-events-none hidden sm:block" />
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) => onFilterChange({ query: e.target.value })}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-transparent text-white placeholder-cyan-200/50 px-3 sm:pr-10 sm:pl-10 py-2 sm:py-3 text-sm sm:text-base md:text-lg focus:outline-none focus:ring-0 font-medium"
                  dir="auto"
                />
                {filters.query && (
                  <button
                    onClick={() => onFilterChange({ query: '' })}
                    className="absolute left-2.5 text-cyan-400/70 hover:text-cyan-200 p-1"
                    title="Clear"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Live Detected Link Indicator */}
          {filters.query && (filters.query.includes('play.google.com') || filters.query.includes('apkpure.com') || filters.query.includes('.') && !filters.query.includes(' ')) && (
            <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-cyan-300 bg-cyan-950/70 border border-cyan-400/40 rounded-lg py-1.5 px-3 animate-pulse font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span>تم كشف رابط التطبيق / اللعبة جاهز للجلب المباشر</span>
            </div>
          )}
        </div>

        {/* Customization Section Box matching screenshot */}
        <div className="w-full mt-5 sm:mt-6 relative px-0.5">
          
          {/* Amber / Golden Header Badge matching screenshot */}
          <div className="flex justify-center -mb-[1px]">
            <div className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-1 sm:py-1.5 rounded-t-lg sm:rounded-t-xl border-2 border-b-0 border-amber-400/90 bg-[#161208] text-amber-300 font-bold text-xs sm:text-base neon-glow-amber">
              <Settings2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span>{t.customizeTitle}</span>
            </div>
          </div>

          {/* Main Customization Container */}
          <div className="w-full rounded-xl sm:rounded-2xl border-2 border-cyan-500/40 bg-[#071124]/90 backdrop-blur-md p-3 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            
            {/* The 3 Main Dropdown Selectors matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              
              {/* 1. Architecture Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'arch' ? null : 'arch')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    activeDropdown === 'arch' || filters.architectures.length > 0
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'border-cyan-500/30 bg-[#09152b] text-slate-300 hover:border-cyan-400/60'
                  }`}
                >
                  <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${activeDropdown === 'arch' ? 'rotate-180' : ''}`} />
                  <span className="truncate flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{getArchLabel()}</span>
                  </span>
                </button>

                {/* Dropdown Menu for Arch */}
                {activeDropdown === 'arch' && (
                  <div className="absolute z-30 top-full mt-1.5 w-full sm:w-64 bg-[#0a1835] border border-cyan-400/60 rounded-xl shadow-2xl p-2 text-right">
                    <div className="text-[11px] text-cyan-300/70 font-mono px-2 py-1 border-b border-cyan-500/20 mb-1">
                      فلترة المعماريات المدعومة:
                    </div>
                    {architecturesList.map((item) => {
                      const isSelected = item.id === 'universal'
                        ? filters.architectures.length === 0
                        : filters.architectures.includes(item.id);

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleArch(item.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium my-0.5 transition-colors ${
                            isSelected
                              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                              : 'text-slate-300 hover:bg-cyan-950/40 hover:text-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                          <div className="flex flex-col text-right">
                            <span>{item.label}</span>
                            <span className="text-[10px] text-slate-400">{item.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Android Version Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'android' ? null : 'android')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    activeDropdown === 'android' || (filters.androidVersion && filters.androidVersion !== 'all')
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'border-cyan-500/30 bg-[#09152b] text-slate-300 hover:border-cyan-400/60'
                  }`}
                >
                  <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${activeDropdown === 'android' ? 'rotate-180' : ''}`} />
                  <span className="truncate flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{getAndroidLabel()}</span>
                  </span>
                </button>

                {/* Dropdown Menu for Android */}
                {activeDropdown === 'android' && (
                  <div className="absolute z-30 top-full mt-1.5 w-full sm:w-64 max-h-60 overflow-y-auto bg-[#0a1835] border border-cyan-400/60 rounded-xl shadow-2xl p-2 text-right">
                    <div className="text-[11px] text-cyan-300/70 font-mono px-2 py-1 border-b border-cyan-500/20 mb-1">
                      الحد الأدنى لنظام التشغيل:
                    </div>
                    {androidVersionsList.map((ver) => (
                      <button
                        key={ver.api}
                        type="button"
                        onClick={() => {
                          onFilterChange({ androidVersion: ver.api });
                          setActiveDropdown(null);
                        }}
                        className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs font-medium my-0.5 transition-colors ${
                          filters.androidVersion === ver.api
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                            : 'text-slate-300 hover:bg-cyan-950/40 hover:text-white'
                        }`}
                      >
                        {ver.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. File Format Selector (APK/XAPK) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'format' ? null : 'format')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    activeDropdown === 'format' || (filters.format && filters.format !== 'all')
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'border-cyan-500/30 bg-[#09152b] text-slate-300 hover:border-cyan-400/60'
                  }`}
                >
                  <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${activeDropdown === 'format' ? 'rotate-180' : ''}`} />
                  <span className="truncate flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{getFormatLabel()}</span>
                  </span>
                </button>

                {/* Dropdown Menu for Format */}
                {activeDropdown === 'format' && (
                  <div className="absolute z-30 top-full mt-1.5 w-full sm:w-60 bg-[#0a1835] border border-cyan-400/60 rounded-xl shadow-2xl p-2 text-right">
                    <div className="text-[11px] text-cyan-300/70 font-mono px-2 py-1 border-b border-cyan-500/20 mb-1">
                      صيغ الحزم المتوفرة:
                    </div>
                    {formatList.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          onFilterChange({ format: f.id });
                          setActiveDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium my-0.5 transition-colors ${
                          filters.format === f.id
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                            : 'text-slate-300 hover:bg-cyan-950/40 hover:text-white'
                        }`}
                      >
                        <span className="text-[10px] font-mono text-cyan-400">{f.ext}</span>
                        <span>{f.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Additional Filter Row: Sources, Official vs MOD, Device Compatibility */}
            <div className="mt-4 pt-3 border-t border-cyan-500/15 flex flex-wrap items-center justify-between gap-3 text-xs">
              
              {/* Source Type Selector (Official vs MOD vs All) */}
              <div className="flex items-center gap-1.5 bg-[#081224] p-1 rounded-xl border border-cyan-500/20">
                <span className="text-slate-400 px-2 font-medium">{t.sourceTypeFilter}:</span>
                <button
                  type="button"
                  onClick={() => onFilterChange({ sourceType: 'all' })}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filters.sourceType === 'all'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.allTypes}
                </button>
                <button
                  type="button"
                  onClick={() => onFilterChange({ sourceType: 'official' })}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                    filters.sourceType === 'official'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-emerald-400/80 hover:text-emerald-300'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.officialApps}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onFilterChange({ sourceType: 'mod' })}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                    filters.sourceType === 'mod'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-amber-400/80 hover:text-amber-300'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{t.modApps}</span>
                </button>
              </div>

              {/* Target Device Selector */}
              <div className="flex items-center gap-1.5 bg-[#081224] p-1 rounded-xl border border-cyan-500/20">
                <span className="text-slate-400 px-2 font-medium">{t.deviceFilter}:</span>
                {[
                  { id: 'all', label: 'الكل', icon: Sparkles },
                  { id: 'phone', label: t.devicePhone, icon: Smartphone },
                  { id: 'tablet', label: t.deviceTablet, icon: Tablet },
                  { id: 'tv', label: t.deviceTV, icon: Tv },
                  { id: 'pc_emulator', label: t.devicePC, icon: Monitor },
                ].map((dev) => {
                  const Icon = dev.icon;
                  const isActive = filters.deviceType === dev.id;
                  return (
                    <button
                      key={dev.id}
                      type="button"
                      onClick={() => onFilterChange({ deviceType: dev.id as DeviceType | 'all' })}
                      className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span className="hidden sm:inline">{dev.label}</span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Repositories Quick Bar */}
            <div className="mt-3 pt-2.5 border-t border-cyan-500/10 flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1">
              <span className="text-cyan-400 font-mono shrink-0">{t.sourceFilter}:</span>
              {sourcesList.map((src) => {
                const isActive = filters.source === src.id;
                return (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => onFilterChange({ source: src.id })}
                    className={`px-2.5 py-1 rounded-md shrink-0 font-medium transition-all ${
                      isActive
                        ? 'border border-cyan-400 bg-cyan-500/20 text-cyan-200 font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                        : 'border border-cyan-500/20 bg-[#09152b]/60 text-slate-400 hover:text-white hover:border-cyan-400/40'
                    }`}
                  >
                    {src.label}
                  </button>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
