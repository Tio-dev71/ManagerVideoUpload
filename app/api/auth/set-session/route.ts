import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/auth/set-session?token=XYZ
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  const callbackUrl = url.searchParams.get('callbackUrl') || '/dashboard';

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=InvalidLink', req.url));
  }

  const cookieStore = await cookies();
  const maxAge = 30 * 24 * 60 * 60; // 30 days

  // NextAuth uses __Secure- prefix in production
  const isProd = process.env.NODE_ENV === 'production';
  const cookieName = isProd ? '__Secure-next-auth.session-token' : 'next-auth.session-token';

  cookieStore.set(cookieName, token, {
    path: '/',
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge,
  });

  // Also set the non-secure one just in case the proxy/SSL is weird
  if (isProd) {
    cookieStore.set('next-auth.session-token', token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge,
    });
  }

  return NextResponse.redirect(new URL(callbackUrl, req.url));
}
