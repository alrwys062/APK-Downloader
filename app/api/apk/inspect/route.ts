import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL syntax
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Try HEAD request first
    let response: Response;
    let methodUsed = 'HEAD';

    try {
      response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
          'Accept': '*/*'
        },
        signal: AbortSignal.timeout(8000)
      });

      // If HEAD is not allowed (405) or unsupported, fall back to Range GET for just the first byte
      if (response.status === 405 || response.status === 501) {
        methodUsed = 'GET (Range)';
        response = await fetch(url, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
            'Range': 'bytes=0-1'
          },
          signal: AbortSignal.timeout(8000)
        });
      }
    } catch (fetchErr: unknown) {
      const msg = fetchErr instanceof Error ? fetchErr.message : 'Network error';
      return NextResponse.json({
        success: false,
        error: `Failed to connect to source server: ${msg}`,
        isReachable: false
      });
    }

    const latencyMs = Date.now() - startTime;
    const contentLength = response.headers.get('content-length');
    const contentRange = response.headers.get('content-range');
    const contentType = response.headers.get('content-type') || 'unknown';
    const lastModified = response.headers.get('last-modified') || null;
    const etag = response.headers.get('etag') || null;

    let bytes: number | null = null;
    if (contentLength) {
      bytes = parseInt(contentLength, 10);
    } else if (contentRange) {
      // Content-Range: bytes 0-1/39581400
      const match = contentRange.match(/\/(\d+)$/);
      if (match && match[1]) {
        bytes = parseInt(match[1], 10);
      }
    }

    let formattedSize = 'Unknown';
    if (bytes && !isNaN(bytes) && bytes > 0) {
      const mb = bytes / (1024 * 1024);
      if (mb >= 1000) {
        formattedSize = `${(mb / 1024).toFixed(2)} GB (${bytes.toLocaleString()} bytes)`;
      } else {
        formattedSize = `${mb.toFixed(2)} MB (${bytes.toLocaleString()} bytes)`;
      }
    }

    return NextResponse.json({
      success: true,
      url,
      httpStatus: response.status,
      isReachable: response.ok || response.status === 206 || response.status === 302,
      contentType,
      sizeBytes: bytes,
      formattedSize,
      lastModified,
      etag,
      latencyMs,
      methodUsed
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Inspection failed';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
