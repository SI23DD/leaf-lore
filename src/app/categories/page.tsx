'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ── Line-art SVG icons — the aesthetic risk: thin-stroke catalog icons ────
// Each is a 48×48 viewport, stroke only, no fills. Like bookstore section signage.
const CategoryIcons: Record<string, React.FC> = {
  Fiction: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" aria-hidden="true">
      {/* Open book */}
      <path d="M8 10 Q8 8 10 8 L24 10 L38 8 Q40 8 40 10 L40 38 Q40 40 38 40 L24 38 L10 40 Q8 40 8 38 Z" />
      <line x1="24" y1="10" x2="24" y2="38" />
      <line x1="12" y1="16" x2="22" y2="16" />
      <line x1="12" y1="20" x2="22" y2="20" />
      <line x1="12" y1="24" x2="22" y2="24" />
      <line x1="26" y1="16" x2="36" y2="16" />
      <line x1="26" y1="20" x2="36" y2="20" />
      <line x1="26" y1="24" x2="36" y2="24" />
    </svg>
  ),
  'Non-fiction': () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" aria-hidden="true">
      {/* Newspaper / document */}
      <rect x="9" y="8" width="22" height="32" rx="2" />
      <rect x="17" y="8" width="22" height="32" rx="2" />
      <line x1="21" y1="16" x2="34" y2="16" />
      <line x1="21" y1="20" x2="34" y2="20" />
      <line x1="21" y1="24" x2="34" y2="24" />
      <line x1="21" y1="28" x2="30" y2="28" />
    </svg>
  ),
  Mystery: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" aria-hidden="true">
      {/* Magnifying glass */}
      <circle cx="21" cy="21" r="11" />
      <line x1="29" y1="29" x2="40" y2="40" />
      <line x1="17" y1="21" x2="25" y2="21" />
      <line x1="21" y1="17" x2="21" y2="25" />
    </svg>
  ),
  Romance: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" aria-hidden="true">
      {/* Heart */}
      <path d="M24 38 C24 38 8 28 8 18 C8 13 12 10 16 10 C19 10 22 12 24 14 C26 12 29 10 32 10 C36 10 40 13 40 18 C40 28 24 38 24 38 Z" />
    </svg>
  ),
  Fantasy: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" aria-hidden="true">
      {/* Castle tower */}
      <rect x="12" y="22" width="24" height="20" rx="1" />
      <rect x="10" y="16" width="6" height="10" rx="1" />
      <rect x="21" y="14" width="6" height="12" rx="1" />
      <rect x="32" y="16" width="6" height="10" rx="1" />
      <line x1="10" y1="16" x2="10" y2="14" /><line x1="13" y1="16" x2="13" y2="14" /><line x1="16" y1="16" x2="16" y2="14" />
      <line x1="32" y1="16" x2="32" y2="14" /><line x1="35" y1="16" x2="35" y2="14" /><line x1="38" y1="16" x2="38" y2="14" />
      <rect x="20" y="32" width="8" height="10" />
      <line x1="24" y1="32" x2="24" y2="42" />
    </svg>
  ),
  'Self-help': () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" aria-hidden="true">
      {/* Lightbulb */}
      <path d="M24 8 C17 8 12 13 12 20 C12 25 15 29 18 31 L18 36 L30 36 L30 31 C33 29 36 25 36 20 C36 13 31 8 24 8 Z" />
      <line x1="18" y1="36" x2="30" y2="36" />
      <line x1="19" y1="39" x2="29" y2="39" />
      <line x1="21" y1="42" x2="27" y2="42" />
      <line x1="24" y1="8" x2="24" y2="12" />
      <line x1="8" y1="20" x2="12" y2="20" />
      <line x1="36" y1="20" x2="40" y2="20" />
    </svg>
  ),
  "Children's": () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" aria-hidden="true">
      {/* Star with face */}
      <path d="M24 8 L27 18 L38 18 L29 25 L32 36 L24 29 L16 36 L19 25 L10 18 L21 18 Z" />
    </svg>
  ),
  Manga: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" aria-hidden="true">
      {/* Speech bubble + lightning */}
      <path d="M8 10 Q8 8 10 8 L38 8 Q40 8 40 10 L40 28 Q40 30 38 30 L26 30 L20 38 L20 30 L10 30 Q8 30 8 28 Z" />
      <path d="M26 14 L21 22 L25 22 L22 30" />
    </svg>
  ),
  Poetry: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" aria-hidden="true">
      {/* Quill pen */}
      <path d="M38 8 C38 8 20 20 14 38 L18 34 C22 30 24 26 26 22 L30 26 C30 26 34 18 38 8 Z" />
      <path d="M14 38 L12 40" />
      <line x1="16" y1="35" x2="26" y2="22" />
    </svg>
  ),
  History: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" aria-hidden="true">
      {/* Scroll / hourglass */}
      <ellipse cx="24" cy="12" rx="10" ry="4" />
      <ellipse cx="24" cy="36" rx="10" ry="4" />
      <line x1="14" y1="12" x2="14" y2="36" />
      <line x1="34" y1="12" x2="34" y2="36" />
      <path d="M14 12 Q24 24 34 12" />
      <path d="M14 36 Q24 24 34 36" />
    </svg>
  ),
  'Hindi Books': () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" aria-hidden="true">
      {/* Book with devanagari-style horizontal bar */}
      <rect x="10" y="10" width="28" height="32" rx="2" />
      <line x1="14" y1="10" x2="14" y2="42" />
      <line x1="12" y1="20" x2="36" y2="20" />
      <line x1="20" y1="26" x2="20" y2="34" />
      <line x1="28" y1="26" x2="28" y2="34" />
      <line x1="18" y1="26" x2="30" y2="26" />
    </svg>
  ),
  'Marathi Books': () => (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" aria-hidden="true">
      {/* Lotus / book combination */}
      <path d="M24 38 C24 38 12 30 12 20 C12 14 17 10 24 14 C31 10 36 14 36 20 C36 30 24 38 24 38 Z" />
      <line x1="24" y1="14" x2="24" y2="38" />
      <path d="M24 14 C18 18 14 22 16 28" />
      <path d="M24 14 C30 18 34 22 32 28" />
    </svg>
  ),
};

interface CategoryDef {
  name: string;
  description: string;
}

interface LanguageDef {
  name: string;
  flag: string;
  queryVal: string;
}

const CATEGORIES: CategoryDef[] = [
  { name: 'Fiction', description: 'Stories that carry you past the last page' },
  { name: 'Non-fiction', description: 'Ideas and facts that change how you see the world' },
  { name: 'Mystery', description: 'Clues, crime, and revelations on every chapter' },
  { name: 'Romance', description: 'Love in every shade — tender, fierce, triumphant' },
  { name: 'Fantasy', description: 'Worlds that never existed, made utterly real' },
  { name: 'Self-help', description: 'Practical wisdom for the life you want to build' },
  { name: "Children's", description: 'Picture books and chapter books that stick forever' },
  { name: 'Manga', description: 'Sequential art spanning every genre and emotion' },
  { name: 'Poetry', description: 'Language distilled — every line does double work' },
  { name: 'History', description: 'The past that explains the present' },
  { name: 'Hindi Books', description: 'Stories, poetry, and classics in Hindi' },
  { name: 'Marathi Books', description: 'Literature from Maharashtra\'s rich tradition' },
];

const LANGUAGES: LanguageDef[] = [
  { name: 'English', flag: '🇬🇧', queryVal: 'English' },
  { name: 'Japanese', flag: '🇯🇵', queryVal: 'Japanese' },
  { name: 'Hindi', flag: '🌺', queryVal: 'Hindi' },
  { name: 'Marathi', flag: '🎭', queryVal: 'Marathi' },
  { name: 'Manga/Anime', flag: '⚡', queryVal: 'Manga/Anime' },
];

const COLLECTIONS = [
  { label: 'Books Under ₹200', desc: 'Good reads, wallet-friendly prices', param: 'maxPrice=199', bg: '#C82333' },
  { label: 'Sale Books', desc: 'Limited-time discounts on top titles', param: 'onsale=true', bg: '#28A745' },
  { label: 'New Arrivals', desc: 'Fresh additions to our shelves this month', param: 'sort=created_at&order=desc', bg: '#111' },
];

const MARQUEE_ITEMS = ['Fiction', 'Mystery', 'Romance', 'Fantasy', 'Poetry', 'History', 'Manga', 'Non-fiction', 'Self-help', "Children's", 'Hindi', 'Marathi'];

export default function CategoriesPage() {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [langCounts, setLangCounts] = useState<Record<string, number>>({});
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/books?limit=500')
      .then(r => r.json())
      .then(data => {
        const books: Array<{ genre: string; language: string }> = data.books || [];
        const gc: Record<string, number> = {};
        const lc: Record<string, number> = {};
        books.forEach(b => {
          gc[b.genre] = (gc[b.genre] || 0) + 1;
          lc[b.language] = (lc[b.language] || 0) + 1;
        });
        setCounts(gc);
        setLangCounts(lc);
      })
      .catch(() => {});
    const t = setTimeout(() => setLoaded(true), 40);
    return () => clearTimeout(t);
  }, []);

  const goToShop = (param: string, value: string) => {
    router.push(`/shop?${param}=${encodeURIComponent(value)}`);
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @keyframes marqueeLeft { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marqueeRight { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #e8e8e8; border: 1px solid #e8e8e8; }
        @media (max-width: 900px) { .cat-grid { grid-template-columns: repeat(2, 1fr); } }
        .cat-card { background: #fff; padding: 32px 24px 28px; display: flex; flex-direction: column; align-items: center; text-align: center; cursor: pointer; transition: background 0.18s ease; position: relative; overflow: hidden; }
        .cat-card:hover { background: #fff8f8; }
        .cat-card:focus-visible { outline: 2px solid #C82333; outline-offset: -2px; }
        .cat-icon-wrap { width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; color: #111; margin-bottom: 16px; transition: color 0.18s ease; }
        .cat-card:hover .cat-icon-wrap { color: #C82333; }
        .cat-name { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #111; margin-bottom: 6px; transition: color 0.18s ease; }
        .cat-card:hover .cat-name { color: #C82333; }
        .cat-count { font-size: 12px; color: #aaa; }
        .cat-arrow { position: absolute; bottom: 12px; right: 16px; font-size: 13px; color: #C82333; opacity: 0; transition: opacity 0.18s ease; }
        .cat-card:hover .cat-arrow { opacity: 1; }
        .lang-card { display: flex; align-items: center; gap: 14px; padding: 18px 24px; border: 1px solid #e8e8e8; border-radius: 4px; background: #fff; cursor: pointer; transition: border-color 0.18s ease, box-shadow 0.18s ease; }
        .lang-card:hover { border-color: #C82333; box-shadow: 0 4px 16px rgba(200,35,51,0.1); }
        .lang-card:focus-visible { outline: 2px solid #C82333; }
        .coll-card { padding: 36px 32px; border-radius: 6px; color: #fff; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; display: flex; flex-direction: column; }
        .coll-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.2); }
        .coll-card:focus-visible { outline: 2px solid #C82333; }
        .coll-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 768px) { .coll-grid { grid-template-columns: 1fr; } .lang-row { flex-direction: column !important; } .lang-card { width: 100%; box-sizing: border-box; } }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
      `}</style>

      {/* ── Announcement bar ─────────────────────────────────────────────── */}
      <div style={{ background: '#FFC107', padding: '8px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#111', margin: 0, letterSpacing: '0.04em' }}>
          Free shipping on orders above ₹499 · Use code LEAFLORE10 for 10% off
        </p>
      </div>

      {/* ── Marquee strip ────────────────────────────────────────────────── */}
      <div style={{ background: '#8B0000', overflow: 'hidden', padding: '9px 0' }} aria-hidden="true">
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marqueeLeft 30s linear infinite' }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((w, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', marginRight: 40 }}>
              {w} ·
            </span>
          ))}
        </div>
      </div>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '56px 24px 48px', borderBottom: '1px solid #f0f0f0' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C82333', margin: '0 0 12px' }}>
          Browse
        </p>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#111', margin: '0 0 14px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Product Categories
        </h1>
        <p style={{ fontSize: 15, color: '#666', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          Discover your next read — from bestsellers to newcomers, children's books to crime novels
        </p>
      </div>

      {/* ── Category grid ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 0' }}>
        <div
          className="cat-grid"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(12px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          {CATEGORIES.map(cat => {
            const Icon = CategoryIcons[cat.name] || CategoryIcons['Fiction'];
            const genreKey = cat.name === 'Hindi Books' ? 'Fiction' : cat.name === 'Marathi Books' ? 'Fiction' : cat.name;
            const count = counts[genreKey];
            const isHovered = hoveredCat === cat.name;

            return (
              <button
                key={cat.name}
                className="cat-card"
                onClick={() => {
                  if (cat.name === 'Hindi Books') goToShop('language', 'Hindi');
                  else if (cat.name === 'Marathi Books') goToShop('language', 'Marathi');
                  else goToShop('genre', cat.name);
                }}
                onMouseEnter={() => setHoveredCat(cat.name)}
                onMouseLeave={() => setHoveredCat(null)}
                title={cat.description}
              >
                <div className="cat-icon-wrap">
                  <Icon />
                </div>
                <div className="cat-name">{cat.name}</div>
                {count !== undefined && <div className="cat-count">{count} book{count === 1 ? '' : 's'}</div>}
                <span className="cat-arrow">→</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Browse by Language ───────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C82333', margin: '0 0 6px' }}>Filter by</p>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: 0, letterSpacing: '-0.01em' }}>Browse by Language</h2>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }} className="lang-row">
          {LANGUAGES.map(lang => (
            <button
              key={lang.name}
              className="lang-card"
              onClick={() => goToShop('language', lang.queryVal)}
              style={{ flexShrink: 0 }}
            >
              <span style={{ fontSize: 30, lineHeight: 1 }}>{lang.flag}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111', lineHeight: 1.2 }}>{lang.name}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2, fontWeight: 600 }}>
                  {langCounts[lang.queryVal] !== undefined ? `${langCounts[lang.queryVal]} book${langCounts[lang.queryVal] === 1 ? '' : 's'}` : '—'}
                </div>
              </div>
              <span style={{ marginLeft: 'auto', color: '#C82333', fontSize: 14 }}>→</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Shop by Collection ───────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px 80px' }}>
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C82333', margin: '0 0 6px' }}>Curated for you</p>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: 0, letterSpacing: '-0.01em' }}>Shop by Collection</h2>
        </div>
        <div className="coll-grid">
          {COLLECTIONS.map(col => (
            <button
              key={col.label}
              className="coll-card"
              onClick={() => router.push(`/shop?${col.param}`)}
              style={{ background: col.bg, textAlign: 'left' }}
            >
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 10px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                {col.label}
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 24px', flex: 1 }}>
                {col.desc}
              </p>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1.5px solid rgba(255,255,255,0.4)', paddingBottom: 2 }}>
                Shop now →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
