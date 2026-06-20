'use client';
import { useState, useEffect, useCallback, useRef, Suspense } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
import { useSearchParams, useRouter } from 'next/navigation';
import BookCard from '@frontend/components/BookCard';

const languages = ['English', 'Japanese', 'Hindi', 'Marathi', 'Manga/Anime'];
const genres = ['Fiction', 'Non-fiction', 'Mystery', 'Romance', 'Fantasy', 'Self-help', "Children's", 'Manga', 'Poetry', 'History'];

const GENRE_COUNTS: Record<string, number> = {
  'Fiction': 5, 'Non-fiction': 1, 'Mystery': 2, 'Romance': 2,
  'Fantasy': 1, 'Self-help': 2, "Children's": 1, 'Manga': 4, 'Poetry': 1, 'History': 1,
};
const LANG_COUNTS: Record<string, number> = {
  'English': 8, 'Japanese': 3, 'Hindi': 4, 'Marathi': 4, 'Manga/Anime': 4,
};

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'title';
type ViewMode = 'grid' | 'list';

interface Book {
  id: string; title: string; author: string; price: number;
  language: string; genre: string; rating: number;
  description: string; cover_color: string; stock: number;
}

const PAGE_SIZE = 12;

// ── Skeleton card ─────────────────────────────────────────────────────────
function SkeletonCard({ view }: { view: ViewMode }) {
  if (view === 'list') {
    return (
      <div style={{ display: 'flex', gap: 16, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 6, padding: 16, alignItems: 'flex-start' }}>
        <div className="skeleton" style={{ width: 90, height: 130, borderRadius: 4, flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="skeleton" style={{ height: 14, width: '55%', borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 11, width: '30%', borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 11, width: '75%', borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 32, width: 110, borderRadius: 4, marginTop: 8 }} />
        </div>
      </div>
    );
  }
  return (
    <div style={{ borderRadius: 6, overflow: 'hidden', background: '#fff', border: '1px solid #e8e8e8' }}>
      <div className="skeleton" style={{ height: 260, width: '100%' }} />
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div className="skeleton" style={{ height: 12, width: '85%', borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 10, width: '50%', borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 28, width: '100%', borderRadius: 4, marginTop: 6 }} />
      </div>
    </div>
  );
}

// ── List-view book row ────────────────────────────────────────────────────
function BookListRow({ book }: { book: Book }) {
  const [hovered, setHovered] = useState(false);
  const stars = Math.round(book.rating);

  return (
    <a
      href={`/book/${book.id}`}
      style={{ textDecoration: 'none', display: 'block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: 'flex',
          gap: 16,
          background: '#fff',
          border: `1px solid ${hovered ? '#C82333' : '#e8e8e8'}`,
          borderRadius: 6,
          overflow: 'hidden',
          transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
          boxShadow: hovered ? '0 4px 16px rgba(200,35,51,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            width: 90,
            minHeight: 130,
            backgroundColor: book.cover_color || '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            flexShrink: 0,
          }}
        >
          📚
        </div>
        <div style={{ flex: 1, padding: '14px 14px 14px 0', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: hovered ? '#C82333' : '#111', lineHeight: 1.3, marginBottom: 2, transition: 'color 0.15s ease' }}>
                {book.title}
              </h3>
              <p style={{ fontSize: 12, color: '#666', margin: 0 }}>{book.author}</p>
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#C82333', flexShrink: 0 }}>₹{book.price}</span>
          </div>
          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ color: i < stars ? '#FFC107' : '#ddd', fontSize: 12 }}>★</span>
            ))}
            <span style={{ fontSize: 11, color: '#999', marginLeft: 4 }}>{book.rating}</span>
          </div>
          {book.description && (
            <p style={{ fontSize: 12, color: '#666', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
              {book.description}
            </p>
          )}
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 2, background: '#fff3f4', color: '#C82333', border: '1px solid #f5c6cb', fontWeight: 600 }}>
              {book.genre}
            </span>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 2, background: '#f8f8f8', color: '#555', border: '1px solid #e8e8e8', fontWeight: 600 }}>
              {book.language}
            </span>
            {book.stock === 0 && (
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 2, background: '#333', color: '#fff', fontWeight: 600 }}>
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

// ── Filter chip ───────────────────────────────────────────────────────────
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 3, background: '#fff3f4', border: '1px solid #f5c6cb', fontSize: 12, color: '#C82333', fontWeight: 600 }}>
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C82333', lineHeight: 1, padding: 0, fontSize: 14, opacity: 0.7, display: 'flex', alignItems: 'center' }}
      >
        ×
      </button>
    </span>
  );
}

// ── Accordion section ─────────────────────────────────────────────────────
function AccordionSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: open ? 16 : 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer', padding: '14px 0',
          fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#111',
        }}
      >
        {title}
        <span style={{ fontSize: 14, color: '#999', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────
function Sidebar({
  selectedLanguages, setSelectedLanguages,
  selectedGenres, setSelectedGenres,
  priceRange, setPriceRange,
  availability, setAvailability,
  onClear,
  genreCounts, langCounts,
}: {
  selectedLanguages: string[]; setSelectedLanguages: (v: string[]) => void;
  selectedGenres: string[]; setSelectedGenres: (v: string[]) => void;
  priceRange: string; setPriceRange: (v: string) => void;
  availability: string[]; setAvailability: (v: string[]) => void;
  onClear: () => void;
  genreCounts: Record<string, number>;
  langCounts: Record<string, number>;
}) {
  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  const checkboxStyle: React.CSSProperties = { accentColor: '#C82333' };
  const labelStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '4px 0', fontSize: 13, color: '#333' };
  const countStyle: React.CSSProperties = { fontSize: 11, color: '#aaa', background: '#f5f5f5', borderRadius: 2, padding: '1px 6px', fontWeight: 600 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <AccordionSection title="Category">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {genres.map(genre => (
            <label key={genre} style={labelStyle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={selectedGenres.includes(genre)} onChange={() => toggle(selectedGenres, setSelectedGenres, genre)} style={checkboxStyle} />
                {genre}
              </span>
              <span style={countStyle}>{genreCounts[genre] ?? 0}</span>
            </label>
          ))}
        </div>
      </AccordionSection>

      <AccordionSection title="Language">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {languages.map(lang => (
            <label key={lang} style={labelStyle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={selectedLanguages.includes(lang)} onChange={() => toggle(selectedLanguages, setSelectedLanguages, lang)} style={checkboxStyle} />
                {lang}
              </span>
              <span style={countStyle}>{langCounts[lang] ?? 0}</span>
            </label>
          ))}
        </div>
      </AccordionSection>

      <AccordionSection title="Price">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[['all', 'All Prices'], ['under200', 'Under ₹200'], ['200to400', '₹200 – ₹400'], ['above400', 'Above ₹400']].map(([val, lbl]) => (
            <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#333' }}>
              <input type="radio" name="price" value={val} checked={priceRange === val} onChange={() => setPriceRange(val)} style={checkboxStyle} />
              {lbl}
            </label>
          ))}
        </div>
      </AccordionSection>

      <AccordionSection title="Availability">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[['instock', 'In Stock'], ['onsale', 'On Sale']].map(([val, lbl]) => (
            <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#333' }}>
              <input type="checkbox" checked={availability.includes(val)} onChange={() => toggle(availability, setAvailability, val)} style={checkboxStyle} />
              {lbl}
            </label>
          ))}
        </div>
      </AccordionSection>

      <div style={{ paddingTop: 16 }}>
        <button
          onClick={onClear}
          style={{ width: '100%', padding: '9px 0', border: '1.5px solid #C82333', borderRadius: 4, background: '#fff', color: '#C82333', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em', transition: 'all 0.18s ease' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#C82333'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#C82333'; }}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}

// ── Inner page ────────────────────────────────────────────────────────────
function ShopInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [availability, setAvailability] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const [booksVisible, setBooksVisible] = useState(false);
  const [genreCounts, setGenreCounts] = useState<Record<string, number>>(GENRE_COUNTS);
  const [langCounts, setLangCounts] = useState<Record<string, number>>(LANG_COUNTS);
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    const genre = searchParams.get('genre');
    const language = searchParams.get('language');
    const maxPrice = searchParams.get('maxPrice');
    const sortParam = searchParams.get('sort');
    const orderParam = searchParams.get('order');
    if (genre && genres.includes(genre)) setSelectedGenres([genre]);
    if (language && languages.includes(language)) setSelectedLanguages([language]);
    if (maxPrice === '199') setPriceRange('under200');
    if (sortParam === 'rating' && orderParam === 'desc') setSort('rating');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setBooksVisible(false);
    try {
      const params = new URLSearchParams({ limit: '500' });
      if (search) params.set('search', search);
      if (selectedLanguages.length === 1) params.set('language', selectedLanguages[0]);
      if (selectedGenres.length === 1) params.set('genre', selectedGenres[0]);
      if (priceRange === 'under200') params.set('maxPrice', '199');
      if (priceRange === '200to400') { params.set('minPrice', '200'); params.set('maxPrice', '400'); }
      if (priceRange === 'above400') params.set('minPrice', '401');
      if (sort === 'price-asc') { params.set('sort', 'price'); params.set('order', 'asc'); }
      else if (sort === 'price-desc') { params.set('sort', 'price'); params.set('order', 'desc'); }
      else if (sort === 'rating') { params.set('sort', 'rating'); params.set('order', 'desc'); }
      else if (sort === 'title') { params.set('sort', 'title'); params.set('order', 'asc'); }

      const res = await fetch(`${API_URL}/api/books?${params}`);
      const data = await res.json();

      let result: Book[] = data.books || [];
      if (selectedLanguages.length > 1) result = result.filter(b => selectedLanguages.includes(b.language));
      if (selectedGenres.length > 1) result = result.filter(b => selectedGenres.includes(b.genre));
      if (availability.includes('instock')) result = result.filter(b => b.stock > 0);

      // Count for sidebar (from full fetch)
      const gc: Record<string, number> = {};
      const lc: Record<string, number> = {};
      (data.books || []).forEach((b: Book) => {
        gc[b.genre] = (gc[b.genre] || 0) + 1;
        lc[b.language] = (lc[b.language] || 0) + 1;
      });
      if (Object.keys(gc).length) { setGenreCounts(gc); setLangCounts(lc); }

      setBooks(result);
      setTotal(data.total || result.length);
      setPage(1);
    } finally {
      setLoading(false);
      setTimeout(() => setBooksVisible(true), 60);
    }
  }, [search, selectedLanguages, selectedGenres, priceRange, availability, sort]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
  const pageBooks = books.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilters: Array<{ label: string; remove: () => void }> = [
    ...selectedLanguages.map(l => ({ label: `Language: ${l}`, remove: () => setSelectedLanguages(selectedLanguages.filter(x => x !== l)) })),
    ...selectedGenres.map(g => ({ label: `Genre: ${g}`, remove: () => setSelectedGenres(selectedGenres.filter(x => x !== g)) })),
    ...(priceRange !== 'all' ? [{ label: priceRange === 'under200' ? 'Under ₹200' : priceRange === '200to400' ? '₹200–₹400' : 'Above ₹400', remove: () => setPriceRange('all') }] : []),
    ...availability.map(a => ({ label: a === 'instock' ? 'In Stock' : 'On Sale', remove: () => setAvailability(availability.filter(x => x !== a)) })),
  ];

  const clearAll = () => { setSelectedLanguages([]); setSelectedGenres([]); setPriceRange('all'); setAvailability([]); setSearch(''); };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        .shop-grid-view { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 1100px) { .shop-grid-view { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .shop-grid-view { grid-template-columns: repeat(2, 1fr); } .shop-layout { flex-direction: column !important; } .shop-sidebar-wrap { width: 100% !important; } }
        .shop-topbar-btn { padding: 8px 10px; border-radius: 4px; border: 1px solid #e0e0e0; background: #fff; color: #444; cursor: pointer; font-size: 15px; line-height: 1; transition: all 0.15s; }
        .shop-topbar-btn.active { border-color: #C82333; background: #C82333; color: #fff; }
        .shop-topbar-btn:hover:not(.active) { border-color: #C82333; color: #C82333; }
        .shop-sort-select { padding: 8px 12px; border-radius: 4px; border: 1px solid #e0e0e0; background: #fff; font-size: 13px; color: #333; cursor: pointer; outline: none; }
        .shop-sort-select:focus { border-color: #C82333; }
        .shop-filter-mobile-btn { display: none; padding: 8px 14px; border-radius: 4px; border: 1px solid #C82333; background: #fff; color: #C82333; font-size: 13px; font-weight: 600; cursor: pointer; }
        @media (max-width: 768px) { .shop-filter-mobile-btn { display: block; } }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
      `}</style>

      {/* Page header */}
      <div style={{ borderBottom: '1px solid #f0f0f0', padding: '20px 0', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: 0, letterSpacing: '-0.01em' }}>All Books</h1>
            <p style={{ fontSize: 12, color: '#999', margin: '2px 0 0', letterSpacing: '0.02em' }}>
              {loading ? 'Loading…' : `${total} books available`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="shop-filter-mobile-btn" onClick={() => setShowFilters(f => !f)}>
              {showFilters ? 'Hide Filters' : 'Filters ▾'}
            </button>
            <select className="shop-sort-select" value={sort} onChange={e => setSort(e.target.value as SortOption)}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Title: A–Z</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 64px', display: 'flex', gap: 28, alignItems: 'flex-start' }} className="shop-layout">

        {/* Sidebar */}
        <aside className="shop-sidebar-wrap" style={{ width: 220, flexShrink: 0, display: showFilters || typeof window === 'undefined' ? 'block' : undefined }} id="shop-sidebar">
          <style>{`
            @media (min-width: 769px) { #shop-sidebar { display: block !important; } }
            @media (max-width: 768px) { #shop-sidebar { display: ${showFilters ? 'block' : 'none'} !important; } }
          `}</style>
          <div style={{ position: 'sticky', top: 80, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 4, padding: '8px 16px 16px' }}>
            <Sidebar
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              availability={availability}
              setAvailability={setAvailability}
              onClear={clearAll}
              genreCounts={genreCounts}
              langCounts={langCounts}
            />
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 340 }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 13, pointerEvents: 'none' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search title or author…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #e0e0e0', borderRadius: 4, fontSize: 13, color: '#111', outline: 'none', transition: 'border-color 0.15s' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#C82333')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e0e0e0')}
                />
              </div>
              <span style={{ fontSize: 12, color: '#999', whiteSpace: 'nowrap' }}>
                Showing <strong style={{ color: '#111' }}>{pageBooks.length}</strong> of <strong style={{ color: '#111' }}>{books.length}</strong>
              </span>
            </div>
            {/* View toggle */}
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                className={`shop-topbar-btn${view === 'grid' ? ' active' : ''}`}
                onClick={() => setView('grid')}
                title="Grid view"
                aria-pressed={view === 'grid'}
              >
                ⊞
              </button>
              <button
                className={`shop-topbar-btn${view === 'list' ? ' active' : ''}`}
                onClick={() => setView('list')}
                title="List view"
                aria-pressed={view === 'list'}
              >
                ☰
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: '#aaa', flexShrink: 0 }}>Filters:</span>
              {activeFilters.map(f => <FilterChip key={f.label} label={f.label} onRemove={f.remove} />)}
              <button onClick={clearAll} style={{ fontSize: 11, color: '#C82333', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Clear all</button>
            </div>
          )}

          {/* Books */}
          {loading ? (
            view === 'list' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} view="list" />)}
              </div>
            ) : (
              <div className="shop-grid-view">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} view="grid" />)}
              </div>
            )
          ) : pageBooks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
              <p style={{ color: '#888', fontSize: 15, marginBottom: 16 }}>No books found. Try adjusting your filters.</p>
              <button
                onClick={clearAll}
                style={{ padding: '10px 24px', border: 'none', borderRadius: 4, background: '#C82333', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                Clear Filters
              </button>
            </div>
          ) : view === 'list' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {booksVisible && pageBooks.map(book => <BookListRow key={book.id} book={book} />)}
            </div>
          ) : (
            <div className="shop-grid-view">
              {booksVisible && pageBooks.map(book => (
                <BookCard key={book.id} book={{ ...book, coverColor: book.cover_color } as never} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 40 }}>
              <button
                onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page === 1}
                style={{ padding: '8px 16px', border: '1px solid #e0e0e0', borderRadius: 4, background: page === 1 ? '#f5f5f5' : '#fff', color: page === 1 ? '#ccc' : '#333', fontSize: 13, fontWeight: 600, cursor: page === 1 ? 'default' : 'pointer' }}
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                if (totalPages <= 7 || p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                  return (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      style={{ width: 34, height: 34, border: `1px solid ${page === p ? '#C82333' : '#e0e0e0'}`, borderRadius: 4, background: page === p ? '#C82333' : '#fff', color: page === p ? '#fff' : '#444', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      {p}
                    </button>
                  );
                }
                if (p === page - 2 || p === page + 2) return <span key={p} style={{ color: '#bbb', fontSize: 14 }}>…</span>;
                return null;
              })}
              <button
                onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page === totalPages}
                style={{ padding: '8px 16px', border: '1px solid #e0e0e0', borderRadius: 4, background: page === totalPages ? '#f5f5f5' : '#fff', color: page === totalPages ? '#ccc' : '#333', fontSize: 13, fontWeight: 600, cursor: page === totalPages ? 'default' : 'pointer' }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div style={{ background: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#aaa', fontSize: 14 }}>Loading shop…</p>
      </div>
    }>
      <ShopInner />
    </Suspense>
  );
}
