'use client';
import Link from 'next/link';
import { Book } from '@/data/books';
import { useCart } from '@/context/CartContext';

const languageBadgeColors: Record<string, string> = {
  'English': '#2D5016',
  'Japanese': '#C41E3A',
  'Hindi': '#8B4513',
  'Marathi': '#4A235A',
  'Manga/Anime': '#1F618D',
};

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();

  return (
    <div
      className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}
    >
      <Link href={`/book/${book.id}`}>
        <div
          className="relative h-52 flex items-center justify-center"
          style={{ backgroundColor: book.coverColor }}
        >
          <div className="text-center px-4">
            <div className="text-5xl mb-2">📚</div>
            <p
              style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(255,255,255,0.9)' }}
              className="text-sm font-semibold leading-tight line-clamp-2 text-center"
            >
              {book.title}
            </p>
          </div>
          <div className="absolute top-2 right-2">
            <span
              className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
              style={{ backgroundColor: languageBadgeColors[book.language] || '#2D5016' }}
            >
              {book.language}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/book/${book.id}`}>
          <h3
            style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a1a' }}
            className="font-semibold text-base leading-tight mb-1 line-clamp-2 hover:text-green-800 transition-colors cursor-pointer"
          >
            {book.title}
          </h3>
        </Link>
        <p className="text-sm mb-2" style={{ color: '#8B4513' }}>{book.author}</p>
        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-500 text-sm">★</span>
          <span className="text-xs text-gray-600">{book.rating}</span>
          <span className="text-xs text-gray-400 ml-1">· {book.genre}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg" style={{ color: '#2D5016' }}>₹{book.price}</span>
          <button
            onClick={() => addToCart(book)}
            className="text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 hover:scale-105 hover:opacity-90"
            style={{ backgroundColor: '#2D5016', color: 'white' }}
          >
            + Cart
          </button>
        </div>
      </div>
    </div>
  );
}
