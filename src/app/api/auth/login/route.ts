import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.text();

    const authRes = await fetch(`${process.env.API_SERVER_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    if (!authRes.ok) {
      const errData = await authRes.json();
      return NextResponse.json(
        { error: errData.error || 'Auth failed' },
        { status: authRes.status },
      );
    }

    const data = await authRes.json();

    if (data.token) {
      const cookieStore = await cookies();
      cookieStore.set('auth_token', data.token, { path: '/' });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.log('Login API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
