import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const LIST_URL = `${process.env.API_SERVER_URL}/lists`;

export async function GET(request: NextRequest) {
  const token = (await cookies()).get('auth_token')?.value;
  const page = request.nextUrl.searchParams.get('page') || '1';
  const limit = request.nextUrl.searchParams.get('limit') || '10';

  if (!token) {
    return NextResponse.json({ error: 'No token' }, { status: 401 });
  }

  try {
    const res = await fetch(`${LIST_URL}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.log(res);
      return NextResponse.json({ error: 'Token invalid' }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({ data: data });
  } catch (err) {
    console.error('🔴 Error fetching lists:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
