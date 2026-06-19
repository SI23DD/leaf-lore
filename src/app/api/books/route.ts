import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// GET /api/books — list all books with optional filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get('language');
  const genre = searchParams.get('genre');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'created_at';
  const order = searchParams.get('order') || 'desc';
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = supabaseAdmin.from('books').select('*', { count: 'exact' });

  if (language) query = query.eq('language', language);
  if (genre) query = query.eq('genre', genre);
  if (minPrice) query = query.gte('price', parseFloat(minPrice));
  if (maxPrice) query = query.lte('price', parseFloat(maxPrice));
  if (search) query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);

  const validSortCols = ['price', 'rating', 'title', 'created_at'];
  const sortCol = validSortCols.includes(sort) ? sort : 'created_at';
  query = query.order(sortCol, { ascending: order === 'asc' }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ books: data, total: count });
}

// POST /api/books — add a new book (admin only)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, author, price, language, genre, rating, description, cover_color, stock } = body;

  if (!title || !author || !price || !language || !genre) {
    return NextResponse.json({ error: 'title, author, price, language, genre are required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from('books').insert({
    title, author,
    price: parseFloat(price),
    language, genre,
    rating: rating ? parseFloat(rating) : 0,
    description: description || '',
    cover_color: cover_color || '#2D5016',
    stock: stock ? parseInt(stock) : 0,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ book: data }, { status: 201 });
}
