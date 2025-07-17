import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const VERIFY_URL = `${process.env.API_SERVER_URL}/auth/verify`;

export async function GET() {
  const token = (await cookies()).get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No token' }, { status: 401 });
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Token invalid' }, { status: res.status });
    }

    const data = await res.json();

    // Optionally: refresh token from backend response
    if (data.token && data.token !== token) {
      (await cookies()).set('auth_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
    }

    return NextResponse.json({ user: data.user });
  } catch (err) {
    console.error('🔴 Error verifying token via backend:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
