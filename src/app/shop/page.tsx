'use client';
import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BookCard from '@/components/BookCard';

const languages = ['English', 'Japanese', 'Hindi', 'Marathi', 'Manga/Anime'];
const genres = ['Fiction', 'Non-fiction', 'Mystery', 'Romance', 'Fantasy', 'Self-help', "Children's", 'Manga', 'Poetry', 'History'];

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'title';
type ViewMode = 'grid' | 'list';

interface Book {
  id: string; title: string; author: string; price: number;
  language: string; genre: string; rating: number;
  description: string; cover_color: string; stock: number;
}

const PAGE_SIZE = 12;

// ── Skeleton card ──────────────────────────────────────────────────────────
function SkeletonCard({ view }: { view: ViewMode }) {
  if (view === 'list') {
    return (
      <div
        style={{
          display: 'flex',
          gap: 20,
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: '#fff',
          border: '1px solid #E8E0D5',
          padding: 16,
          alignItems: 'flex-start',
        }}
      >
        <div className="skeleton" style={{ width: 100, height: 140, borderRadius: 10, flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="skeleton" style={{ height: 16, width: '60%', borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 12, width: '35%', borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 12, width: '80%', borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 12, width: '70%', borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 32, width: 100, borderRadius: 8, marginTop: 8 }} />
        </div>
      </div>
    );
  }
  return (
    <div
      style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: '#fff', border: '1px solid #E8E0D5' }}
    >
      <div className="skeleton" style={{ height: 220, width: '100%' }} />
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 12, width: '90%', borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 10, width: '55%', borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 28, width: '100%', borderRadius: 8, marginTop: 4 }} />
      </div>
    </div>
  );
}

// ── List-view book row ─────────────────────────────────────────────────────
function BookListRow({ book, index }: { book: Book; index: number }) {
  const [hovered, setHovered] = useState(false);
  const stars = Math.round(book.rating);
  const delayClass = `delay-${Math.min((index % 6 + 1) * 100, 600) as 100 | 200 | 300 | 400 | 500 | 600}`;

  return (
    <div
      className={`animate-fadeInUp ${delayClass}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        gap: 20,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
        border: hovered ? '1.5px solid #2D5016' : '1px solid #E8E0D5',
        boxShadow: hovered ? '0 8px 28px rgba(45,80,22,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.22s ease',
        transform: hovered ? 'translateY(-3px)' : 'none',
        cursor: 'pointer',
        opacity: 0,
        animationFillMode: 'both',
      }}
    >
      {/* Colour swatch / cover */}
      <a href={`/book/${book.id}`} style={{ flexShrink: 0 }}>
        <div
          style={{
            width: 100,
            minHeight: 140,
            backgroundColor: book.cover_color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
          }}
        >
          📚
        </div>
      </a>

      {/* Details */}
      <div style={{ flex: 1, padding: '16px 16px 16px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <a href={`/book/${book.id}`} style={{ textDecoration: 'none' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#1a1a1a',
                  lineHeight: 1.3,
                  marginBottom: 2,
                }}
              >
                {book.title}
              </h3>
            </a>
            <p style={{ fontSize: 13, color: '#8B4513', marginBottom: 6 }}>{book.author}</p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#2D5016' }}>₹{book.price}</span>
          </div>
        </div>

        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 4 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ color: i < stars ? '#F6AD55' : '#D1D5DB', fontSize: 13 }}>★</span>
          ))}
          <span style={{ fontSize: 12, color: '#999', marginLeft: 4 }}>({book.rating})</span>
        </div>

        {/* Description — richer in list view */}
        {book.description && (
          <p
            style={{
              fontSize: 13,
              color: '#555',
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {book.description}
          </p>
        )}

        {/* Badges + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 11,
              padding: '3px 10px',
              borderRadius: 20,
              backgroundColor: '#EFF6E8',
              color: '#2D5016',
              fontWeight: 600,
            }}
          >
            {book.genre}
          </span>
          <span
            style={{
              fontSize: 11,
              padding: '3px 10px',
              borderRadius: 20,
              backgroundColor: '#FEF9EE',
              color: '#8B4513',
              fontWeight: 600,
            }}
          >
            {book.language}
          </span>
          <button
            style={{
              marginLeft: 'auto',
              padding: '7px 18px',
              borderRadius: 10,
              border: '1.5px solid #2D5016',
              backgroundColor: hovered ? '#2D5016' : 'transparent',
              color: hovered ? '#FAF7F2' : '#2D5016',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            + Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Active filter chip ─────────────────────────────────────────────────────
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 12px',
        borderRadius: 20,
        backgroundColor: '#EFF6E8',
        border: '1px solid #C5DBA8',
        fontSize: 12,
        color: '#2D5016',
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#2D5016',
          lineHeight: 1,
          padding: 0,
          fontSize: 14,
          opacity: 0.6,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        ×
      </button>
    </span>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({
  selectedLanguages, setSelectedLanguages,
  selectedGenres, setSelectedGenres,
  priceRange, setPriceRange,
  minRating, setMinRating,
  setSearch,
}: {
  selectedLanguages: string[]; setSelectedLanguages: (v: string[]) => void;
  selectedGenres: string[]; setSelectedGenres: (v: string[]) => void;
  priceRange: string; setPriceRange: (v: string) => void;
  minRating: number; setMinRating: (v: number) => void;
  setSearch: (v: string) => void;
}) {
  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  const sectionHead: React.CSSProperties = {
    fontWeight: 600,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: '#2D5016',
    marginBottom: 10,
    display: 'block',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Languages */}
      <div>
        <span style={sectionHead}>Language</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {languages.map(lang => (
            <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedLanguages.includes(lang)}
                onChange={() => toggle(selectedLanguages, setSelectedLanguages, lang)}
                style={{ accentColor: '#2D5016' }}
              />
              <span style={{ fontSize: 13, color: '#444' }}>{lang}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Genres */}
      <div>
        <span style={sectionHead}>Genre</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {genres.map(genre => (
            <label key={genre} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => toggle(selectedGenres, setSelectedGenres, genre)}
                style={{ accentColor: '#2D5016' }}
              />
              <span style={{ fontSize: 13, color: '#444' }}>{genre}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <span style={sectionHead}>Price Range</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[['all', 'All Prices'], ['under300', 'Under ₹300'], ['300to500', '₹300 – ₹500'], ['above500', 'Above ₹500']].map(([val, label]) => (
            <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="radio"
                name="price"
                value={val}
                checked={priceRange === val}
                onChange={() => setPriceRange(val)}
                style={{ accentColor: '#2D5016' }}
              />
              <span style={{ fontSize: 13, color: '#444' }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <span style={sectionHead}>Min Rating</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[[0, 'All'], [4, '4+ ★'], [4.5, '4.5+ ★'], [4.7, '4.7+ ★']].map(([val, label]) => (
            <label key={String(val)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="radio"
                name="rating"
                checked={minRating === val}
                onChange={() => setMinRating(Number(val))}
                style={{ accentColor: '#2D5016' }}
              />
              <span style={{ fontSize: 13, color: '#444' }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => { setSelectedLanguages([]); setSelectedGenres([]); setPriceRange('all'); setMinRating(0); setSearch(''); }}
        style={{
          width: '100%',
          padding: '9px 0',
          borderRadius: 10,
          fontSize: 12,
          fontWeight: 600,
          border: '1.5px solid #2D5016',
          color: '#2D5016',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          transition: 'background 0.2s ease, color 0.2s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2D5016';
          (e.currentTarget as HTMLButtonElement).style.color = '#FAF7F2';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.color = '#2D5016';
        }}
      >
        Clear All Filters
      </button>
    </div>
  );
}

// ── Inner page (reads searchParams) ───────────────────────────────────────
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
  const [minRating, setMinRating] = useState<number>(0);
  const [sort, setSort] = useState<SortOption>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const [booksVisible, setBooksVisible] = useState(false);
  const initialised = useRef(false);

  // Read URL params on first mount
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
    if (maxPrice === '299') setPriceRange('under300');
    if (sortParam === 'rating' && orderParam === 'desc') setSort('rating');
    if (sortParam === 'created_at' && orderParam === 'desc') setSort('default');
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
      if (priceRange === 'under300') params.set('maxPrice', '299');
      if (priceRange === '300to500') { params.set('minPrice', '300'); params.set('maxPrice', '500'); }
      if (priceRange === 'above500') params.set('minPrice', '501');
      if (sort === 'price-asc') { params.set('sort', 'price'); params.set('order', 'asc'); }
      else if (sort === 'price-desc') { params.set('sort', 'price'); params.set('order', 'desc'); }
      else if (sort === 'rating') { params.set('sort', 'rating'); params.set('order', 'desc'); }
      else if (sort === 'title') { params.set('sort', 'title'); params.set('order', 'asc'); }

      const res = await fetch(`/api/books?${params}`);
      const data = await res.json();

      let result: Book[] = data.books || [];
      if (selectedLanguages.length > 1) result = result.filter(b => selectedLanguages.includes(b.language));
      if (selectedGenres.length > 1) result = result.filter(b => selectedGenres.includes(b.genre));
      if (minRating > 0) result = result.filter(b => b.rating >= minRating);

      setBooks(result);
      setTotal(data.total || result.length);
      setPage(1);
    } finally {
      setLoading(false);
      // Slight delay so the fade-in is visible
      setTimeout(() => setBooksVisible(true), 80);
    }
  }, [search, selectedLanguages, selectedGenres, priceRange, minRating, sort]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
  const pageBooks = books.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Active filters
  const activeFilters: Array<{ label: string; remove: () => void }> = [
    ...selectedLanguages.map(l => ({ label: `Language: ${l}`, remove: () => setSelectedLanguages(selectedLanguages.filter(x => x !== l)) })),
    ...selectedGenres.map(g => ({ label: `Genre: ${g}`, remove: () => setSelectedGenres(selectedGenres.filter(x => x !== g)) })),
    ...(priceRange !== 'all' ? [{
      label: priceRange === 'under300' ? 'Under ₹300' : priceRange === '300to500' ? '₹300–₹500' : 'Above ₹500',
      remove: () => setPriceRange('all'),
    }] : []),
    ...(minRating > 0 ? [{ label: `${minRating}+ ★`, remove: () => setMinRating(0) }] : []),
  ];

  const iconBtn = (active: boolean): React.CSSProperties => ({
    padding: '8px 12px',
    borderRadius: 10,
    border: `1.5px solid ${active ? '#2D5016' : '#E8E0D5'}`,
    backgroundColor: active ? '#2D5016' : '#fff',
    color: active ? '#FAF7F2' : '#555',
    cursor: 'pointer',
    fontSize: 16,
    lineHeight: 1,
    transition: 'all 0.15s ease',
  });

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', fontFamily: 'var(--font-lato), sans-serif' }}>
      {/* ── Header ── */}
      <div style={{ backgroundColor: '#2D5016', padding: '48px 0 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 'clamp(28px, 5vw, 44px)',
              fontWeight: 700,
              color: '#FAF7F2',
              marginBottom: 6,
            }}
          >
            Our Collection
          </h1>
          <p style={{ color: 'rgba(250,247,242,0.65)', fontSize: 15 }}>
            {total > 0 ? `${total} books across languages and genres` : 'Discovering books for you…'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px 64px' }}>
        {/* ── Search + Sort + View toggle ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: activeFilters.length > 0 ? 12 : 24,
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#aaa',
                fontSize: 16,
                pointerEvents: 'none',
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by title or author…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: 38,
                paddingRight: 16,
                paddingTop: 11,
                paddingBottom: 11,
                borderRadius: 12,
                border: '1.5px solid #E8E0D5',
                backgroundColor: '#fff',
                fontSize: 14,
                outline: 'none',
                color: '#1a1a1a',
              }}
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            style={{
              padding: '11px 14px',
              borderRadius: 12,
              border: '1.5px solid #E8E0D5',
              backgroundColor: '#fff',
              fontSize: 13,
              color: '#1a1a1a',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="title">Title: A–Z</option>
          </select>

          {/* View toggle */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setView('grid')}
              title="Grid view"
              style={iconBtn(view === 'grid')}
              aria-pressed={view === 'grid'}
            >
              ⊞
            </button>
            <button
              onClick={() => setView('list')}
              title="List view"
              style={iconBtn(view === 'list')}
              aria-pressed={view === 'list'}
            >
              ☰
            </button>
          </div>

          {/* Mobile filter toggle */}
          <button
            style={{
              padding: '11px 16px',
              borderRadius: 12,
              border: '1.5px solid #E8E0D5',
              backgroundColor: showFilters ? '#2D5016' : '#fff',
              color: showFilters ? '#FAF7F2' : '#555',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'none',
            }}
            className="md-hide-on-desktop"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Filters ⚙️'}
          </button>
        </div>

        {/* ── Active filters chips ── */}
        {activeFilters.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 12, color: '#999', flexShrink: 0 }}>Active filters:</span>
            {activeFilters.map(f => (
              <FilterChip key={f.label} label={f.label} onRemove={f.remove} />
            ))}
            <button
              onClick={() => {
                setSelectedLanguages([]); setSelectedGenres([]);
                setPriceRange('all'); setMinRating(0); setSearch('');
              }}
              style={{
                fontSize: 11,
                color: '#8B4513',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                flexShrink: 0,
              }}
            >
              Clear all
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
          {/* ── Sidebar ── */}
          <aside
            style={{
              width: 220,
              flexShrink: 0,
              display: showFilters ? 'block' : undefined,
            }}
            className="shop-sidebar"
          >
            <div
              style={{
                borderRadius: 18,
                padding: 24,
                position: 'sticky',
                top: 80,
                backgroundColor: '#fff',
                border: '1px solid #E8E0D5',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#2D5016',
                  marginBottom: 20,
                }}
              >
                Filters
              </h2>
              <Sidebar
                selectedLanguages={selectedLanguages}
                setSelectedLanguages={setSelectedLanguages}
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minRating={minRating}
                setMinRating={setMinRating}
                setSearch={setSearch}
              />
            </div>
          </aside>

          {/* ── Books area ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                color: '#999',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>
                Showing <strong style={{ color: '#1a1a1a' }}>{pageBooks.length}</strong> of{' '}
                <strong style={{ color: '#1a1a1a' }}>{books.length}</strong> books
              </span>
              {totalPages > 1 && (
                <span style={{ color: '#aaa' }}>
                  Page {page} of {totalPages}
                </span>
              )}
            </div>

            {loading ? (
              <div
                style={{
                  display: view === 'list'
                    ? 'flex'
                    : 'grid',
                  gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(200px, 1fr))' : undefined,
                  flexDirection: view === 'list' ? 'column' : undefined,
                  gap: 16,
                }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} view={view} />
                ))}
              </div>
            ) : pageBooks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>📚</div>
                <p style={{ color: '#888', fontSize: 15 }}>No books found. Try adjusting your filters.</p>
                <button
                  onClick={() => { setSelectedLanguages([]); setSelectedGenres([]); setPriceRange('all'); setMinRating(0); setSearch(''); }}
                  style={{
                    marginTop: 16,
                    padding: '10px 24px',
                    borderRadius: 10,
                    border: 'none',
                    backgroundColor: '#2D5016',
                    color: '#FAF7F2',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : view === 'list' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {booksVisible && pageBooks.map((book, i) => (
                  <BookListRow key={book.id} book={book} index={i} />
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 18,
                }}
              >
                {booksVisible && pageBooks.map((book, i) => (
                  <div
                    key={book.id}
                    className={`animate-fadeInUp delay-${Math.min((i % 6 + 1) * 100, 600) as 100 | 200 | 300 | 400 | 500 | 600}`}
                    style={{ opacity: 0, animationFillMode: 'both' }}
                  >
                    <BookCard book={{ ...book, coverColor: book.cover_color } as never} />
                  </div>
                ))}
              </div>
            )}

            {/* ── Pagination ── */}
            {!loading && totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  marginTop: 40,
                }}
              >
                <button
                  onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === 1}
                  style={{
                    padding: '9px 20px',
                    borderRadius: 10,
                    border: '1.5px solid #E8E0D5',
                    backgroundColor: page === 1 ? '#f5f5f5' : '#fff',
                    color: page === 1 ? '#ccc' : '#2D5016',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: page === 1 ? 'default' : 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  ← Prev
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const p = idx + 1;
                  if (totalPages <= 7 || p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                    return (
                      <button
                        key={p}
                        onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          border: `1.5px solid ${page === p ? '#2D5016' : '#E8E0D5'}`,
                          backgroundColor: page === p ? '#2D5016' : '#fff',
                          color: page === p ? '#FAF7F2' : '#444',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {p}
                      </button>
                    );
                  }
                  if (p === page - 2 || p === page + 2) {
                    return <span key={p} style={{ color: '#bbb', fontSize: 14 }}>…</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === totalPages}
                  style={{
                    padding: '9px 20px',
                    borderRadius: 10,
                    border: '1.5px solid #E8E0D5',
                    backgroundColor: page === totalPages ? '#f5f5f5' : '#fff',
                    color: page === totalPages ? '#ccc' : '#2D5016',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: page === totalPages ? 'default' : 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive sidebar visibility */}
      <style>{`
        @media (max-width: 768px) {
          .shop-sidebar { display: ${showFilters ? 'block' : 'none'} !important; width: 100% !important; }
          .md-hide-on-desktop { display: block !important; }
        }
        @media (min-width: 769px) {
          .shop-sidebar { display: block !important; }
          .md-hide-on-desktop { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── Page shell — wraps inner in Suspense for useSearchParams ──────────────
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ color: '#aaa', fontSize: 14 }}>Loading shop…</p>
        </div>
      </div>
    }>
      <ShopInner />
    </Suspense>
  );
}
