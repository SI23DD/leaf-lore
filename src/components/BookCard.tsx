'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Book } from '@/data/books';
import { useCart } from '@/context/CartContext';

interface BookCardProps {
  book: Book;
  discount?: number;
}

export default function BookCard({ book, discount }: BookCardProps) {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const coverUrl = book.isbn && !imgError
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
    : null;

  const stars = Math.round(book.rating);

  return (
    <div
      className="group relative rounded-xl overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: '#fff',
        border: '1px solid #E8E0D5',
        boxShadow: hovered ? '0 8px 32px rgba(45,80,22,0.13)' : '0 2px 8px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        minWidth: 200,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Discount badge */}
      {discount && (
        <div
          className="absolute top-2 left-2 z-10 text-white text-xs font-bold px-2 py-0.5 rounded"
          style={{ backgroundColor: '#e53e3e' }}
        >
          -{discount}%
        </div>
      )}

      {/* Cover image */}
      <Link href={`/book/${book.id}`}>
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{ height: 220, backgroundColor: book.coverColor }}
        >
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={book.title}
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full px-4" style={{ backgroundColor: book.coverColor }}>
              <span className="text-5xl mb-2">📚</span>
              <p className="text-xs font-semibold text-center leading-tight" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'Georgia, serif' }}>
                {book.title}
              </p>
            </div>
          )}

          {/* Hover quick actions */}
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center gap-2" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}>
              <button
                className="w-9 h-9 rounded-full flex items-center justify-center text-base transition-all"
                style={{ backgroundColor: 'white', color: '#e53e3e' }}
                title="Wishlist"
              >
                ♡
              </button>
              <Link
                href={`/book/${book.id}`}
                className="w-9 h-9 rounded-full flex items-center justify-center text-base transition-all"
                style={{ backgroundColor: 'white', color: '#2D5016' }}
                title="Quick view"
              >
                👁
              </Link>
            </div>
          )}
        </div>
      </Link>

      {/* Card body */}
      <div className="p-3">
        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ color: i < stars ? '#F6AD55' : '#D1D5DB', fontSize: 12 }}>★</span>
          ))}
          <span className="text-xs text-gray-400 ml-1">({book.rating})</span>
        </div>

        <Link href={`/book/${book.id}`}>
          <h3
            className="font-semibold text-sm leading-snug mb-0.5 line-clamp-2 hover:underline"
            style={{ color: '#1a1a1a', fontFamily: 'Georgia, serif', cursor: 'pointer' }}
          >
            {book.title}
          </h3>
        </Link>
        <p className="text-xs mb-2" style={{ color: '#8B4513' }}>{book.author}</p>

        <div className="flex items-center justify-between">
          <span className="font-bold text-base" style={{ color: '#2D5016' }}>₹{book.price}</span>
          {discount && (
            <span className="text-xs text-gray-400 line-through">₹{Math.round(book.price / (1 - discount / 100))}</span>
          )}
        </div>

        {/* Add to cart — appears on hover */}
        <button
          onClick={() => addToCart(book)}
          className="w-full mt-2 py-1.5 text-xs font-semibold rounded transition-all duration-200"
          style={{
            backgroundColor: hovered ? '#2D5016' : '#F0EBE3',
            color: hovered ? 'white' : '#2D5016',
            border: '1.5px solid #2D5016',
          }}
        >
          + Add to Cart
        </button>
      </div>
    </div>
  );
}
