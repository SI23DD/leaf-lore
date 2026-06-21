'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@frontend/data/books';
import { useCart } from '@frontend/context/CartContext';

interface BookCardProps {
  book: Book;
  discount?: number;
}

export default function BookCard({ book, discount }: BookCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [added, setAdded] = useState(false);

  // Priority: 1. image_url (admin pasted) → 2. ISBN → 3. title search → 4. color fallback
  const coverUrl = !imgError
    ? (book as Book & { image_url?: string }).image_url
      ? (book as Book & { image_url?: string }).image_url!
      : book.isbn
        ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
        : `https://covers.openlibrary.org/b/title/${encodeURIComponent(book.title)}-M.jpg`
    : null;

  const isSoldOut = book.stock === 0;
  const originalPrice = discount ? Math.round(book.price / (1 - discount / 100)) : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut || added) return;
    addToCart(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  function handleCardClick() {
    router.push(`/book/${book.id}`);
  }

  return (
    <>
      <style>{`
        .ll-book-card {
          background: #fff;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: box-shadow 0.22s ease, transform 0.22s ease;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .ll-book-card:hover {
          box-shadow: 0 6px 20px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }
        .ll-book-card:focus-visible {
          outline: 2px solid #C82333;
          outline-offset: 2px;
        }
        .ll-add-btn {
          width: 100%;
          padding: 8px 0;
          font-size: 13px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, transform 0.12s;
          border: 1.5px solid #C82333;
          background: #fff;
          color: #C82333;
          letter-spacing: 0.2px;
        }
        .ll-add-btn:hover:not(:disabled) {
          background: #C82333;
          color: #fff;
        }
        .ll-add-btn.added {
          background: #C82333;
          color: #fff;
          transform: scale(1.04);
        }
        .ll-add-btn:disabled {
          border-color: #999;
          color: #999;
          background: #f8f8f8;
          cursor: not-allowed;
        }
        .ll-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 2;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 3px;
          line-height: 1.4;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .ll-badge-sale { background: #28A745; color: #fff; }
        .ll-badge-sold { background: #333; color: #fff; }
        .ll-cover-fallback {
          width: 100%;
          height: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 40px;
        }
        .ll-title {
          font-size: 13.5px;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0 0 3px 0;
          transition: color 0.15s;
        }
        .ll-book-card:hover .ll-title { color: #C82333; }
        @media (prefers-reduced-motion: reduce) {
          .ll-book-card { transition: none; }
          .ll-add-btn { transition: none; }
        }
      `}</style>

      <div
        className="ll-book-card"
        onClick={handleCardClick}
        role="article"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') handleCardClick(); }}
        aria-label={`${book.title} by ${book.author}`}
      >
        {/* Badge */}
        {isSoldOut ? (
          <span className="ll-badge ll-badge-sold">Sold Out</span>
        ) : discount ? (
          <span className="ll-badge ll-badge-sale">Sale</span>
        ) : null}

        {/* Cover image */}
        <div style={{ height: 260, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          {coverUrl ? (
            <>
              {!imgLoaded && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: book.coverColor || '#e9ecef',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36,
                }}>
                  📚
                </div>
              )}
              <img
                src={coverUrl}
                alt={book.title}
                onError={() => setImgError(true)}
                onLoad={() => setImgLoaded(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  opacity: imgLoaded ? 1 : 0,
                  transition: 'opacity 0.35s ease',
                }}
              />
            </>
          ) : (
            <div
              className="ll-cover-fallback"
              style={{ backgroundColor: book.coverColor || '#dee2e6' }}
            >
              <span>📚</span>
              <p style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
                padding: '0 16px',
                lineHeight: 1.4,
                maxHeight: 56,
                overflow: 'hidden',
              }}>
                {book.title}
              </p>
            </div>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <p className="ll-title">{book.title}</p>
          <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{book.author}</p>

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, marginTop: 'auto' }}>
            {discount && originalPrice ? (
              <>
                <span style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>₹{originalPrice}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#C82333' }}>₹{book.price}</span>
              </>
            ) : (
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>₹{book.price}</span>
            )}
          </div>

          {/* Add to cart button */}
          <button
            className={`ll-add-btn${added ? ' added' : ''}`}
            onClick={handleAddToCart}
            disabled={isSoldOut}
            aria-label={isSoldOut ? 'Sold out' : `Add ${book.title} to cart`}
          >
            {isSoldOut ? 'Sold Out' : added ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </>
  );
}
