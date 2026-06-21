'use client';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import BookCard from '@frontend/components/BookCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Books with known ISBNs for hero display
const HERO_ISBNS = [
  { isbn: '9780735211292', title: 'Atomic Habits',       coverColor: '#2D5016', id: 'hero1' },
  { isbn: '9780375704024', title: 'Norwegian Wood',      coverColor: '#2C3E50', id: 'hero2' },
  { isbn: '9780062315007', title: 'The Alchemist',       coverColor: '#B7950B', id: 'hero3' },
  { isbn: '9781612680194', title: 'Rich Dad Poor Dad',   coverColor: '#C41E3A', id: 'hero4' },
];

const authorCards = [
  { name: 'Matt Haig',           initial: 'M', color: '#1B4332' },
  { name: 'Haruki Murakami',     initial: 'H', color: '#2C3E50' },
  { name: 'Munshi Premchand',    initial: 'M', color: '#8B4513' },
  { name: 'Eiichiro Oda',        initial: 'E', color: '#C41E3A' },
  { name: 'V.S. Khandekar',      initial: 'V', color: '#556B2F' },
];

const categories = [
  { label: 'Fiction',     href: '/shop?genre=Fiction',     icon: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#C82333" strokeWidth="1.5" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/></svg> },
  { label: 'Non-fiction', href: '/shop?genre=Non-fiction', icon: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#C82333" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg> },
  { label: 'Mystery',     href: '/shop?genre=Mystery',     icon: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#C82333" strokeWidth="1.5" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> },
  { label: 'Romance',     href: '/shop?genre=Romance',     icon: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#C82333" strokeWidth="1.5" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { label: 'Fantasy',     href: '/shop?genre=Fantasy',     icon: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#C82333" strokeWidth="1.5" aria-hidden="true"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg> },
  { label: 'Self-help',   href: '/shop?genre=Self-help',   icon: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#C82333" strokeWidth="1.5" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.5-1 4.5-3 6l-1 3H9l-1-3C6 13.5 5 11.5 5 9a7 7 0 0 1 7-7z"/></svg> },
  { label: 'Manga',       href: '/shop?genre=Manga',       icon: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#C82333" strokeWidth="1.5" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { label: 'Poetry',      href: '/shop?genre=Poetry',      icon: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#C82333" strokeWidth="1.5" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
];

// ── Reusable: horizontal scroll book section ──────────────────────────────────

interface ApiBook {
  id: string; title: string; author: string; price: number;
  language: string; genre: string; rating: number;
  description: string; cover_color: string; stock: number;
  isbn?: string; image_url?: string;
}

function useBooks(genre?: string, language?: string) {
  const [books, setBooks] = useState<ApiBook[]>([]);
  useEffect(() => {
    const params = new URLSearchParams({ limit: '6' });
    if (genre) params.set('genre', genre);
    if (language) params.set('language', language);
    fetch(`${API_URL}/api/books?${params}`)
      .then(r => r.json())
      .then(d => setBooks(d.books || []))
      .catch(() => {});
  }, [genre, language]);
  return books;
}

function BookSection({ title, slug, genre, language, discount }: {
  title: string; slug: string; genre?: string; language?: string; discount: number;
}) {
  const bookList = useBooks(genre, language);
  const ref = useRef<HTMLDivElement>(null);
  function scroll(dir: 'l' | 'r') {
    ref.current?.scrollBy({ left: dir === 'r' ? 220 : -220, behavior: 'smooth' });
  }
  return (
    <section style={{ backgroundColor: '#fff', padding: '36px 0 40px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
            {title}
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => scroll('l')} aria-label="Scroll left"
              style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #C82333', background: '#fff', color: '#C82333', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.18s, color 0.18s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#C82333'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#C82333'; }}>‹</button>
            <button onClick={() => scroll('r')} aria-label="Scroll right"
              style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #C82333', background: '#fff', color: '#C82333', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.18s, color 0.18s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#C82333'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#C82333'; }}>›</button>
          </div>
        </div>
        {bookList.length === 0 ? (
          <div style={{ display: 'flex', gap: 16 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ minWidth: 196, height: 300, borderRadius: 8, background: '#f0f0f0', flexShrink: 0 }} className="skeleton" />
            ))}
          </div>
        ) : (
          <div ref={ref} style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
            {bookList.map(b => (
              <div key={b.id} style={{ minWidth: 196, maxWidth: 196, flexShrink: 0 }}>
                <BookCard book={{ ...b, coverColor: b.cover_color } as never} discount={discount} />
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link href={`/shop${slug}`}
            style={{ display: 'inline-block', background: '#C82333', color: '#fff', padding: '10px 32px', borderRadius: 25, fontWeight: 700, fontSize: 14, textDecoration: 'none', transition: 'background 0.18s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#A71D2A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#C82333'; }}>
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const marqueeText = '📚 Free delivery above ₹500  ·  New arrivals every week  ·  10 genres, 5 languages  ·  Summer Sale — up to 40% off  ·  ';

  return (
    <div style={{ backgroundColor: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a1a1a' }}>

      {/* ── 0. Announcement bar ──────────────────────────────────────────── */}
      <div style={{ background: '#FFC107', color: '#1a1a1a', textAlign: 'center', padding: '7px 16px', fontSize: 13, fontWeight: 600, letterSpacing: '0.02em' }}>
        🎉 Summer Sale is LIVE — Get up to 40% off on selected titles. Use code <strong>SUMMER40</strong> at checkout.
      </div>

      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes hp-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes hp-float { 0%,100%{transform:translateY(0) rotate(var(--rot))} 50%{transform:translateY(-12px) rotate(var(--rot))} }
        @keyframes hp-fadein { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .hp-book-float { animation: hp-float 4s ease-in-out infinite; }
        .hp-book-float:nth-child(2) { animation-delay: 1.2s; }
        .hp-book-float:nth-child(3) { animation-delay: 2.4s; }
        .hp-book-float:nth-child(4) { animation-delay: 0.6s; }
        .hp-hero-title { animation: hp-fadein 0.7s ease both; }
        .hp-hero-sub   { animation: hp-fadein 0.7s 0.15s ease both; }
        .hp-hero-cta   { animation: hp-fadein 0.7s 0.3s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .hp-book-float,.hp-hero-title,.hp-hero-sub,.hp-hero-cta { animation: none !important; }
        }
        @media (max-width: 768px) {
          .hp-hero-books { display: none !important; }
          .hp-hero-inner { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <section style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        padding: '72px 20px 64px', overflow: 'hidden', position: 'relative'
      }}>
        {/* Dark warm overlay - NOT blue */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(20,10,5,0.88) 0%, rgba(60,20,10,0.82) 50%, rgba(20,10,5,0.88) 100%)', pointerEvents: 'none' }} />

        <div className="hp-hero-inner" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', position: 'relative', zIndex: 1 }}>

          {/* Left — Text */}
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(200,35,51,0.2)', border: '1px solid rgba(200,35,51,0.4)', color: '#ff6b7a', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 20, marginBottom: 20, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              🎉 Summer Sale — Up to 40% Off
            </div>
            <h1 className="hp-hero-title" style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 18, letterSpacing: '-0.02em' }}>
              Your Ultimate<br />
              <span style={{ color: '#FFC107' }}>Book Destination</span>
            </h1>
            <p className="hp-hero-sub" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 32, maxWidth: 420, lineHeight: 1.7 }}>
              Discover 45+ books across 5 languages — English, Hindi, Marathi, Japanese & Manga. From timeless classics to contemporary favourites.
            </p>
            <div className="hp-hero-cta" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/shop"
                style={{ display: 'inline-block', background: '#C82333', color: '#fff', padding: '14px 36px', borderRadius: 6, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 20px rgba(200,35,51,0.4)', transition: 'transform 0.18s, box-shadow 0.18s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 28px rgba(200,35,51,0.5)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ''; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(200,35,51,0.4)'; }}>
                Shop Now →
              </Link>
              <Link href="/categories"
                style={{ display: 'inline-block', background: 'transparent', color: '#fff', padding: '14px 28px', borderRadius: 6, fontWeight: 600, fontSize: 15, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.3)', transition: 'border-color 0.18s, background 0.18s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#fff'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}>
                Browse Categories
              </Link>
            </div>
            {/* Stats row */}
            <div style={{ display: 'flex', gap: 32, marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {[['45+', 'Books'], ['5', 'Languages'], ['10', 'Genres'], ['500+', 'Readers']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#FFC107' }}>{n}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Real book cover images using HERO_ISBNS */}
          <div className="hp-hero-books" style={{ display: 'flex', gap: 16, alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8 }}>
            {HERO_ISBNS.map(({ isbn, title, coverColor, id }, i) => {
              const rot = ['-6deg', '2deg', '8deg', '-3deg'][i];
              const scale = ['0.92', '1', '0.94', '0.88'][i];
              return (
              <div key={id}
                className="hp-book-float"
                style={{ '--rot': rot, display: 'block', width: 120, height: 178, borderRadius: 6, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', transform: `rotate(${rot}) scale(${scale})`, flexShrink: 0, position: 'relative', zIndex: i === 1 ? 3 : 1, background: coverColor } as React.CSSProperties}>
                <img src={`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`} alt={title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)', padding: '20px 8px 8px' }}>
                  <p style={{ color: '#fff', fontSize: 9, fontWeight: 700, textAlign: 'center', lineHeight: 1.3, margin: 0 }}>{title}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Marquee strip ──────────────────────────────────────────────────── */}
      <div className="marquee-strip" style={{ background: '#8B0000', color: '#fff', padding: '9px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <span
          className="hp-marquee-inner"
          style={{ display: 'inline-block', animation: 'hp-marquee 28s linear infinite', fontSize: 13, fontWeight: 500, letterSpacing: '0.03em' }}
        >
          {marqueeText.repeat(4)}
        </span>
      </div>

      {/* ── 2. Category circles ────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '36px 20px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 20, overflowX: 'auto', justifyContent: 'space-around', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <Link
                key={cat.label}
                href={cat.href}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}
              >
                <div
                  style={{
                    width: 88, height: 88, borderRadius: '50%',
                    border: '1.5px solid #e0e0e0', background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#C82333'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 14px rgba(200,35,51,0.18)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e0e0e0'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  {cat.icon}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', textAlign: 'center' }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#f0f0f0' }} />

      {/* ── 3. Self-Help On Sale ────────────────────────────────────────────── */}
      <BookSection title="Self-Help On Sale" slug="?genre=Self-help" genre="Self-help" discount={15} />

      <div style={{ height: 1, background: '#f0f0f0' }} />

      {/* ── 4. Fiction On Sale ─────────────────────────────────────────────── */}
      <BookSection title="Fiction On Sale" slug="?genre=Fiction" genre="Fiction" discount={10} />

      <div style={{ height: 1, background: '#f0f0f0' }} />

      {/* ── 5. Wide promo banner ───────────────────────────────────────────── */}
      <section style={{ background: '#f6f6f6', padding: '32px 20px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left card — new books */}
          <div
            style={{ background: '#1a5c2a', borderRadius: 10, padding: '36px 32px', color: '#fff', position: 'relative', overflow: 'hidden', minHeight: 200 }}
          >
            <div style={{ position: 'absolute', right: -20, top: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.75, marginBottom: 6 }}>Just Arrived</p>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, lineHeight: 1.25 }}>NEW BOOKS AT ₹199</h3>
            <p style={{ fontSize: 14, opacity: 0.82, marginBottom: 20, lineHeight: 1.55 }}>New Stories. New Worlds. New You.</p>
            <div style={{ display: 'flex', gap: 18, marginBottom: 22, fontSize: 13, opacity: 0.88 }}>
              <span>✓ 100% Original</span>
              <span>✓ Sealed Packing</span>
            </div>
            <Link href="/shop" style={{ display: 'inline-block', background: '#fff', color: '#1a5c2a', padding: '9px 24px', borderRadius: 6, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
              Shop New Arrivals
            </Link>
          </div>

          {/* Right card — preloved books */}
          <div
            style={{ background: '#5c3317', borderRadius: 10, padding: '36px 32px', color: '#fff', position: 'relative', overflow: 'hidden', minHeight: 200 }}
          >
            <div style={{ position: 'absolute', right: -20, top: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.75, marginBottom: 6 }}>Pre-loved</p>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, lineHeight: 1.25 }}>PRELOVED BOOKS AT ₹149</h3>
            <p style={{ fontSize: 14, opacity: 0.82, marginBottom: 20, lineHeight: 1.55 }}>Great Stories. Greater Value.</p>
            <div style={{ display: 'flex', gap: 18, marginBottom: 22, fontSize: 13, opacity: 0.88 }}>
              <span>✓ Quality Checked</span>
              <span>✓ Carefully Curated</span>
            </div>
            <Link href="/shop" style={{ display: 'inline-block', background: '#fff', color: '#5c3317', padding: '9px 24px', borderRadius: 6, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
              Browse Preloved
            </Link>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#f0f0f0' }} />

      {/* ── 6. Romance On Sale ─────────────────────────────────────────────── */}
      <BookSection title="Romance On Sale" slug="?genre=Romance" genre="Romance" discount={12} />

      <div style={{ height: 1, background: '#f0f0f0' }} />

      {/* ── 7. Manga Sets ──────────────────────────────────────────────────── */}
      <BookSection title="Manga Sets" slug="?genre=Manga" genre="Manga" discount={8} />

      <div style={{ height: 1, background: '#f0f0f0' }} />

      {/* ── 8. Hindi Books ─────────────────────────────────────────────────── */}
      <BookSection title="Hindi Books" slug="?language=Hindi" language="Hindi" discount={10} />

      <div style={{ height: 1, background: '#f0f0f0' }} />

      {/* ── 9. Author-wise ─────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '36px 20px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 20 }}>
            Author-wise
          </h2>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {authorCards.map(author => (
              <Link
                key={author.name}
                href={`/shop?author=${encodeURIComponent(author.name)}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  minWidth: 160, background: '#fff', border: '1px solid #e8e8e8',
                  borderRadius: 10, padding: '24px 16px 18px', textDecoration: 'none',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  gap: 10,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 18px rgba(200,35,51,0.14)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'; (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; }}
              >
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: author.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 26, fontWeight: 800,
                  fontFamily: 'Georgia, serif',
                }}>
                  {author.initial}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', textAlign: 'center', lineHeight: 1.35 }}>{author.name}</span>
                <span style={{ fontSize: 18, color: '#C82333' }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#f0f0f0' }} />

      {/* ── 10. Trust badges ───────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '28px 20px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {[
            { icon: '✅', title: '100% New & Original Books', sub: 'Every title is brand new' },
            { icon: '🏷️', title: 'Unbelievable Prices',        sub: 'Best deals, always' },
            { icon: '📦', title: 'Carefully Packed',            sub: 'Arrives in perfect condition' },
            { icon: '🚚', title: 'Delivered with Care',         sub: 'Fast & reliable shipping' },
          ].map(badge => (
            <div key={badge.title} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{badge.icon}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a', marginBottom: 2 }}>{badge.title}</p>
                <p style={{ fontSize: 12, color: '#888' }}>{badge.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
