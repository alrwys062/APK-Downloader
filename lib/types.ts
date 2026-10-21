export type ApkSource =
  | 'googleplay'
  | 'fdroid'
  | 'apkpure'
  | 'apkmirror'
  | 'apkfab'
  | 'apkba'
  | 'apkcombo'
  | 'uptodown'
  | 'aptoide'
  | 'apksupport'
  | 'taptap'
  | 'apkmonk'
  | 'aurora'
  | 'softpedia';

export type CpuArchitecture = 'arm64-v8a' | 'armeabi-v7a' | 'x86' | 'x86_64' | 'universal';

export type DeviceType = 'phone' | 'tablet' | 'tv' | 'pc_emulator';

export type SourceType = 'official' | 'mod' | 'all';

export type FileFormat = 'apk' | 'xapk' | 'split' | 'bundle';

export type SortOption = 'relevance' | 'date' | 'size' | 'version';

export interface SecurityStatus {
  isSafe: boolean;
  signatureVerified: boolean;
  virustotalStatus?: 'clean' | 'suspicious' | 'warning' | 'unknown';
  details: string;
}

export interface ApkItem {
  id: string;
  title: string;
  packageName: string;
  developer: string;
  developerUrl?: string;
  iconUrl: string;
  version: string;
  versionCode: number;
  minAndroidVersion: string;
  minSdk: number;
  targetSdk?: number;
  releaseDate: string;
  updateDate: string;
  source: ApkSource;
  sourceType: 'official' | 'mod';
  isOfficial: boolean;
  architectures: CpuArchitecture[];
  fileFormat: FileFormat;
  sizeBytes?: number;
  formattedSize: string; // e.g., "48.2 MB" or "Unknown"
  rating?: number;
  reviewsCount?: string;
  downloadsCount?: string;
  description: string;
  category: string;
  permissions: string[];
  screenshots: string[];
  sha256?: string;
  downloadUrl?: string;
  verifiedDirectDownload: boolean;
  sourceUrl: string;
  modFeatures?: string[];
  securityStatus: SecurityStatus;
  deviceCompatibility: {
    phone: boolean;
    tablet: boolean;
    tv: boolean;
    pcEmulator: boolean;
    note?: string;
  };
  mirrors?: {
    source: ApkSource;
    name?: string;
    version: string;
    size: string;
    url: string;
    format?: FileFormat;
    isDirect: boolean;
  }[];
}

export interface SearchFilters {
  query: string;
  architectures: CpuArchitecture[];
  androidVersion: string;
  format: FileFormat | 'all';
  source: ApkSource | 'all';
  sourceType: SourceType;
  deviceType: DeviceType | 'all';
  sortBy: SortOption;
}

export interface SourceInfo {
  id: ApkSource;
  name: string;
  url: string;
  status: 'operational' | 'degraded' | 'maintenance';
  supportsDirectDownload: boolean;
  supportsSignatureVerification: boolean;
  badgeColor?: string;
  description: {
    ar: string;
    en: string;
    fr: string;
  };
}
