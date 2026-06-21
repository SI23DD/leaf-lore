'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@frontend/data/books';
import { useCart } from '@frontend/context/CartContext';
import { useWishlist } from '@frontend/context/WishlistContext';

interface BookCardProps {
  book: Book;
  discount?: number;
}

export default function BookCard({ book, discount }: BookCardProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const router = useRouter();
  const wishlisted = isWishlisted(book.id);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [added, setAdded] = useState(false);
  const triedOL = useRef(false); // track if we already tried Open Library

  const bookAny = book as Book & { image_url?: string };

  // Direct Google Books cover URL (no API call needed!)
  // Falls back to Open Library, then colored cover
  const googleUrl = book.isbn
    ? `https://books.google.com/books/content?vid=ISBN${book.isbn}&printsec=frontcover&img=1&zoom=2&source=gbs_api`
    : null;
  const openLibraryUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
    : null;

  // Primary: admin URL > Google Books > null
  const primaryUrl = bookAny.image_url || googleUrl;

  function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    if (!triedOL.current && openLibraryUrl && img.src !== openLibraryUrl) {
      // Try Open Library as second chance
      triedOL.current = true;
      img.src = openLibraryUrl;
    } else {
      setImgFailed(true);
    }
  }

  const showImage = primaryUrl && !imgFailed;
  // imgFailed → show colored fallback

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
        <div style={{ height: 260, position: 'relative', overflow: 'hidden', flexShrink: 0, backgroundColor: book.coverColor || '#dee2e6' }}>
          {/* Colored cover always visible as base — image loads on top */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, gap: 8,
          }}>
            <span>📚</span>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', textAlign: 'center', padding: '0 12px', fontWeight: 600, lineHeight: 1.3, margin: 0 }}>
              {book.title}
            </p>
          </div>

          {showImage && (
            <img
              src={primaryUrl!}
              alt={book.title}
              onError={handleImgError}
              onLoad={(e) => {
                const img = e.currentTarget;
                // Google Books returns a tiny placeholder when no cover exists
                // naturalWidth < 10 = 1px placeholder → treat as error
                if (img.naturalWidth < 10 || img.naturalHeight < 10) {
                  handleImgError(e as React.SyntheticEvent<HTMLImageElement>);
                  return;
                }
                setImgLoaded(true);
              }}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
                opacity: imgLoaded ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            />
          )}

          {/* Keep the old fallback div here just for when showImage is false and no color */}
          {!showImage && false ? (
            <div
              className="ll-cover-fallback"
              style={{ backgroundColor: book.coverColor || '#dee2e6' }}
            >
              <span>📚</span>
            </div>
          ) : null}
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

          {/* Buttons row */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={`ll-add-btn${added ? ' added' : ''}`}
              onClick={handleAddToCart}
              disabled={isSoldOut}
              style={{ flex: 1 }}
              aria-label={isSoldOut ? 'Sold out' : `Add ${book.title} to cart`}
            >
              {isSoldOut ? 'Sold Out' : added ? '✓ Added!' : 'Add to Cart'}
            </button>
            {/* Wishlist heart button */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleWishlist(book.id); }}
              title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              style={{
                width: 36, height: 36, borderRadius: 6, border: wishlisted ? '1.5px solid #C82333' : '1.5px solid #ddd',
                background: wishlisted ? '#fff0f0' : '#fff', cursor: 'pointer',
                fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.18s ease',
              }}
            >
              {wishlisted ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
