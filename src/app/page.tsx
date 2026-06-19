'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { books } from '@/data/books';
import BookCard from '@/components/BookCard';
import { useCart } from '@/context/CartContext';

// ── helpers ──────────────────────────────────────────────────────────────────

function openLibraryCover(isbn: string) {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
}

function BookCoverImg({ book, height = 200 }: { book: typeof books[0]; height?: number }) {
  const [err, setErr] = useState(false);
  if (book.isbn && !err) {
    return (
      <img
        src={openLibraryCover(book.isbn)}
        alt={book.title}
        onError={() => setErr(true)}
        style={{ width: '100%', height, objectFit: 'cover', display: 'block' }}
      />
    );
  }
  return (
    <div
      style={{ width: '100%', height, backgroundColor: book.coverColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '8px' }}
    >
      <span style={{ fontSize: 32, marginBottom: 4 }}>📚</span>
      <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, fontFamily: 'Georgia, serif', textAlign: 'center', lineHeight: 1.3 }}>{book.title}</span>
    </div>
  );
}

// Horizontal scroll container with prev/next buttons
function HScrollSection({ title, subtitle, bookList, discounts }: {
  title: string;
  subtitle?: string;
  bookList: typeof books;
  discounts?: Record<string, number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  function scroll(dir: 'l' | 'r') {
    if (ref.current) ref.current.scrollBy({ left: dir === 'r' ? 280 : -280, behavior: 'smooth' });
  }
  return (
    <section className="py-12" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', color: '#2D5016', fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{title}</h2>
            {subtitle && <p style={{ color: '#888', fontSize: 14 }}>{subtitle}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll('l')} style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #2D5016', color: '#2D5016', backgroundColor: 'white', cursor: 'pointer', fontSize: 16 }}>‹</button>
            <button onClick={() => scroll('r')} style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #2D5016', color: '#2D5016', backgroundColor: 'white', cursor: 'pointer', fontSize: 16 }}>›</button>
          </div>
        </div>
        <div ref={ref} style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
          {bookList.map(b => (
            <div key={b.id} style={{ minWidth: 200, maxWidth: 200 }}>
              <BookCard book={b} discount={discounts?.[b.id]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── page data ─────────────────────────────────────────────────────────────────

const categories = [
  { label: 'Fiction', href: '/shop?genre=Fiction', icon: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/></svg>
  )},
  { label: 'Non-fiction', href: '/shop?genre=Non-fiction', icon: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
  )},
  { label: 'Mystery', href: '/shop?genre=Mystery', icon: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
  )},
  { label: 'Romance', href: '/shop?genre=Romance', icon: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
  )},
  { label: 'Fantasy', href: '/shop?genre=Fantasy', icon: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21 12 2l9 19H3z"/><path d="M9 17h6"/></svg>
  )},
  { label: 'Self-help', href: '/shop?genre=Self-help', icon: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
  )},
  { label: 'Manga', href: '/shop?genre=Manga', icon: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  )},
  { label: 'Poetry', href: '/shop?genre=Poetry', icon: (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
  )},
];

const testimonials = [
  { name: 'Priya S.', date: 'May 2025', stars: 5, text: 'Absolutely love the collection! Found rare Marathi classics I couldn\'t find elsewhere.' },
  { name: 'Arjun M.', date: 'Apr 2025', stars: 5, text: 'Great prices, fast delivery. The manga section is fantastic!' },
  { name: 'Sunita V.', date: 'Mar 2025', stars: 5, text: 'Finally a bookshop that respects Indian literature alongside international titles.' },
  { name: 'Rahul N.', date: 'Feb 2025', stars: 4, text: 'Shyamchi Aai brought tears to my eyes. Perfect condition, great packaging.' },
];

const articles = [
  { emoji: '📖', bg: '#2D5016', tag: 'Culture', date: 'Jun 10, 2025', title: 'Why Marathi Literature Deserves Global Recognition' },
  { emoji: '⛩️', bg: '#1F618D', tag: 'Manga', date: 'Jun 5, 2025', title: 'Top 5 Anime Manga for Beginners' },
  { emoji: '🗾', bg: '#4A235A', tag: 'Trends', date: 'May 28, 2025', title: 'The Rise of Japanese Fiction in India' },
];

const promoCards = [
  { bg: '#1a2744', label: 'Manga Collection', title: 'EXPLORE ANIME & MANGA', emoji: '⛩️' },
  { bg: '#6B1A1A', label: 'Hindi Classics', title: 'TIMELESS HINDI LITERATURE', emoji: '📜' },
  { bg: '#0D3321', label: 'Japanese Culture', title: 'MURAKAMI & BEYOND', emoji: '🌸' },
];

// ── main page ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { addToCart } = useCart();

  const highlights = books.slice(0, 8);
  const bestsellers = books.slice(8, 16);
  const featured = books[0]; // Midnight Library
  const picksForYou = books.slice(1, 5);

  // unique authors
  const authors = Array.from(new Map(books.map(b => [b.author, b])).values()).slice(0, 8);

  const heroCoverIds = ['1', '7', '18'];
  const heroBooks = heroCoverIds.map(id => books.find(b => b.id === id)!);

  return (
    <div style={{ backgroundColor: '#FAF7F2', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── A. Announcement bar ───────────────────────────────────────── */}
      <div style={{ backgroundColor: '#2D5016', color: '#FAF7F2', fontSize: 13, overflow: 'hidden', whiteSpace: 'nowrap', padding: '7px 0' }}>
        <span style={{ display: 'inline-block', animation: 'marquee 28s linear infinite' }}>
          🌿 Free shipping on orders above ₹500 &nbsp;·&nbsp; New arrivals every week &nbsp;·&nbsp; 22+ Books across 5 languages &nbsp;·&nbsp; 🌿 Free shipping on orders above ₹500 &nbsp;·&nbsp; New arrivals every week &nbsp;·&nbsp; 22+ Books across 5 languages &nbsp;·&nbsp;
        </span>
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      {/* ── B. Hero ───────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #1A3009 0%, #2D5016 60%, #3a6b1e 100%)', minHeight: 480, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', width: '100%' }}>
          {/* Left text */}
          <div>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(168,213,162,0.15)', color: '#A8D5A2', border: '1px solid rgba(168,213,162,0.3)', borderRadius: 20, padding: '4px 14px', fontSize: 13, marginBottom: 20 }}>
              🍃 Your Literary Sanctuary
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', color: '#FAF7F2', fontSize: 48, fontWeight: 700, lineHeight: 1.15, marginBottom: 16 }}>
              Where Every Page<br />
              <em style={{ color: '#A8D5A2' }}>Tells a Story</em>
            </h1>
            <p style={{ color: 'rgba(250,247,242,0.75)', fontSize: 16, lineHeight: 1.7, marginBottom: 28, maxWidth: 440 }}>
              Discover 22+ books across English, Hindi, Marathi, Japanese & Manga. From timeless classics to contemporary voices.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/shop" style={{ backgroundColor: '#8B4513', color: 'white', padding: '12px 28px', borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
                Discover Now
              </Link>
              <Link href="/shop" style={{ border: '1.5px solid rgba(250,247,242,0.5)', color: '#FAF7F2', padding: '12px 28px', borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
                Browse All
              </Link>
            </div>
          </div>

          {/* Right — 3 stacked book covers */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 12, paddingTop: 16 }}>
            {heroBooks.map((book, i) => {
              const angle = [-8, 0, 8][i];
              const scale = [0.88, 1, 0.88][i];
              const zIndex = [1, 3, 1][i];
              return (
                <Link key={book.id} href={`/book/${book.id}`} style={{ transform: `rotate(${angle}deg) scale(${scale})`, zIndex, textDecoration: 'none', display: 'block', boxShadow: '0 12px 40px rgba(0,0,0,0.45)', borderRadius: 6, overflow: 'hidden', width: 130 }}>
                  <BookCoverImg book={book} height={190} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── C. Stats ticker ───────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#FAF7F2', borderTop: '1px solid #E8E0D5', borderBottom: '1px solid #E8E0D5', padding: '14px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <span style={{ display: 'inline-block', animation: 'marquee 20s linear infinite', color: '#2D5016', fontWeight: 600, fontSize: 14, letterSpacing: '0.02em' }}>
          📚 22+ Total Books &nbsp;✦&nbsp; 5 Languages &nbsp;✦&nbsp; 10 Genres &nbsp;✦&nbsp; 500+ Happy Readers &nbsp;✦&nbsp; Free Delivery above ₹500 &nbsp;✦&nbsp; 📚 22+ Total Books &nbsp;✦&nbsp; 5 Languages &nbsp;✦&nbsp; 10 Genres &nbsp;✦&nbsp; 500+ Happy Readers &nbsp;✦&nbsp; Free Delivery above ₹500 &nbsp;✦&nbsp;
        </span>
      </div>

      {/* ── D. This Week's Highlights ─────────────────────────────────── */}
      <HScrollSection
        title="This Week's Highlights"
        subtitle="Fresh picks our readers are loving"
        bookList={highlights}
        discounts={{ '2': 10, '6': 15, '8': 5 }}
      />

      {/* ── E. Browse by Category ─────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F0EBE3', padding: '56px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', color: '#2D5016', fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Browse by Category</h2>
            <p style={{ color: '#888', fontSize: 14 }}>Find stories in every genre you love</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16 }}>
            {categories.map(cat => (
              <Link
                key={cat.label}
                href={cat.href}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: 'white', borderRadius: 12, padding: '24px 8px', border: '1.5px solid #E8E0D5', textDecoration: 'none', color: '#2D5016', transition: 'all 0.2s' }}
                className="hover:shadow-md"
              >
                {cat.icon}
                <span style={{ fontSize: 13, fontWeight: 600, color: '#2D5016' }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── F. Bestselling Books ──────────────────────────────────────── */}
      <HScrollSection
        title="Bestselling Books"
        subtitle="Our most-loved titles of all time"
        bookList={bestsellers}
        discounts={{ '11': 12, '17': 8 }}
      />

      {/* ── G. Dark promo banner ──────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1A3009', padding: '64px 24px', textAlign: 'center' }}>
        <p style={{ color: '#A8D5A2', fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Best Collection</p>
        <h2 style={{ fontFamily: 'Georgia, serif', color: '#FAF7F2', fontSize: 36, fontWeight: 700, marginBottom: 16 }}>TOP FAVOURITE STORIES</h2>
        <p style={{ color: 'rgba(250,247,242,0.65)', fontSize: 16, maxWidth: 500, margin: '0 auto 28px' }}>
          Find our take on the best books of all time, curated with love.
        </p>
        <Link href="/shop" style={{ backgroundColor: '#8B4513', color: 'white', padding: '13px 36px', borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
          Discover Now
        </Link>
      </section>

      {/* ── H. 3-column promo cards ───────────────────────────────────── */}
      <section style={{ backgroundColor: '#FAF7F2', padding: '48px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {promoCards.map(card => (
            <div key={card.label} style={{ backgroundColor: card.bg, borderRadius: 12, padding: '36px 28px', color: 'white' }}>
              <span style={{ fontSize: 36, display: 'block', marginBottom: 12 }}>{card.emoji}</span>
              <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 8 }}>{card.label}</p>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, marginBottom: 20, lineHeight: 1.3 }}>{card.title}</h3>
              <Link href="/shop" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Shop Now <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── I. Picks for you ──────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F0EBE3', padding: '56px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', color: '#2D5016', fontSize: 26, fontWeight: 700, marginBottom: 32 }}>Picks For You</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Featured big card */}
            <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #E8E0D5', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 280, overflow: 'hidden' }}>
                <BookCoverImg book={featured} height={280} />
              </div>
              <div style={{ padding: 24 }}>
                <p style={{ color: '#8B4513', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{featured.genre}</p>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{featured.title}</h3>
                <p style={{ color: '#666', fontSize: 13, marginBottom: 12 }}>by {featured.author}</p>
                <p style={{ color: '#555', fontSize: 14, lineHeight: 1.65, marginBottom: 16 }}>{featured.description.slice(0, 140)}…</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: 20, color: '#2D5016' }}>₹{featured.price}</span>
                  <button
                    onClick={() => addToCart(featured)}
                    style={{ backgroundColor: '#2D5016', color: 'white', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {picksForYou.map(book => (
                <Link key={book.id} href={`/book/${book.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 14, backgroundColor: 'white', borderRadius: 10, border: '1px solid #E8E0D5', padding: 14, alignItems: 'center' }}>
                  <div style={{ width: 64, height: 80, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                    <BookCoverImg book={book} height={80} />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: '#8B4513', marginBottom: 3 }}>{book.genre}</p>
                    <h4 style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 4, lineHeight: 1.3 }}>{book.title}</h4>
                    <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{book.author}</p>
                    <span style={{ fontWeight: 700, color: '#2D5016', fontSize: 14 }}>₹{book.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── J. Featured Authors ───────────────────────────────────────── */}
      <section style={{ backgroundColor: '#FAF7F2', padding: '56px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', color: '#2D5016', fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Meet Our Authors</h2>
            <p style={{ color: '#888', fontSize: 14 }}>The brilliant minds behind our collection</p>
          </div>
          <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {authors.map(book => {
              const hue = (book.author.charCodeAt(0) * 47) % 360;
              const initial = book.author.charAt(0);
              return (
                <div key={book.author} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 80 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: `hsl(${hue},45%,42%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                  }}>
                    {initial}
                  </div>
                  <span style={{ fontSize: 12, color: '#444', fontWeight: 600, textAlign: 'center', maxWidth: 80, lineHeight: 1.3 }}>{book.author}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── K. Testimonials ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F0EBE3', padding: '56px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', color: '#2D5016', fontSize: 26, fontWeight: 700, marginBottom: 32, textAlign: 'center' }}>What Our Readers Say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start' }}>
            {/* Review cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {testimonials.map((t, i) => (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, border: '1px solid #E8E0D5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 14 }}>{t.name}</span>
                    <span style={{ color: '#aaa', fontSize: 12 }}>{t.date}</span>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span key={j} style={{ color: j < t.stars ? '#F6AD55' : '#D1D5DB', fontSize: 14 }}>★</span>
                    ))}
                  </div>
                  <p style={{ color: '#555', fontSize: 13, lineHeight: 1.65, fontStyle: 'italic' }}>"{t.text}"</p>
                </div>
              ))}
            </div>
            {/* Big rating circle */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2D5016', borderRadius: 16, padding: '32px 28px', color: 'white', minWidth: 160 }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 48, fontWeight: 700, lineHeight: 1 }}>4.8</span>
              <span style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>out of 5</span>
              <div style={{ margin: '12px 0 4px' }}>{'★★★★★'}</div>
              <span style={{ fontSize: 12, opacity: 0.65 }}>500+ Verified Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── L. Trust badges ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#FAF7F2', padding: '36px 0', borderTop: '1px solid #E8E0D5', borderBottom: '1px solid #E8E0D5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {[
            { icon: '📦', title: 'Fast Delivery', sub: 'Free above ₹500' },
            { icon: '🏷️', title: 'Best Prices', sub: 'Always competitive' },
            { icon: '🎁', title: 'Daily Deals', sub: 'New offers everyday' },
            { icon: '🔒', title: 'Secure Shopping', sub: '100% safe checkout' },
          ].map(badge => (
            <div key={badge.title} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 28 }}>{badge.icon}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 2 }}>{badge.title}</p>
                <p style={{ fontSize: 12, color: '#888' }}>{badge.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── M. News & Events ──────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#FAF7F2', padding: '56px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', color: '#2D5016', fontSize: 26, fontWeight: 700, marginBottom: 8 }}>From the Shelves</h2>
            <p style={{ color: '#888', fontSize: 14 }}>News, events and reading culture</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {articles.map(article => (
              <div key={article.title} style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #E8E0D5', overflow: 'hidden' }}>
                <div style={{ backgroundColor: article.bg, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>
                  {article.emoji}
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ backgroundColor: '#E8F4E0', color: '#2D5016', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{article.tag}</span>
                    <span style={{ color: '#aaa', fontSize: 12 }}>{article.date}</span>
                  </div>
                  <h4 style={{ fontFamily: 'Georgia, serif', color: '#1a1a1a', fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>{article.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── N. Newsletter ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#2D5016', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', color: '#FAF7F2', fontSize: 30, fontWeight: 700, marginBottom: 10 }}>Stay in the Know</h2>
        <p style={{ color: 'rgba(250,247,242,0.7)', fontSize: 15, marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
          Subscribe for new arrivals, reading lists, and members-only deals.
        </p>
        <div style={{ display: 'flex', maxWidth: 420, margin: '0 auto 28px', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
          <input
            type="email"
            placeholder="Enter your email address"
            style={{ flex: 1, padding: '12px 16px', border: 'none', outline: 'none', fontSize: 14, backgroundColor: '#FAF7F2', color: '#1a1a1a' }}
          />
          <button style={{ backgroundColor: '#8B4513', color: 'white', border: 'none', padding: '12px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Subscribe
          </button>
        </div>
        {/* Social icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <a href="#" style={{ color: 'rgba(250,247,242,0.7)', textDecoration: 'none', fontSize: 22 }} title="Twitter/X">𝕏</a>
          <a href="#" style={{ color: 'rgba(250,247,242,0.7)', textDecoration: 'none', fontSize: 22 }} title="Instagram">📷</a>
        </div>
      </section>

    </div>
  );
}
