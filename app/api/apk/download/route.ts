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
      url.includes('apkfab.com/search');

    if (isStoreWebPage) {
      return NextResponse.redirect(url, { status: 302 });
    }

    // For direct binary links (Aptoide, APKPure CDN, F-Droid, Vendor CDN):
    try {
      const upstreamRes = await fetch(url, {
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
          'Accept': '*/*',
          'Referer': parsedUrl.origin
        },
        signal: AbortSignal.timeout(20000)
      });

      const contentType = upstreamRes.headers.get('content-type') || '';

      // If upstream returned an HTML page (e.g. Cloudflare challenge), redirect user's browser directly to it
      if (contentType.includes('text/html') || !upstreamRes.ok) {
        return NextResponse.redirect(url, { status: 302 });
      }

      // Stream real binary package to browser
      const headers = new Headers();
      const isXapk = filename.endsWith('.xapk') || contentType.includes('zip') || contentType.includes('octet-stream');
      headers.set('Content-Type', isXapk ? 'application/octet-stream' : 'application/vnd.android.package-archive');
      headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);

      const contentLength = upstreamRes.headers.get('content-length');
      if (contentLength) {
        headers.set('Content-Length', contentLength);
      }

      // Allow streaming chunk by chunk without memory buffering
      return new NextResponse(upstreamRes.body, {
        status: 200,
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
