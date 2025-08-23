import { NextRequest, NextResponse } from 'next/server';
const BASE_URL = process.env.API_SERVER_URL;

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; collaboratorId: string } },
) {
  const { id, collaboratorId } = await params;

  if (!id || !collaboratorId) {
    return NextResponse.json({ error: 'Missing list ID or collaborator ID' }, { status: 400 });
  }

  try {
    const token = request.cookies.get('auth_token')?.value;

    const res = await fetch(`${BASE_URL}/lists/${id}/collaborators/${collaboratorId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(res);

    if (!res.ok) {
      return NextResponse.json({ error: 'Token invalid or server error' }, { status: res.status });
    }

    return NextResponse.json({ message: 'Collaborator removed successfully' }, { status: 200 });
  } catch (err) {
    console.error('🔴 Error removing collaborator:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; collaboratorId: string } },
) {
  const { id, collaboratorId } = await params;

  if (!id || !collaboratorId) {
    return NextResponse.json({ error: 'Missing list ID or collaborator ID' }, { status: 400 });
  }

  try {
    const token = request.cookies.get('auth_token')?.value;
    const body = await request.json();

    const res = await fetch(`${BASE_URL}/lists/${id}/collaborators/${collaboratorId}`, {
      method: 'PATCH',
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
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('🔴 Error updating collaborator role:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
