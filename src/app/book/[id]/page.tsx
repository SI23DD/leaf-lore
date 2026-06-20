'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@frontend/context/CartContext';
import BookCard from '@frontend/components/BookCard';
import { useState, useEffect, useCallback } from 'react';

interface Book {
  id: string; title: string; author: string; price: number;
  language: string; genre: string; rating: number;
  description: string; cover_color: string; stock: number;
}

const languageBadgeColors: Record<string, string> = {
  'English': '#C82333', 'Japanese': '#C41E3A', 'Hindi': '#666666',
  'Marathi': '#4A235A', 'Manga/Anime': '#1F618D',
};

const MOCK_REVIEWS = [
  { name: 'Ananya R.', date: 'April 2025', rating: 5, text: 'Absolutely beautiful edition. The paper quality is wonderful and it arrived well-packaged. Would buy from Leaf & Lore again without a second thought.' },
  { name: 'Rohan M.', date: 'March 2025', rating: 4, text: 'Great read, shipped faster than expected. A small crease on the cover but the team sorted it out promptly. Solid service.' },
  { name: 'Sunita P.', date: 'February 2025', rating: 5, text: 'My third order from this shop. Each time the books come wrapped thoughtfully with a handwritten note. That touch makes all the difference.' },
];

function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ fontSize: size, color: i < rating ? '#E6A817' : '#DDD' }}>★</span>
      ))}
    </span>
  );
}

export default function BookDetailPage() {
  const { id } = useParams();
  const { addToCart, items } = useCart();
  const [added, setAdded] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const [related, setRelated] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/books/${id}`)
      .then(r => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then(data => {
        if (!data) return;
        setBook(data.book);
        fetch(`/api/books?genre=${encodeURIComponent(data.book.genre)}&limit=5`)
          .then(r => r.json())
          .then(d => setRelated((d.books || []).filter((b: Book) => b.id !== data.book.id).slice(0, 4)));
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const wl: string[] = JSON.parse(localStorage.getItem('lore_wishlist') || '[]');
    setWishlisted(wl.includes(id as string));
  }, [id]);

  const toggleWishlist = useCallback(() => {
    if (!id) return;
    const wl: string[] = JSON.parse(localStorage.getItem('lore_wishlist') || '[]');
    const next = wishlisted ? wl.filter(x => x !== id) : [...wl, id as string];
    localStorage.setItem('lore_wishlist', JSON.stringify(next));
    setWishlisted(!wishlisted);
  }, [id, wishlisted]);

  const handleAddToCart = () => {
    if (!book) return;
    for (let i = 0; i < qty; i++) addToCart({ ...book, coverColor: book.cover_color } as never);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => { window.location.href = '/cart'; }, 300);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
        <p className="text-gray-400">Loading…</p>
      </div>
    );
  }

  if (notFound || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#C82333', fontFamily: 'var(--font-playfair), serif' }}>Book not found</h2>
          <Link href="/shop" className="text-sm underline" style={{ color: '#666666' }}>Back to Shop</Link>
        </div>
      </div>
    );
  }

  const cartItem = items.find(i => i.book.id === book.id);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const waUrl = `https://wa.me/?text=${encodeURIComponent(`Check out "${book.title}" by ${book.author} on Leaf & Lore: ${pageUrl}`)}`;
  const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just found "${book.title}" by ${book.author} on @leafandlore`)}&url=${encodeURIComponent(pageUrl)}`;

  // Thumbnail "views" — same colour, CSS filter transforms simulate different angles
  const thumbStyles = [
    { filter: 'none', transform: 'perspective(300px) rotateY(0deg)' },
    { filter: 'brightness(0.82) saturate(1.2)', transform: 'perspective(300px) rotateY(8deg)' },
    { filter: 'brightness(1.12) saturate(0.85)', transform: 'perspective(300px) rotateY(-6deg)' },
    { filter: 'sepia(0.3) brightness(0.9)', transform: 'perspective(300px) rotateX(6deg)' },
  ];
  const thumbLabels = ['Front cover', 'Right spine', 'Left angle', 'Top view'];

  return (
    <div style={{ backgroundColor: '#ffffff' }} className="min-h-screen">
      <style>{`
        :root {
          --green: #C82333;
          --brown: #666666;
          --cream: #ffffff;
        }

        /* ── Breadcrumb ── */
        .breadcrumb {
          display: flex; flex-wrap: wrap; align-items: center; gap: 6px;
          font-size: 0.8rem; color: #999; margin-bottom: 32px;
          animation: fadeIn 0.5s ease forwards;
        }
        .breadcrumb a { color: #666666; text-decoration: none; transition: color 0.15s; }
        .breadcrumb a:hover { color: #C82333; text-decoration: underline; }
        .breadcrumb-sep { color: #CCC; }
        .breadcrumb-current { color: #555; font-weight: 500; }

        /* ── Gallery ── */
        .gallery-col { display: flex; flex-direction: column; gap: 16px; animation: scaleIn 0.55s 0.05s ease both; }
        .gallery-main {
          width: 100%; aspect-ratio: 3/4; max-width: 300px; border-radius: 16px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1);
          transition: filter 0.3s ease, transform 0.3s ease;
          padding: 24px 16px; text-align: center; position: relative; overflow: hidden;
        }
        .gallery-main::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 40%;
          background: linear-gradient(to bottom, rgba(255,255,255,0.12), transparent);
          pointer-events: none;
          border-radius: 16px 16px 0 0;
        }
        .gallery-thumbs { display: flex; gap: 10px; }
        .gallery-thumb {
          flex: 1; aspect-ratio: 3/4; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; border: 2px solid transparent;
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          overflow: hidden; position: relative;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
        .gallery-thumb:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.18); }
        .gallery-thumb.active { border-color: #C82333; }
        .gallery-thumb-label {
          position: absolute; bottom: 3px; left: 0; right: 0;
          text-align: center; font-size: 0.55rem; color: rgba(255,255,255,0.7);
          font-weight: 600; letter-spacing: 0.04em;
        }

        /* ── Info column ── */
        .info-col { animation: fadeInRight 0.55s 0.1s ease both; }

        /* ── Qty selector ── */
        .qty-row { display: flex; align-items: center; gap: 12px; margin-bottom: 0; }
        .qty-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1.5px solid #DDD; background: #fff;
          font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: border-color 0.15s, background 0.15s; font-family: inherit;
          color: #1a1a1a;
        }
        .qty-btn:hover:not(:disabled) { border-color: #C82333; background: rgba(200,35,51,0.05); }
        .qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .qty-val { width: 32px; text-align: center; font-weight: 700; font-size: 1rem; color: #1a1a1a; }

        /* ── Buttons ── */
        .btn-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px; }
        .btn-cart {
          flex: 1; min-width: 140px; padding: 13px 20px;
          background: #C82333; color: #fff;
          border: none; border-radius: 8px; font-size: 0.95rem; font-weight: 600;
          cursor: pointer; transition: background 0.2s, transform 0.15s; font-family: inherit;
        }
        .btn-cart:hover:not(:disabled) { background: #A71D2A; transform: translateY(-1px); }
        .btn-cart:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-buy {
          flex: 1; min-width: 120px; padding: 13px 20px;
          background: #666666; color: #fff;
          border: none; border-radius: 8px; font-size: 0.95rem; font-weight: 600;
          cursor: pointer; transition: background 0.2s, transform 0.15s; font-family: inherit;
        }
        .btn-buy:hover:not(:disabled) { background: #A71D2A; transform: translateY(-1px); }
        .btn-buy:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-wish {
          width: 46px; height: 46px; border-radius: 8px;
          border: 1.5px solid #DDD; background: #fff;
          font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          flex-shrink: 0;
        }
        .btn-wish:hover { border-color: #C0392B; transform: scale(1.06); }
        .btn-wish.active { border-color: #C0392B; background: #FFF5F5; }

        /* ── Trust badges ── */
        .trust-row {
          display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px;
        }
        .trust-badge {
          display: flex; align-items: center; gap: 6px;
          background: rgba(200,35,51,0.06); border-radius: 6px;
          padding: 6px 10px; font-size: 0.78rem; font-weight: 600; color: #C82333;
        }

        /* ── Share ── */
        .share-row { display: flex; align-items: center; gap: 8px; margin-top: 18px; flex-wrap: wrap; }
        .share-label { font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #AAA; }
        .share-btn {
          padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;
          border: 1.5px solid #DDD; background: #fff; cursor: pointer; transition: all 0.15s;
          color: #444; font-family: inherit;
        }
        .share-btn:hover { border-color: #C82333; color: #C82333; }
        .share-btn.wa { border-color: #25D366; color: #25D366; }
        .share-btn.wa:hover { background: #25D366; color: #fff; }
        .share-btn.tw:hover { border-color: #1DA1F2; color: #1DA1F2; }
        .share-btn.copied { border-color: #C82333; color: #C82333; background: rgba(200,35,51,0.05); }

        /* ── Tabs ── */
        .tabs-section { margin-top: 56px; animation: fadeInUp 0.55s 0.25s ease both; }
        .tab-nav { display: flex; border-bottom: 1.5px solid #E8E2D8; gap: 0; margin-bottom: 28px; }
        .tab-btn {
          padding: 12px 20px; background: none; border: none; border-bottom: 2.5px solid transparent;
          margin-bottom: -1.5px; font-size: 0.9rem; font-weight: 600; color: #AAA;
          cursor: pointer; transition: color 0.2s, border-color 0.2s; font-family: inherit;
          white-space: nowrap;
        }
        .tab-btn.active { color: #C82333; border-bottom-color: #C82333; }
        .tab-btn:hover:not(.active) { color: #555; }
        .tab-panel { animation: fadeIn 0.3s ease forwards; }
        .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
        .detail-item {
          background: #fff; border-radius: 10px; padding: 14px 16px;
          box-shadow: 0 1px 6px rgba(200,35,51,0.06);
        }
        .detail-key { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #AAA; margin-bottom: 4px; }
        .detail-val { font-size: 0.95rem; font-weight: 600; color: #1a1a1a; }

        /* ── Reviews ── */
        .review-list { display: flex; flex-direction: column; gap: 16px; }
        .review-card {
          background: #fff; border-radius: 12px; padding: 20px 22px;
          box-shadow: 0 2px 10px rgba(200,35,51,0.06);
        }
        .review-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; }
        .review-name { font-weight: 700; font-size: 0.9rem; color: #1a1a1a; }
        .review-date { font-size: 0.8rem; color: #AAA; }
        .review-text { font-size: 0.875rem; color: #555; line-height: 1.7; margin-top: 8px; }

        /* ── Related ── */
        .related-section { margin-top: 64px; animation: fadeInUp 0.55s 0.35s ease both; }

        /* keyframe re-declarations */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.93); } to { opacity: 1; transform: scale(1); } }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep" aria-hidden="true">›</span>
          <Link href="/shop">Shop</Link>
          <span className="breadcrumb-sep" aria-hidden="true">›</span>
          <Link href={`/shop?genre=${encodeURIComponent(book.genre)}`}>{book.genre}</Link>
          <span className="breadcrumb-sep" aria-hidden="true">›</span>
          <span className="breadcrumb-current">{book.title}</span>
        </nav>

        {/* Main two-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', marginBottom: '0', alignItems: 'start' }}>

          {/* LEFT: Image gallery */}
          <div className="gallery-col">
            {/* Main view */}
            <div className="gallery-main"
              style={{
                backgroundColor: book.cover_color,
                filter: thumbStyles[activeThumb].filter,
                transform: thumbStyles[activeThumb].transform,
              }}>
              <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>📚</div>
              <p style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', color: 'rgba(255,255,255,0.92)', fontSize: '1rem', fontWeight: 600, lineHeight: 1.3, textAlign: 'center' }}>
                {book.title}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>{book.author}</p>
            </div>
            {/* Thumbnails */}
            <div className="gallery-thumbs" role="tablist" aria-label="Book views">
              {thumbStyles.map((s, i) => (
                <div key={i}
                  className={`gallery-thumb${activeThumb === i ? ' active' : ''}`}
                  onClick={() => setActiveThumb(i)}
                  role="tab"
                  aria-selected={activeThumb === i}
                  aria-label={thumbLabels[i]}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setActiveThumb(i)}
                  style={{ backgroundColor: book.cover_color, filter: s.filter }}>
                  <span style={{ fontSize: '1.2rem' }}>📚</span>
                  <span className="gallery-thumb-label">{thumbLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Info */}
          <div className="info-col">
            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: 999, color: '#fff', fontWeight: 600, backgroundColor: languageBadgeColors[book.language] || '#C82333' }}>
                {book.language}
              </span>
              <span style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: 999, backgroundColor: '#F0EBE3', color: '#666666', fontWeight: 600 }}>
                {book.genre}
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', color: '#1a1a1a', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: 10 }}>
              {book.title}
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#666666', marginBottom: 14, fontWeight: 500 }}>{book.author}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <StarRow rating={Math.round(book.rating)} />
              <span style={{ fontSize: '0.85rem', color: '#777', fontWeight: 600 }}>{book.rating}/5</span>
            </div>

            {/* Price + stock */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 700, color: '#C82333', fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
                ₹{book.price}
              </span>
              <span style={{ fontSize: '0.85rem', color: book.stock > 0 ? '#C82333' : '#C0392B', fontWeight: 600 }}>
                {book.stock > 0 ? `✓ In stock — ${book.stock} ${book.stock === 1 ? 'copy' : 'copies'} left` : '✕ Out of stock'}
              </span>
            </div>

            {cartItem && (
              <p style={{ fontSize: '0.83rem', color: '#888888', marginBottom: 14, fontWeight: 500 }}>
                {cartItem.quantity} already in your cart
              </p>
            )}

            {/* Qty + wishlist row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#AAA', marginRight: 8 }}>Qty</span>
                <div className="qty-row">
                  <button className="qty-btn" aria-label="Decrease quantity"
                    disabled={qty <= 1} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-val" aria-live="polite" aria-atomic="true">{qty}</span>
                  <button className="qty-btn" aria-label="Increase quantity"
                    disabled={qty >= book.stock} onClick={() => setQty(q => Math.min(book.stock, q + 1))}>+</button>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="btn-row">
              <button className="btn-cart" onClick={handleAddToCart} disabled={book.stock === 0} aria-label="Add to cart">
                {added ? '✓ Added!' : '+ Add to Cart'}
              </button>
              <button className="btn-buy" onClick={handleBuyNow} disabled={book.stock === 0} aria-label="Buy now">
                Buy Now
              </button>
              <button
                className={`btn-wish${wishlisted ? ' active' : ''}`}
                onClick={toggleWishlist}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={wishlisted}>
                {wishlisted ? '❤️' : '🤍'}
              </button>
            </div>

            {/* Trust badges */}
            <div className="trust-row">
              <div className="trust-badge"><span aria-hidden="true">🚚</span> Free Shipping ₹500+</div>
              <div className="trust-badge"><span aria-hidden="true">↩️</span> Easy Returns</div>
              <div className="trust-badge"><span aria-hidden="true">🔒</span> Secure Payment</div>
            </div>

            {/* Share */}
            <div className="share-row">
              <span className="share-label">Share</span>
              <button className={`share-btn${linkCopied ? ' copied' : ''}`} onClick={handleCopyLink}>
                {linkCopied ? '✓ Copied!' : '🔗 Copy link'}
              </button>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="share-btn wa">
                WhatsApp
              </a>
              <a href={twUrl} target="_blank" rel="noopener noreferrer" className="share-btn tw">
                Twitter / X
              </a>
            </div>
          </div>
        </div>

        {/* ── Tabs: Description / Details / Reviews ── */}
        <div className="tabs-section">
          <nav className="tab-nav" role="tablist" aria-label="Book information tabs">
            {(['description', 'details', 'reviews'] as const).map(tab => (
              <button key={tab}
                className={`tab-btn${activeTab === tab ? ' active' : ''}`}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'reviews' && ' (3)'}
              </button>
            ))}
          </nav>

          <div role="tabpanel">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <p style={{ color: '#444', lineHeight: 1.85, fontSize: '0.95rem', maxWidth: '680px' }}>
                  {book.description}
                </p>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="tab-panel detail-grid">
                {[
                  { key: 'Language', val: book.language },
                  { key: 'Genre', val: book.genre },
                  { key: 'Rating', val: `${book.rating} / 5` },
                  { key: 'Stock', val: `${book.stock} copies` },
                  { key: 'Format', val: 'Paperback' },
                  { key: 'Publisher', val: 'Leaf & Lore Editions' },
                ].map(({ key, val }) => (
                  <div key={key} className="detail-item">
                    <p className="detail-key">{key}</p>
                    <p className="detail-val">{val}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-panel review-list">
                {MOCK_REVIEWS.map((r, i) => (
                  <div key={i} className="review-card">
                    <div className="review-header">
                      <div>
                        <p className="review-name">{r.name}</p>
                        <StarRow rating={r.rating} size={14} />
                      </div>
                      <p className="review-date">{r.date}</p>
                    </div>
                    <p className="review-text">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── You Might Also Like ── */}
        {related.length > 0 && (
          <div className="related-section">
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', color: '#C82333', fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>
              You Might Also Like
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
              {related.map(b => <BookCard key={b.id} book={{ ...b, coverColor: b.cover_color } as never} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
