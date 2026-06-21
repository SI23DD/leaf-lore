import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

// GET /api/orders
router.get('/', async (req: Request, res: Response) => {
  const { status, email, limit = '50', offset = '0' } = req.query as Record<string, string>;
  let query = supabaseAdmin
    .from('orders')
    .select('*, order_items(*, book:books(title, cover_color))', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
  if (status) query = query.eq('status', status);
  if (email) query = query.eq('customer_email', email);
  const { data, error, count } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ orders: data, total: count });
});

// POST /api/orders
router.post('/', async (req: Request, res: Response) => {
  const { customer_name, customer_email, items, user_id } = req.body;
  if (!customer_name || !customer_email || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'customer_name, customer_email, and items[] are required' });
  }
  const bookIds = items.map((i: {book_id: string}) => i.book_id);
  const { data: books, error: booksErr } = await supabaseAdmin.from('books').select('id, price, stock, title').in('id', bookIds);
  if (booksErr || !books) return res.status(500).json({ error: 'Failed to validate books' });
  const bookMap = Object.fromEntries(books.map((b: {id: string, price: number, stock: number, title: string}) => [b.id, b]));
  for (const item of items) {
    const book = bookMap[item.book_id];
    if (!book) return res.status(400).json({ error: `Book ${item.book_id} not found` });
    if (book.stock < item.quantity) return res.status(400).json({ error: `Insufficient stock for "${book.title}"` });
  }
  const total_amount = items.reduce((sum: number, item: {book_id: string; quantity: number}) => sum + bookMap[item.book_id].price * item.quantity, 0);
  const { data: order, error: orderErr } = await supabaseAdmin.from('orders').insert({ customer_name, customer_email, total_amount, status: 'Pending', user_id: user_id || null }).select().single();
  if (orderErr || !order) return res.status(500).json({ error: 'Failed to create order' });
  const orderItems = items.map((item: {book_id: string; quantity: number}) => ({ order_id: order.id, book_id: item.book_id, quantity: item.quantity, unit_price: bookMap[item.book_id].price }));
  const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(orderItems);
  if (itemsErr) { await supabaseAdmin.from('orders').delete().eq('id', order.id); return res.status(500).json({ error: 'Failed to save order items' }); }
  for (const item of items) { await supabaseAdmin.from('books').update({ stock: bookMap[item.book_id].stock - item.quantity }).eq('id', item.book_id); }
  return res.status(201).json({ order });
});

// GET /api/orders/:id
router.get('/:id', async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('orders').select('*, order_items(*, book:books(title, author, cover_color, price))').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Order not found' });
  return res.json({ order: data });
});

// PUT /api/orders/:id
router.put('/:id', async (req: Request, res: Response) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const { data, error } = await supabaseAdmin.from('orders').update({ status }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ order: data });
});

export default router;
