import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@backend/lib/supabaseAdmin';

// GET /api/orders — list all orders (admin)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const email = searchParams.get('email');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = supabaseAdmin
    .from('orders')
    .select('*, order_items(*, book:books(title, cover_color))', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);
  if (email) query = query.eq('customer_email', email);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ orders: data, total: count });
}

// POST /api/orders — place a new order (checkout)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customer_name, customer_email, items, user_id } = body;

  if (!customer_name || !customer_email || !items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'customer_name, customer_email, and items[] are required' }, { status: 400 });
  }

  // Validate stock and fetch current prices
  const bookIds: string[] = items.map((i: { book_id: string }) => i.book_id);
  const { data: books, error: booksErr } = await supabaseAdmin
    .from('books')
    .select('id, price, stock, title')
    .in('id', bookIds);

  if (booksErr || !books) return NextResponse.json({ error: 'Failed to validate books' }, { status: 500 });

  const bookMap = Object.fromEntries(books.map(b => [b.id, b]));
  for (const item of items) {
    const book = bookMap[item.book_id];
    if (!book) return NextResponse.json({ error: `Book ${item.book_id} not found` }, { status: 400 });
    if (book.stock < item.quantity) {
      return NextResponse.json({ error: `Insufficient stock for "${book.title}"` }, { status: 400 });
    }
  }

  // Calculate total using DB prices (never trust client prices)
  const total_amount = items.reduce((sum: number, item: { book_id: string; quantity: number }) => {
    return sum + bookMap[item.book_id].price * item.quantity;
  }, 0);

  // Create order
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .insert({ customer_name, customer_email, total_amount, status: 'Pending', user_id: user_id || null })
    .select()
    .single();

  if (orderErr || !order) return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });

  // Insert order items
  const orderItems = items.map((item: { book_id: string; quantity: number }) => ({
    order_id: order.id,
    book_id: item.book_id,
    quantity: item.quantity,
    unit_price: bookMap[item.book_id].price,
  }));

  const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(orderItems);
  if (itemsErr) {
    // Rollback order
    await supabaseAdmin.from('orders').delete().eq('id', order.id);
    return NextResponse.json({ error: 'Failed to save order items' }, { status: 500 });
  }

  // Decrement stock
  for (const item of items) {
    await supabaseAdmin
      .from('books')
      .update({ stock: bookMap[item.book_id].stock - item.quantity })
      .eq('id', item.book_id);
  }

  return NextResponse.json({ order }, { status: 201 });
}
