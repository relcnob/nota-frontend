import { NextRequest, NextResponse } from 'next/server';

const LIST_URL = `${process.env.API_SERVER_URL}/lists`;

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page') || '1';
  const limit = request.nextUrl.searchParams.get('limit') || '10';

  try {
    const token = request.cookies.get('auth_token')?.value;

    const res = await fetch(`${LIST_URL}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Token invalid or server error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ data });
  } catch (err) {
    console.error('🔴 Error fetching lists:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const body = await request.json();

    const res = await fetch(LIST_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Token invalid or server error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ data }, { status: res.status });
  } catch (err) {
    console.error('🔴 Error creating list:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
