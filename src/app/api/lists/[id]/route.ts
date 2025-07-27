import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.API_SERVER_URL;

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Missing list ID' }, { status: 400 });
  }

  try {
    const token = request.cookies.get('auth_token')?.value;

    const res = await fetch(`${BASE_URL}/lists/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch list' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ data });
  } catch (err) {
    console.error('🔴 Error fetching list:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
