import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VERIFY_URL = process.env.API_SERVER_URL + '/auth/verify';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const path = req.nextUrl.pathname;

  const isAuthPage = path === '/login' || path === '/register';

  // 🧪 No token at all
  if (!token) {
    console.log('🔴 No auth token found');
    if (!isAuthPage && (path.startsWith('/dashboard') || path.startsWith('/profile'))) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next(); // allow access to login/register
  }

  // ✅ Validate token with backend
  try {
    const res = await fetch(VERIFY_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      // Valid token
      console.log('🔵 Token verified successfully');
      if (isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next(); // allow access
    } else {
      console.error('🔴 Token verification failed:', res.statusText);
      // Invalid token (expired, revoked, etc.)
      if (!isAuthPage) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return NextResponse.next();
    }
  } catch (err) {
    console.error('🔴 Token verify failed:', err);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/register', '/dashboard'],
};