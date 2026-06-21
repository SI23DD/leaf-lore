import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

// GET /api/books
router.get('/', async (req: Request, res: Response) => {
  const { language, genre, minPrice, maxPrice, search, sort = 'created_at', order = 'desc', limit = '50', offset = '0' } = req.query as Record<string, string>;

  let query = supabaseAdmin.from('books').select('*', { count: 'exact' });

  if (language) query = query.eq('language', language);
  if (genre) query = query.eq('genre', genre);
  if (minPrice) query = query.gte('price', parseFloat(minPrice));
  if (maxPrice) query = query.lte('price', parseFloat(maxPrice));
  if (search) query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);

  const validSortCols = ['price', 'rating', 'title', 'created_at'];
  const sortCol = validSortCols.includes(sort) ? sort : 'created_at';
  query = query.order(sortCol, { ascending: order === 'asc' }).range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ books: data, total: count });
});

// POST /api/books
router.post('/', async (req: Request, res: Response) => {
  const { title, author, price, language, genre, rating, description, cover_color, stock } = req.body;
  if (!title || !author || !price || !language || !genre) {
    return res.status(400).json({ error: 'title, author, price, language, genre are required' });
  }
  const { data, error } = await supabaseAdmin.from('books').insert({
    title, author, price: parseFloat(price), language, genre,
    rating: rating ? parseFloat(rating) : 0,
    description: description || '',
    cover_color: cover_color || '#2D5016',
    stock: stock ? parseInt(stock) : 0,
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json({ book: data });
});

// GET /api/books/:id
router.get('/:id', async (req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.from('books').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Book not found' });
  return res.json({ book: data });
});

// PUT /api/books/:id
router.put('/:id', async (req: Request, res: Response) => {
  const allowed = ['title', 'author', 'price', 'language', 'genre', 'rating', 'description', 'cover_color', 'stock'];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  const { data, error } = await supabaseAdmin.from('books').update(updates).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ book: data });
});

// DELETE /api/books/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const { error } = await supabaseAdmin.from('books').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
});

export default router;
