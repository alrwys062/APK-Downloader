import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const url = searchParams.get('url');
    let filename = searchParams.get('filename') || 'application.apk';

    if (!url) {
      return new NextResponse('Target download URL is required', { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return new NextResponse('Invalid target URL', { status: 400 });
    }

    // Security check: only allow http/https
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return new NextResponse('Unsupported protocol', { status: 400 });
    }

    // Normalize filename extension
    if (url.includes('.xapk') && !filename.endsWith('.xapk')) {
      filename = filename.replace(/\.apk$/i, '') + '.xapk';
    } else if (!filename.endsWith('.apk') && !filename.endsWith('.xapk')) {
      filename = filename + '.apk';
    }

    // Check if the URL is an interactive store search page where direct streaming is not possible
    const isStoreWebPage =
      url.includes('play.google.com') ||
      url.includes('apkmirror.com/?post_type=app_release') ||
      url.includes('uptodown.com/android/search') ||
      url.includes('apkcombo.com/apk-downloader') ||
      url.includes('apkfab.com/download') ||
      url.includes('apkfab.com/search') ||
      url.includes('apksupport.com') ||
      url.includes('taptap.io') ||
      url.includes('apkmonk.com') ||
      url.includes('auroraoss.com') ||
      url.includes('softpedia.com');

    if (isStoreWebPage) {
      return NextResponse.redirect(url, { status: 302 });
    }

    // For direct binary links (Aptoide, APKPure CDN, F-Droid, Vendor CDN):
    try {
      const rangeHeader = req.headers.get('range');
      const upstreamHeaders: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Referer': parsedUrl.origin
      };
      if (rangeHeader) {
        upstreamHeaders['Range'] = rangeHeader;
      }

      const upstreamRes = await fetch(url, {
        redirect: 'follow',
        headers: upstreamHeaders,
        // Allow up to 10 minutes for large game binaries (400MB - 2.5GB) to stream smoothly
        signal: AbortSignal.timeout(600000)
      });

      const contentType = upstreamRes.headers.get('content-type') || '';

      // If upstream returned an HTML page (e.g. Cloudflare challenge), redirect user's browser directly to it
      if (contentType.includes('text/html') || !upstreamRes.ok && upstreamRes.status !== 206) {
        return NextResponse.redirect(url, { status: 302 });
      }

      // Check for upstream Content-Disposition filename
      const upstreamDisp = upstreamRes.headers.get('content-disposition');
      if (upstreamDisp) {
        const match = upstreamDisp.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
        if (match && match[1]) {
          try {
            const extracted = decodeURIComponent(match[1].replace(/\+/g, ' '));
            if (extracted && (extracted.toLowerCase().endsWith('.apk') || extracted.toLowerCase().endsWith('.xapk') || extracted.toLowerCase().endsWith('.apks'))) {
              filename = extracted;
            }
          } catch {
            // Keep existing filename
          }
        }
      }

      // Stream real binary package to browser
      const headers = new Headers();
      const isXapk = filename.toLowerCase().endsWith('.xapk') || contentType.includes('xapk') || contentType.includes('zip') || contentType.includes('octet-stream');
      headers.set('Content-Type', isXapk ? 'application/octet-stream' : 'application/vnd.android.package-archive');
      headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
      headers.set('Accept-Ranges', 'bytes');

      const contentLength = upstreamRes.headers.get('content-length');
      if (contentLength) {
        headers.set('Content-Length', contentLength);
      }

      const contentRange = upstreamRes.headers.get('content-range');
      if (contentRange) {
        headers.set('Content-Range', contentRange);
      }

      // Allow streaming chunk by chunk without memory buffering
      return new NextResponse(upstreamRes.body, {
        status: upstreamRes.status === 206 ? 206 : 200,
        headers
      });
    } catch (streamErr) {
      console.error('Streaming proxy failed, falling back to 302 redirect:', streamErr);
      return NextResponse.redirect(url, { status: 302 });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Download failed';
    return new NextResponse(`Download error: ${msg}`, { status: 500 });
  }
}
