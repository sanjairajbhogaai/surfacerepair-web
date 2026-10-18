import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development';

  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://translate.google.com https://translate.googleapis.com" + (isDev ? " 'unsafe-eval'" : ''),
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "frame-src https://challenges.cloudflare.com https://translate.google.com",
    "connect-src 'self' https://challenges.cloudflare.com https://translate.googleapis.com" + (isDev ? ' ws: wss:' : ''),
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
