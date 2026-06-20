import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@backend/lib/supabaseAdmin';

// GET /api/orders/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*, book:books(title, author, cover_color, price))')
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json({ order: data });
}

// PUT /api/orders/[id] — update order status (admin)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();

  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ order: data });
}
