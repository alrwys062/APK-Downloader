import { NextRequest, NextResponse } from 'next/server';
import { VERIFIED_PACKAGES } from '@/lib/sources-registry';
import { ApkItem, SearchFilters } from '@/lib/types';
import { identifyAppUrl, resolvePackageItem } from '@/lib/url-recognizer';

export async function POST(req: NextRequest) {
  try {
    const filters: SearchFilters = await req.json();
    const {
      query = '',
      architectures = [],
      androidVersion = '',
      format = 'all',
      source = 'all',
      sourceType = 'all',
      deviceType = 'all',
      sortBy = 'relevance'
    } = filters;

    const trimmedQuery = query.trim();
    const urlAnalysis = identifyAppUrl(trimmedQuery);
    let results: ApkItem[] = [];
    let recognizedItem: ApkItem | null = null;

    // 1. Direct URL or Package ID Recognition Flow
    if (urlAnalysis.packageId) {
      // Resolve the package with live metadata from Google Play, Aptoide, F-Droid & multi-sources
      const resolved = await resolvePackageItem(trimmedQuery);
      if (resolved) {
        recognizedItem = resolved.recognizedItem;
        // The results list contains all the genuine multi-source download cards!
        results = [...resolved.allSourceItems];
      } else {
        results = [];
      }
    } else if (trimmedQuery) {
      // 2. Standard Search query by text (Title, Developer, Category, Description)
      const searchLower = trimmedQuery.toLowerCase();
      const matchedLocal = VERIFIED_PACKAGES.filter(item => {
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.packageName.toLowerCase().includes(searchLower) ||
          item.developer.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        );
      });

      // If the query strongly matches a single top game, expand its multi-sources!
      if (matchedLocal.length > 0) {
        const primaryMatch = matchedLocal[0];
        const resolved = await resolvePackageItem(primaryMatch.packageName);
        if (resolved) {
          recognizedItem = resolved.recognizedItem;
          results = [...resolved.allSourceItems];
          // Also append any other matched packages
          matchedLocal.slice(1).forEach(other => {
            if (!results.some(r => r.packageName === other.packageName)) {
              results.push(other);
            }
          });
        } else {
          results = matchedLocal;
        }
      } else {
        // Try searching through URL recognizer in case query is a partial package
        const resolved = await resolvePackageItem(trimmedQuery);
        if (resolved) {
          recognizedItem = resolved.recognizedItem;
          results = [...resolved.allSourceItems];
        } else {
          results = [];
        }
      }
    } else {
      // 3. Default view: All verified packages
      results = [...VERIFIED_PACKAGES];
    }

    // Filter by CPU Architecture
    if (architectures && architectures.length > 0) {
      results = results.filter(item => {
        if (item.architectures.includes('universal')) return true;
        return architectures.some(arch => item.architectures.includes(arch));
      });
    }

    // Filter by Android Version
    if (androidVersion && androidVersion !== 'all') {
      const targetApi = parseInt(androidVersion, 10);
      if (!isNaN(targetApi)) {
        results = results.filter(item => item.minSdk <= targetApi);
      }
    }

    // Filter by Format (apk, xapk, split, bundle)
    if (format && format !== 'all') {
      results = results.filter(item => item.fileFormat === format);
    }

    // Filter by Repository Source
    if (source && source !== 'all') {
      results = results.filter(item => item.source === source);
    }

    // Filter by Source Type (official vs mod)
    if (sourceType && sourceType !== 'all') {
      results = results.filter(item => item.sourceType === sourceType);
    }

    // Filter by Device Type
    if (deviceType && deviceType !== 'all') {
      results = results.filter(item => {
        if (deviceType === 'phone') return item.deviceCompatibility.phone;
        if (deviceType === 'tablet') return item.deviceCompatibility.tablet;
        if (deviceType === 'tv') return item.deviceCompatibility.tv;
        if (deviceType === 'pc_emulator') return item.deviceCompatibility.pcEmulator;
        return true;
      });
    }

    // Sorting
    results.sort((a, b) => {
      // Direct download sources come first
      if (a.verifiedDirectDownload && !b.verifiedDirectDownload) return -1;
      if (!a.verifiedDirectDownload && b.verifiedDirectDownload) return 1;

      if (sortBy === 'size') {
        return (b.sizeBytes || 0) - (a.sizeBytes || 0);
      }
      if (sortBy === 'date') {
        return new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime();
      }
      if (sortBy === 'version') {
        return b.versionCode - a.versionCode;
      }
      // Relevance
      if (a.isOfficial && !b.isOfficial) return -1;
      if (!a.isOfficial && b.isOfficial) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
      query: trimmedQuery,
      detectedPackageId: urlAnalysis.packageId || null,
      recognizedItem: recognizedItem || null,
      sourceType: urlAnalysis.source
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Search processing failed';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
