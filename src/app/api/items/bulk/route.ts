import { NextRequest, NextResponse } from 'next/server';

const BULK_UPDATE_URL = `${process.env.API_SERVER_URL}/items/bulk`;

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    console.log('🔵 Bulk POST request body:', body);

    // Optional: validate body shape
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const res = await fetch(BULK_UPDATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: body }),
    });

    console.log(res);

    if (!res.ok) {
      const errText = await res.text();
      console.error('❌ Bulk update failed:', errText);
      return NextResponse.json({ error: 'Bulk update failed' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ data });
  } catch (err) {
    console.error('🔴 Server error in bulk update:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const res = await fetch(BULK_UPDATE_URL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: body }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('❌ Bulk PATCH failed:', errText);
      return NextResponse.json({ error: 'Bulk update failed' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ data });
  } catch (err) {
    console.error('🔴 Server error during PATCH bulk update:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
