/**
 * Netlify Serverless Function: apk-api.js
 * Multi-Source Android Game Discovery & Direct Download Engine
 * Handles both search queries / Google Play URLs and direct binary downloading/streaming.
 */

const https = require('https');
const http = require('http');

// Helper to perform HTTP/HTTPS GET with redirect following
function fetchUrl(targetUrl, options = {}, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      return reject(new Error('Too many redirects'));
    }

    const client = targetUrl.startsWith('https') ? https : http;
    const req = client.get(targetUrl, {
      headers: {
        'User-Agent': options.userAgent || 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
        'Accept': options.accept || '*/*',
        ...(options.headers || {})
      },
      timeout: options.timeout || 8000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, targetUrl).toString();
        return resolve(fetchUrl(redirectUrl, options, maxRedirects - 1));
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks)
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Extract package name from URL or input
function extractPackageId(input) {
  if (!input) return null;
  const decoded = decodeURIComponent(input.trim());
  const match = decoded.match(/[?&]id=([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+)/i) ||
                decoded.match(/^id=([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+)/i) ||
                decoded.match(/details\?id=([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+)/i) ||
                decoded.match(/apkpure\.com\/(?:[^\/]+\/)?([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+)/i) ||
                decoded.match(/\b([a-zA-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z][a-zA-Z0-9_]*)+)\b/);
  return match ? match[1].replace(/[^a-zA-Z0-9_.]/g, '') : null;
}

exports.handler = async (event, context) => {
  const method = event.httpMethod;
  const path = event.path;
  const params = event.queryStringParameters || {};

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  // 1. Direct Download endpoint (/api/download?url=...)
  if (params.action === 'download' || params.url) {
    const targetUrl = params.url;
    let filename = params.filename || 'application.apk';

    if (!targetUrl) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Target URL is required' })
      };
    }

    // Interactive store pages -> 302 Redirect directly to official page
    const isStoreWebPage =
      targetUrl.includes('play.google.com') ||
      targetUrl.includes('apkmirror.com') ||
      targetUrl.includes('uptodown.com') ||
      targetUrl.includes('apkcombo.com') ||
      targetUrl.includes('taptap.io') ||
      targetUrl.includes('apkmonk.com');

    if (isStoreWebPage) {
      return {
        statusCode: 302,
        headers: { ...corsHeaders, 'Location': targetUrl },
        body: ''
      };
    }

    try {
      const response = await fetchUrl(targetUrl);
      const isXapk = targetUrl.includes('.xapk') || filename.endsWith('.xapk');
      const contentType = isXapk ? 'application/octet-stream' : 'application/vnd.android.package-archive';

      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
          'Content-Length': response.body.length.toString()
        },
        body: response.body.toString('base64'),
        isBase64Encoded: true
      };
    } catch (err) {
      return {
        statusCode: 302,
        headers: { ...corsHeaders, 'Location': targetUrl },
        body: ''
      };
    }
  }

  // 2. Search & URL Recognition endpoint
  let query = '';
  if (method === 'POST' && event.body) {
    try {
      const parsed = JSON.parse(event.body);
      query = parsed.query || '';
    } catch {
      query = '';
    }
  } else {
    query = params.q || params.query || '';
  }

  const pkg = extractPackageId(query) || (query.includes('.') ? query.trim() : 'com.dts.freefireth');

  // Multi-source generation for the package
  const title = pkg.split('.').pop().replace(/[_-]/g, ' ').toUpperCase();
  const directApkUrl = `https://d.apkpure.net/b/APK/${encodeURIComponent(pkg)}?version=latest`;

  const sources = [
    {
      source: 'apkpure',
      name: 'APKPure',
      format: 'XAPK/APK',
      isDirect: true,
      downloadUrl: directApkUrl,
      sourceUrl: `https://apkpure.com/p/${encodeURIComponent(pkg)}`,
      description: 'حزمة مباشرة مع فحص التوقيع الرقمي الأصلي للمطور.'
    },
    {
      source: 'aptoide',
      name: 'Aptoide',
      format: 'APK',
      isDirect: false,
      downloadUrl: `https://en.aptoide.com/search?query=${encodeURIComponent(pkg)}`,
      sourceUrl: `https://${pkg.replace(/\./g, '-')}.en.aptoide.com/app`,
      description: 'متجر Aptoide المفتوح للتحميل الآمن والفحص الأمني التلقائي.'
    },
    {
      source: 'apkcombo',
      name: 'APKCombo',
      format: 'XAPK',
      isDirect: false,
      downloadUrl: `https://apkcombo.com/apk-downloader/?q=${encodeURIComponent(pkg)}`,
      sourceUrl: `https://apkcombo.com/downloader/#package=${encodeURIComponent(pkg)}`,
      description: 'تحميل فائق السرعة عبر شبكة توزيع APKCombo العالمية.'
    },
    {
      source: 'uptodown',
      name: 'Uptodown',
      format: 'XAPK',
      isDirect: false,
      downloadUrl: `https://en.uptodown.com/android/search/${encodeURIComponent(pkg)}`,
      sourceUrl: `https://en.uptodown.com/android/search/${encodeURIComponent(pkg)}`,
      description: 'كتالوج Uptodown العالمي الموثوق مع الإصدارات السابقة.'
    },
    {
      source: 'apkmirror',
      name: 'APKMirror',
      format: 'Split APKs',
      isDirect: false,
      downloadUrl: `https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s=${encodeURIComponent(pkg)}`,
      sourceUrl: `https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s=${encodeURIComponent(pkg)}`,
      description: 'مستودع APKMirror الشهير مع مطابقة الشهادة الرقمية للمطور الأصلي.'
    },
    {
      source: 'apkfab',
      name: 'APKFab',
      format: 'XAPK',
      isDirect: false,
      downloadUrl: `https://apkfab.com/download?package_id=${encodeURIComponent(pkg)}`,
      sourceUrl: `https://apkfab.com/p/${encodeURIComponent(pkg)}`,
      description: 'فحص دوري خالي من البرمجيات الخبيثة مع روابط تحميل نظيفة.'
    },
    {
      source: 'apksupport',
      name: 'APKSupport CDN',
      format: 'APK',
      isDirect: false,
      downloadUrl: `https://apksupport.com/app/${encodeURIComponent(pkg)}`,
      sourceUrl: `https://apksupport.com/app/${encodeURIComponent(pkg)}`,
      description: 'جلب الحزم الرسمية مباشرة مع دعم جميع المعماريات.'
    },
    {
      source: 'taptap',
      name: 'TapTap Games',
      format: 'XAPK',
      isDirect: false,
      downloadUrl: `https://www.taptap.io/search/${encodeURIComponent(pkg)}`,
      sourceUrl: `https://www.taptap.io/search/${encodeURIComponent(pkg)}`,
      description: 'المنصة العالمية الرائدة لألعاب الهواتف المحمولة وتحديثات الألعاب الأصلية.'
    },
    {
      source: 'apkmonk',
      name: 'APKMonk',
      format: 'APK',
      isDirect: false,
      downloadUrl: `https://www.apkmonk.com/app/${encodeURIComponent(pkg)}/`,
      sourceUrl: `https://www.apkmonk.com/app/${encodeURIComponent(pkg)}/`,
      description: 'أرشيف شامل وسريع يوفر الحزم الحالية والسابقة.'
    },
    {
      source: 'aurora',
      name: 'Aurora Store OSS',
      format: 'APK',
      isDirect: false,
      downloadUrl: 'https://auroraoss.com/download/',
      sourceUrl: 'https://auroraoss.com/',
      description: 'مشروع مفتوح المصدر ومستودع يعتمد على بروتوكول Google Play.'
    },
    {
      source: 'googleplay',
      name: 'Google Play Store',
      format: 'Bundle (AAB)',
      isDirect: false,
      downloadUrl: `https://play.google.com/store/apps/details?id=${encodeURIComponent(pkg)}`,
      sourceUrl: `https://play.google.com/store/apps/details?id=${encodeURIComponent(pkg)}`,
      description: 'صفحة المتجر الرسمية من Google Play مع التراخيص الأصلية للمطور.'
    }
  ];

  return {
    statusCode: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      packageName: pkg,
      title: title,
      sourcesCount: sources.length,
      sources: sources
    })
  };
};
