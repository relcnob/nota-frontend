import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const LIST_URL = `${process.env.API_SERVER_URL}/users`;
  const { id } = await params;
  try {
    const token = request.cookies.get('auth_token')?.value;

    const res = await fetch(`${LIST_URL}/${id}/dashboard`, {
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
    console.error('🔴 Error fetching dashboard metrics', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
