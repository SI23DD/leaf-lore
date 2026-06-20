'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { books } from '@frontend/data/books';
import BookCard from '@frontend/components/BookCard';

// ── Data slices ───────────────────────────────────────────────────────────────

const selfHelpBooks = books.filter(b => b.genre === 'Self-help').slice(0, 5);
const fictionBooks  = books.filter(b => b.genre === 'Fiction').slice(0, 5);
const romanceBooks  = books.filter(b => b.genre === 'Romance').slice(0, 5);
const mangaBooks    = books.filter(b => b.genre === 'Manga').slice(0, 5);
const hindiBooks    = books.filter(b => b.language === 'Hindi').slice(0, 5);

const heroCoverBooks = [books[0], books[6], books[17]]; // Midnight Library, Norwegian Wood, Alchemist

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

function BookSection({
  title,
  slug,
  bookList,
  discount,
}: {
  title: string;
  slug: string;
  bookList: typeof books;
  discount: number;
}) {
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
            <button
              onClick={() => scroll('l')}
              aria-label="Scroll left"
              style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #C82333', background: '#fff', color: '#C82333', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.18s, color 0.18s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#C82333'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#C82333'; }}
            >‹</button>
            <button
              onClick={() => scroll('r')}
              aria-label="Scroll right"
              style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #C82333', background: '#fff', color: '#C82333', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.18s, color 0.18s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#C82333'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#C82333'; }}
            >›</button>
          </div>
        </div>
        <div
          ref={ref}
          style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}
        >
          {bookList.map(b => (
            <div key={b.id} style={{ minWidth: 196, maxWidth: 196, flexShrink: 0 }}>
              <BookCard book={b} discount={discount} />
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link
            href={`/shop?genre=${slug}`}
            style={{ display: 'inline-block', background: '#C82333', color: '#fff', padding: '10px 32px', borderRadius: 25, fontWeight: 700, fontSize: 14, textDecoration: 'none', transition: 'background 0.18s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#A71D2A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#C82333'; }}
          >
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
      <section
        style={{
          background: 'linear-gradient(130deg, #8B0000 0%, #C82333 100%)',
          padding: '56px 20px 52px',
          overflow: 'hidden',
        }}
      >
        <style>{`
          @keyframes hp-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @media (prefers-reduced-motion: reduce) {
            .hp-marquee-inner { animation: none !important; }
            .hp-book-float { animation: none !important; }
          }
          @keyframes hp-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          .hp-book-float { animation: hp-float 4s ease-in-out infinite; }
          .hp-book-float:nth-child(2) { animation-delay: 1.2s; }
          .hp-book-float:nth-child(3) { animation-delay: 2.4s; }
        `}</style>

        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <p style={{ fontStyle: 'italic', fontSize: 52, fontWeight: 900, color: 'rgba(255,255,255,0.22)', lineHeight: 1, marginBottom: 4, letterSpacing: '-0.02em', fontFamily: 'Georgia, "Times New Roman", serif' }}>Summer Sale!</p>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              GET UPTO 40% OFF<br />ON YOUR ORDER
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 15, marginBottom: 28, maxWidth: 380, lineHeight: 1.6 }}>
              Discover stories across 5 languages — English, Hindi, Marathi, Japanese & Manga. From classics to contemporary favourites.
            </p>
            <Link
              href="/shop"
              style={{ display: 'inline-block', background: '#fff', color: '#C82333', padding: '13px 32px', borderRadius: 6, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 18px rgba(0,0,0,0.2)', transition: 'transform 0.18s, box-shadow 0.18s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.28)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 18px rgba(0,0,0,0.2)'; }}
            >
              Discover Now
            </Link>
          </div>

          {/* Right — book spine stack */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', paddingBottom: 8 }}>
            {heroCoverBooks.map((book, i) => {
              const rotations = [-6, 1, 7];
              const scales = [0.90, 1, 0.92];
              const zIndexes = [1, 3, 2];
              return (
                <Link
                  key={book.id}
                  href={`/book/${book.id}`}
                  className="hp-book-float"
                  aria-label={book.title}
                  style={{
                    display: 'block',
                    width: 110,
                    height: 164,
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: book.coverColor,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                    transform: `rotate(${rotations[i]}deg) scale(${scales[i]})`,
                    zIndex: zIndexes[i],
                    textDecoration: 'none',
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'flex-end',
                    padding: '10px 8px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)',
                  }}>
                    <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, textAlign: 'center', lineHeight: 1.3, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                      {book.title}
                    </span>
                  </div>
                </Link>
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
      <BookSection title="Self-Help On Sale" slug="Self-help" bookList={selfHelpBooks} discount={15} />

      <div style={{ height: 1, background: '#f0f0f0' }} />

      {/* ── 4. Fiction On Sale ─────────────────────────────────────────────── */}
      <BookSection title="Fiction On Sale" slug="Fiction" bookList={fictionBooks} discount={10} />

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
      <BookSection title="Romance On Sale" slug="Romance" bookList={romanceBooks} discount={12} />

      <div style={{ height: 1, background: '#f0f0f0' }} />

      {/* ── 7. Manga Sets ──────────────────────────────────────────────────── */}
      <BookSection title="Manga Sets" slug="Manga" bookList={mangaBooks} discount={8} />

      <div style={{ height: 1, background: '#f0f0f0' }} />

      {/* ── 8. Hindi Books ─────────────────────────────────────────────────── */}
      <BookSection title="Hindi Books" slug="Hindi" bookList={hindiBooks} discount={10} />

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
