import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { key } = await req.json();
  const expectedKey = process.env.ADMIN_SECRET_KEY || 'leaflore-admin-2024';
  if (key === expectedKey) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 });
}
