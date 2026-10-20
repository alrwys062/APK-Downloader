import type { Metadata } from 'next';
import { Cairo, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'APK Downloader - Multi-Source APK & XAPK Platform | تحميل ملفات APK مباشرة وسريعة',
  description: 'Professional multi-source APK discovery and download platform supporting Google Play, F-Droid, APKPure, APKMirror, and APKFab with real file verification, CPU architecture filters, and device compatibility.',
  openGraph: {
    title: 'APK Downloader - Multi-Source APK & XAPK Platform',
    description: 'Professional multi-source APK discovery and download platform supporting Google Play, F-Droid, APKPure, APKMirror, and APKFab with real file verification.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'APK Downloader - Multi-Source APK & XAPK Platform',
    description: 'Professional multi-source APK discovery and download platform supporting Google Play, F-Droid, APKPure, APKMirror, and APKFab with real file verification.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-[#060b18] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
