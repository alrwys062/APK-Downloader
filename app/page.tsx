'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { HeroSearch } from '@/components/HeroSearch';
import { TrendingTags } from '@/components/TrendingTags';
import { AppCard } from '@/components/AppCard';
import { AppIcon } from '@/components/AppIcon';
import { AppDetailModal } from '@/components/AppDetailModal';
import { HowItWorksModal } from '@/components/HowItWorksModal';
import { ContactModal } from '@/components/ContactModal';
import { SourceStatusModal } from '@/components/SourceStatusModal';
import { SupportedLanguage, translations } from '@/lib/translations';
import { ApkItem, SearchFilters, SortOption } from '@/lib/types';
import { VERIFIED_PACKAGES } from '@/lib/sources-registry';
import {
  ArrowUpDown,
  Sparkles,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Info,
  Star,
  Copy,
  Check,
  Layers,
  Cpu
} from 'lucide-react';

export default function Home() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('ar');
  const t = translations[currentLang];

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    architectures: [],
    androidVersion: '',
    format: 'all',
    source: 'all',
    sourceType: 'all',
    deviceType: 'all',
    sortBy: 'relevance'
  });

  const [results, setResults] = useState<ApkItem[]>(VERIFIED_PACKAGES);
  const [recognizedApp, setRecognizedApp] = useState<ApkItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApkItem | null>(null);
  const [copiedPkg, setCopiedPkg] = useState(false);

  // Modals state
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSourcesStatusOpen, setIsSourcesStatusOpen] = useState(false);

  // Sync HTML direction and lang attribute with selected language
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang]);

  const searchAbortRef = React.useRef<AbortController | null>(null);
  const filtersRef = React.useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Execute search via API
  const handleSearch = useCallback(async (customFilters?: Partial<SearchFilters>) => {
    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }
    const abortController = new AbortController();
    searchAbortRef.current = abortController;

    setIsLoading(true);
    const activeFilters = { ...filtersRef.current, ...(customFilters || {}) };
    
    try {
      const res = await fetch('/api/apk/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeFilters),
        signal: abortController.signal
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setResults(data.data);
        if (data.recognizedItem) {
          setRecognizedApp(data.recognizedItem);
        } else {
          setRecognizedApp(null);
        }
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== 'AbortError') {
        console.error('Search request failed:', err);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filtersRef.current, ...newFilters };
    filtersRef.current = updated;
    setFilters(updated);

    if (newFilters.query !== undefined) {
      const trimmed = newFilters.query.trim();
      // If user pasted or typed a URL or dot-separated package name, search immediately with the new query
      if (trimmed.includes('play.google.com') || trimmed.includes('id=') || (trimmed.includes('.') && !trimmed.includes(' '))) {
        handleSearch({ ...updated, query: trimmed });
      } else if (trimmed === '') {
        handleSearch({ ...updated, query: '' });
      }
    } else {
      handleSearch(newFilters);
    }
  };

  const handleSelectTag = (tagQuery: string) => {
    const updated = { ...filters, query: tagQuery };
    setFilters(updated);
    handleSearch({ query: tagQuery });
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleDownloadDirect = (app: ApkItem) => {
    if (app.verifiedDirectDownload && app.downloadUrl) {
      // Use streaming proxy to initiate genuine binary download
      const ext = app.fileFormat === 'xapk' ? 'xapk' : 'apk';
      const filename = `${app.packageName}_v${app.version}.${ext}`;
      const downloadProxyUrl = `/api/apk/download?url=${encodeURIComponent(app.downloadUrl)}&filename=${encodeURIComponent(filename)}`;
      window.location.href = downloadProxyUrl;
    } else if (app.downloadUrl) {
      // Verified repository mirror: open source download page directly in a new tab
      window.open(app.downloadUrl, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedApp(app);
    }
  };

  const handleModalDownload = (url: string, filename: string) => {
    const downloadProxyUrl = `/api/apk/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
    window.location.href = downloadProxyUrl;
  };

  const copyPackageId = (pkg: string) => {
    navigator.clipboard.writeText(pkg);
    setCopiedPkg(true);
    setTimeout(() => setCopiedPkg(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden w-full">
      
      {/* Top Cyber Navigation Bar */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenSourcesStatus={() => setIsSourcesStatusOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 pb-10 sm:pb-16 overflow-x-hidden w-full">
        
        {/* Hero Section matching the user screenshot */}
        <HeroSearch
          currentLang={currentLang}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={() => handleSearch()}
          isLoading={isLoading}
        />

        {/* Trending Quick Tags */}
        <TrendingTags
          currentLang={currentLang}
          onSelectTag={handleSelectTag}
        />

        {/* Recognized App Spotlight Card (Displayed when a Google Play URL or Package ID was fetched) */}
        {recognizedApp && (
          <section className="max-w-5xl mx-auto px-3 sm:px-6 mb-8 w-full animate-fadeIn">
            <div className="relative rounded-2xl border-2 border-cyan-400 bg-gradient-to-b from-[#0a1835] via-[#081329] to-[#060e20] p-4 sm:p-6 shadow-[0_0_35px_rgba(6,182,212,0.4)] overflow-hidden">
              
              {/* Top Success Badge */}
              <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-cyan-500/25">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>تم التعرف على رابط التطبيق / اللعبة بنجاح من متجر Google Play</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-emerald-400/40 bg-emerald-950/40 text-emerald-300">
                  VERIFIED RECOGNITION
                </span>
              </div>

              {/* App Meta Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                
                {/* Icon */}
                <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-2 border-cyan-400 bg-slate-900 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <AppIcon src={recognizedApp.iconUrl} alt={recognizedApp.title} />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{t.officialBadge}</span>
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-cyan-300 font-medium">{recognizedApp.category}</span>
                    {recognizedApp.rating && (
                      <>
                        <span className="text-slate-400">•</span>
                        <span className="text-amber-400 font-bold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{recognizedApp.rating}</span>
                        </span>
                      </>
                    )}
                  </div>

                  <h2 className="mt-1 text-xl sm:text-2xl font-black text-white">
                    {recognizedApp.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300">
                    بواسطة: <span className="font-semibold text-white">{recognizedApp.developer}</span>
                  </p>

                  <div className="mt-1.5 flex items-center gap-2 text-xs text-cyan-300/90 font-mono">
                    <span className="truncate">{recognizedApp.packageName}</span>
                    <button
                      onClick={() => copyPackageId(recognizedApp.packageName)}
                      className="p-1 hover:text-white transition-colors"
                      title="Copy Package ID"
                    >
                      {copiedPkg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="w-full sm:w-auto flex flex-col gap-2 shrink-0 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleDownloadDirect(recognizedApp)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 text-sm sm:text-base shadow-[0_0_20px_rgba(6,182,212,0.6)] cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <Download className="w-5 h-5 stroke-[2.5]" />
                    <span>
                      {recognizedApp.verifiedDirectDownload
                        ? recognizedApp.fileFormat === 'xapk'
                          ? 'تحميل سريع (XAPK مباشر)'
                          : 'تحميل سريع (APK مباشر)'
                        : 'تحميل عبر المصدر المعتمد'}
                    </span>
                  </button>

                  <button
                    onClick={() => setSelectedApp(recognizedApp)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>عرض التفاصيل وبصمة التشفير</span>
                  </button>
                </div>

              </div>

              {/* Multi-Source Fast Download Bar */}
              {recognizedApp.mirrors && recognizedApp.mirrors.length > 0 && (
                <div className="mt-5 pt-4 border-t border-cyan-500/20">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs text-cyan-300 font-bold flex items-center gap-1.5 font-mono">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>مصادر التحميل المتوفرة والمباشرة لهذا التطبيق:</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {recognizedApp.mirrors.length} مستودعات مؤكدة
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {recognizedApp.mirrors.map((mirror, idx) => (
                      <a
                        key={idx}
                        href={mirror.isDirect ? `/api/apk/download?url=${encodeURIComponent(mirror.url)}&filename=${encodeURIComponent(`${recognizedApp.packageName}_v${mirror.version || 'latest'}.${mirror.format === 'xapk' ? 'xapk' : 'apk'}`)}` : mirror.url}
                        target={mirror.isDirect ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl border border-cyan-500/30 bg-[#061024]/90 hover:bg-cyan-950/60 hover:border-cyan-400 transition-all flex flex-col justify-between group shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="uppercase font-bold text-cyan-300 text-xs group-hover:text-cyan-200">
                            {mirror.name || mirror.source}
                          </span>
                          {mirror.isDirect ? (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-400/40 text-emerald-300">
                              DIRECT
                            </span>
                          ) : (
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-300" />
                          )}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span className="uppercase text-cyan-400/90 font-semibold">{mirror.format || 'APK'}</span>
                          <span>{mirror.size}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </section>
        )}

        {/* Search Results Area */}
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
          
          {/* Results Bar: Count + Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-cyan-500/20">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-cyan-400 font-bold text-base sm:text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>
                  {recognizedApp
                    ? `مصادر التحميل المتوفرة لـ "${recognizedApp.title}" (${results.length} مصادر حقيقية):`
                    : t.resultsFound.replace('{count}', results.length.toString())}
                </span>
              </span>
              {filters.query && !recognizedApp && (
                <span className="text-xs text-slate-400 font-mono">
                  (للبحث: &quot;{filters.query}&quot;)
                </span>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.sortBy}:</span>
              </span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as SortOption })}
                className="bg-[#09152b] border border-cyan-500/30 text-cyan-300 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
              >
                <option value="relevance">{t.sortRelevance}</option>
                <option value="date">{t.sortDate}</option>
                <option value="size">{t.sortSize}</option>
                <option value="version">{t.sortVersion}</option>
              </select>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl border border-cyan-500/20 bg-[#081226]/50 p-5 animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-950/60" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-cyan-950/80 rounded w-3/4" />
                      <div className="h-3 bg-cyan-950/50 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-10 bg-cyan-950/40 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Results Grid */}
          {!isLoading && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  currentLang={currentLang}
                  onOpenDetails={(selected) => setSelectedApp(selected)}
                  onDownloadDirect={handleDownloadDirect}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && results.length === 0 && (
            <div className="max-w-md mx-auto my-12 p-8 rounded-2xl border border-cyan-500/30 bg-[#081329] text-center space-y-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">{t.noResultsTitle}</h3>
              <p className="text-xs text-slate-300/80 leading-relaxed">
                {t.noResultsDesc}
              </p>
              <button
                onClick={() => {
                  const resetFilters: SearchFilters = {
                    query: '',
                    architectures: [],
                    androidVersion: '',
                    format: 'all',
                    source: 'all',
                    sourceType: 'all',
                    deviceType: 'all',
                    sortBy: 'relevance'
                  };
                  setFilters(resetFilters);
                  setResults(VERIFIED_PACKAGES);
                  setRecognizedApp(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all cursor-pointer"
              >
                إعادة ضبط جميع الفلاتر
              </button>
            </div>
          )}

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 bg-[#040813] py-8 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-cyan-400 bg-cyan-950 flex items-center justify-center text-cyan-300 font-black text-[9px]">
              APK
            </div>
            <span className="text-white font-bold font-sans">APK Downloader Platform</span>
            <span>•</span>
            <span>Multi-Source Engine</span>
          </div>

          <div className="text-center md:text-left text-[11px] text-slate-400">
            جميع البيانات وأحجام الملفات مستخرجة من ترويسات الخوادم الأصلية بدون تزييف. Google Play علامة تجارية لشركة Google LLC.
          </div>

          <div className="flex items-center gap-4 text-cyan-300">
            <button onClick={() => setIsHowItWorksOpen(true)} className="hover:underline">
              {t.navHowItWorks}
            </button>
            <button onClick={() => setIsContactOpen(true)} className="hover:underline">
              {t.navContact}
            </button>
            <button onClick={() => setIsSourcesStatusOpen(true)} className="hover:underline">
              {t.navSourcesStatus}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AppDetailModal
        app={selectedApp}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        currentLang={currentLang}
        onDownload={handleModalDownload}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        currentLang={currentLang}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        currentLang={currentLang}
      />

      <SourceStatusModal
        isOpen={isSourcesStatusOpen}
        onClose={() => setIsSourcesStatusOpen(false)}
        currentLang={currentLang}
      />

    </div>
  );
}
