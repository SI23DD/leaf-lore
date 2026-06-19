'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import BookCard from '@/components/BookCard';
import { useState, useEffect } from 'react';

interface Book {
  id: string; title: string; author: string; price: number;
  language: string; genre: string; rating: number;
  description: string; cover_color: string; stock: number;
}

const languageBadgeColors: Record<string, string> = {
  'English': '#2D5016', 'Japanese': '#C41E3A', 'Hindi': '#8B4513',
  'Marathi': '#4A235A', 'Manga/Anime': '#1F618D',
};

export default function BookDetailPage() {
  const { id } = useParams();
  const { addToCart, items } = useCart();
  const [added, setAdded] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const [related, setRelated] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/books/${id}`)
      .then(r => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then(data => {
        if (!data) return;
        setBook(data.book);
        // fetch related books by same genre
        fetch(`/api/books?genre=${encodeURIComponent(data.book.genre)}&limit=5`)
          .then(r => r.json())
          .then(d => setRelated((d.books || []).filter((b: Book) => b.id !== data.book.id).slice(0, 4)));
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
        <p className="text-gray-400">Loading…</p>
      </div>
    );
  }

  if (notFound || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#2D5016', fontFamily: 'var(--font-playfair), serif' }}>Book not found</h2>
          <Link href="/shop" className="text-sm underline" style={{ color: '#8B4513' }}>Back to Shop</Link>
        </div>
      </div>
    );
  }

  const cartItem = items.find(i => i.book.id === book.id);

  const handleAddToCart = () => {
    // CartContext expects the old Book shape — adapt cover_color → coverColor
    addToCart({ ...book, coverColor: book.cover_color } as never);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2' }} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm mb-8 hover:underline" style={{ color: '#8B4513' }}>
          ← Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Cover */}
          <div className="flex justify-center md:justify-start">
            <div className="w-72 h-96 rounded-2xl flex flex-col items-center justify-center shadow-2xl"
              style={{ backgroundColor: book.cover_color }}>
              <div className="text-6xl mb-4">📚</div>
              <p style={{ fontFamily: 'var(--font-playfair), serif', color: 'rgba(255,255,255,0.9)' }}
                className="text-center px-6 text-base font-semibold leading-tight">
                {book.title}
              </p>
              <p className="text-xs mt-2 opacity-60 text-white">{book.author}</p>
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex gap-2 mb-4">
              <span className="text-xs px-3 py-1 rounded-full text-white font-medium"
                style={{ backgroundColor: languageBadgeColors[book.language] || '#2D5016' }}>
                {book.language}
              </span>
              <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: '#F0EBE3', color: '#8B4513' }}>
                {book.genre}
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-playfair), serif', color: '#1a1a1a' }} className="text-4xl font-bold mb-3 leading-tight">
              {book.title}
            </h1>
            <p className="text-lg mb-4" style={{ color: '#8B4513' }}>{book.author}</p>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < Math.round(book.rating) ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">{book.rating}/5</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-base">{book.description}</p>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl font-bold" style={{ color: '#2D5016', fontFamily: 'var(--font-playfair), serif' }}>
                ₹{book.price}
              </span>
              <span className="text-sm text-gray-500">
                {book.stock > 0 ? `✅ In Stock (${book.stock} copies)` : '❌ Out of Stock'}
              </span>
            </div>

            {cartItem && (
              <p className="text-sm mb-4" style={{ color: '#7A9E7E' }}>{cartItem.quantity} already in cart</p>
            )}

            <button onClick={handleAddToCart} disabled={book.stock === 0}
              className="w-full sm:w-auto px-10 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: added ? '#7A9E7E' : '#2D5016', color: 'white' }}>
              {added ? '✓ Added to Cart!' : '+ Add to Cart'}
            </button>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D5016', fontFamily: 'var(--font-playfair), serif' }}>
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(b => <BookCard key={b.id} book={{ ...b, coverColor: b.cover_color } as never} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
