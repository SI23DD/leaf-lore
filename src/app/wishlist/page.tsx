'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@frontend/context/WishlistContext';
import { useCart } from '@frontend/context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Book {
  id: string; title: string; author: string; price: number;
  language: string; genre: string; rating: number;
  description: string; cover_color: string; stock: number;
  isbn?: string; image_url?: string;
}

function WishlistBookCard({ book, onRemove }: { book: Book; onRemove: () => void }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (book.image_url) { setImgSrc(book.image_url); return; }
    if (book.isbn) setImgSrc(`https://books.google.com/books/content?vid=ISBN${book.isbn}&printsec=frontcover&img=1&zoom=2&source=gbs_api`);
  }, [book.isbn, book.image_url]);

  function handleAddToCart() {
    addToCart({ ...book, coverColor: book.cover_color } as never);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  function handleMoveToCart() {
    addToCart({ ...book, coverColor: book.cover_color } as never);
    onRemove();
  }

  const stars = Math.round(book.rating);

  return (
    <div className="wl-card" style={{
      display: 'flex', gap: 20, background: '#fff', borderRadius: 12,
      border: '1px solid #eee', padding: 16, alignItems: 'flex-start',
      transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {/* Cover */}
      <Link href={`/book/${book.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
        <div className="wl-card-cover" style={{
          width: 100, height: 140, borderRadius: 8, overflow: 'hidden',
          backgroundColor: book.cover_color, position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {imgSrc && (
            <img src={imgSrc} alt={book.title}
              onLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalWidth > 10) setImgLoaded(true);
              }}
              onError={(e) => {
                // Try Open Library fallback
                if (book.isbn && !e.currentTarget.src.includes('covers.openlibrary')) {
                  e.currentTarget.src = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
                }
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
            />
          )}
          {!imgLoaded && (
            <span style={{ position: 'absolute', fontSize: 28, color: 'rgba(255,255,255,0.7)' }}>📚</span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link href={`/book/${book.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4, lineHeight: 1.3 }}>{book.title}</h3>
        </Link>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{book.author}</p>

        {/* Stars */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ fontSize: 12, color: i < stars ? '#FFC107' : '#ddd' }}>★</span>
          ))}
          <span style={{ fontSize: 11, color: '#999', marginLeft: 4 }}>{book.rating}</span>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, background: '#fff3f4', color: '#C82333', fontWeight: 600 }}>{book.genre}</span>
          <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, background: '#f5f5f5', color: '#555', fontWeight: 600 }}>{book.language}</span>
          {book.stock === 0 && <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, background: '#333', color: '#fff', fontWeight: 600 }}>Out of Stock</span>}
        </div>

        <p style={{ fontSize: 20, fontWeight: 800, color: '#C82333', marginBottom: 12 }}>₹{book.price}</p>

        {/* Action buttons */}
        <div className="wl-card-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={handleAddToCart} disabled={book.stock === 0}
            style={{
              padding: '8px 20px', borderRadius: 6, border: '1.5px solid #C82333',
              background: added ? '#C82333' : '#fff', color: added ? '#fff' : '#C82333',
              fontWeight: 600, fontSize: 13, cursor: book.stock === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s', opacity: book.stock === 0 ? 0.5 : 1,
            }}>
            {added ? '✓ Added!' : '+ Add to Cart'}
          </button>
          <button onClick={handleMoveToCart} disabled={book.stock === 0}
            style={{
              padding: '8px 20px', borderRadius: 6, border: '1.5px solid #28A745',
              background: '#fff', color: '#28A745',
              fontWeight: 600, fontSize: 13, cursor: book.stock === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s', opacity: book.stock === 0 ? 0.5 : 1,
            }}>
            Move to Cart
          </button>
          <button onClick={onRemove}
            style={{
              padding: '8px 16px', borderRadius: 6, border: '1px solid #ddd',
              background: '#fff', color: '#999', fontWeight: 500, fontSize: 13,
              cursor: 'pointer', transition: 'all 0.18s',
            }}>
            ✕ Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { ids, remove, clear } = useWishlist();
  const { addToCart } = useCart();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) { setBooks([]); setLoading(false); return; }
    setLoading(true);
    // Fetch all wishlisted books from API
    Promise.all(
      ids.map(id => fetch(`${API_URL}/api/books/${id}`).then(r => r.ok ? r.json() : null))
    ).then(results => {
      setBooks(results.filter(Boolean).map((r: { book: Book }) => r.book));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [ids]);

  function handleAddAllToCart() {
    books.filter(b => b.stock > 0).forEach(b => addToCart({ ...b, coverColor: b.cover_color } as never));
  }

  const inStock = books.filter(b => b.stock > 0);
  const total = inStock.reduce((s, b) => s + b.price, 0);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8' }}>
        <p style={{ color: '#aaa', fontSize: 16 }}>Loading your wishlist…</p>
      </div>
    );
  }

  if (ids.length === 0) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>🤍</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>Your wishlist is empty</h2>
          <p style={{ color: '#888', fontSize: 15, marginBottom: 28 }}>Save books you love by clicking the ❤️ heart button on any book.</p>
          <Link href="/shop" style={{
            display: 'inline-block', background: '#C82333', color: '#fff',
            padding: '12px 32px', borderRadius: 25, fontWeight: 700, fontSize: 14,
            textDecoration: 'none',
          }}>
            Browse Books →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8', padding: '32px 20px' }}>
      <style>{`
        @media (max-width: 768px) {
          .wl-outer { padding: 16px !important; }
          .wl-header { flex-direction: column !important; align-items: flex-start !important; }
          .wl-header-btns { width: 100%; display: flex; gap: 8px; }
          .wl-header-btns button { flex: 1; }
          .wl-layout { grid-template-columns: 1fr !important; }
          .wl-summary-sticky { position: static !important; }
          .wl-card { flex-wrap: wrap; }
          .wl-card-cover { width: 70px !important; height: 100px !important; }
          .wl-card-actions { flex-wrap: wrap !important; }
          .wl-card-actions button { flex: 1 1 auto; text-align: center; }
        }
      `}</style>
      <div className="wl-outer" style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div className="wl-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', marginBottom: 4 }}>
              ❤️ My Wishlist
            </h1>
            <p style={{ fontSize: 14, color: '#888' }}>{ids.length} book{ids.length !== 1 ? 's' : ''} saved</p>
          </div>
          <div className="wl-header-btns" style={{ display: 'flex', gap: 10 }}>
            {inStock.length > 0 && (
              <button onClick={handleAddAllToCart}
                style={{
                  padding: '10px 24px', borderRadius: 25, border: 'none',
                  background: '#C82333', color: '#fff', fontWeight: 700, fontSize: 13,
                  cursor: 'pointer', transition: 'opacity 0.18s',
                }}>
                Add All to Cart ({inStock.length})
              </button>
            )}
            <button onClick={clear}
              style={{
                padding: '10px 18px', borderRadius: 25, border: '1px solid #ddd',
                background: '#fff', color: '#888', fontWeight: 600, fontSize: 13,
                cursor: 'pointer',
              }}>
              Clear All
            </button>
          </div>
        </div>

        <div className="wl-layout" style={{ display: 'grid', gridTemplateColumns: '1fr minmax(240px, 280px)', gap: 24, alignItems: 'start' }}>

          {/* Book list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {books.map(book => (
              <WishlistBookCard key={book.id} book={book} onRemove={() => remove(book.id)} />
            ))}
          </div>

          {/* Summary card */}
          <div className="wl-summary-sticky" style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: 24, position: 'sticky', top: 90 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Wishlist Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Total items</span>
                <span style={{ fontWeight: 600 }}>{ids.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>In stock</span>
                <span style={{ fontWeight: 600, color: '#28A745' }}>{inStock.length}</span>
              </div>
              {books.length - inStock.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>Out of stock</span>
                  <span style={{ fontWeight: 600, color: '#C82333' }}>{books.length - inStock.length}</span>
                </div>
              )}
              <div style={{ borderTop: '1px solid #eee', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>Total value</span>
                <span style={{ fontWeight: 800, color: '#C82333', fontSize: 18 }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {inStock.length > 0 && (
              <button onClick={handleAddAllToCart}
                style={{
                  width: '100%', padding: '12px', borderRadius: 8, border: 'none',
                  background: '#C82333', color: '#fff', fontWeight: 700, fontSize: 14,
                  cursor: 'pointer', marginBottom: 10,
                }}>
                Add All to Cart
              </button>
            )}

            <Link href="/shop" style={{
              display: 'block', textAlign: 'center', padding: '10px',
              borderRadius: 8, border: '1px solid #ddd', color: '#555',
              fontWeight: 600, fontSize: 13, textDecoration: 'none',
            }}>
              Continue Shopping
            </Link>

            <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: '#f0fff4', fontSize: 12, color: '#276749', lineHeight: 1.5 }}>
              💚 Free delivery above ₹500<br />
              📦 Carefully packed orders<br />
              📱 Order via WhatsApp anytime
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
