import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  // User-Agent check - block requests without user agent
  if (!userAgent) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Detect suspicious patterns commonly used by scrapers
  const suspiciousPatterns = [
    /python-requests/i,
    /beautifulsoup/i,
    /selenium/i,
    /scrapy/i,
    /curl/i,
    /wget/i,
    /headless/i,
  ];

  // Block suspicious user agents
  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
