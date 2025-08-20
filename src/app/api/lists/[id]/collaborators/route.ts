import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const BASE_URL = process.env.API_SERVER_URL;

  const { email, role, listId } = await request.json();
  try {
    const token = request.cookies.get('auth_token')?.value;

    const res = await fetch(`${BASE_URL}/lists/${listId}/collaborators/email`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, role }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Token invalid or server error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('🔴 Error fetching user by email:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
