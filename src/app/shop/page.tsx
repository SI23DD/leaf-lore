'use client';
import { useState, useEffect, useCallback } from 'react';
import BookCard from '@/components/BookCard';

const languages = ['English', 'Japanese', 'Hindi', 'Marathi', 'Manga/Anime'];
const genres = ['Fiction', 'Non-fiction', 'Mystery', 'Romance', 'Fantasy', 'Self-help', "Children's", 'Manga', 'Poetry', 'History'];

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'title';

interface Book {
  id: string; title: string; author: string; price: number;
  language: string; genre: string; rating: number;
  description: string; cover_color: string; stock: number;
}

export default function ShopPage() {
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

  const toggleFilter = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100' });
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

      // client-side multi-filter for language/genre when multiple selected
      let result: Book[] = data.books || [];
      if (selectedLanguages.length > 1) result = result.filter(b => selectedLanguages.includes(b.language));
      if (selectedGenres.length > 1) result = result.filter(b => selectedGenres.includes(b.genre));
      if (minRating > 0) result = result.filter(b => b.rating >= minRating);

      setBooks(result);
      setTotal(data.total || result.length);
    } finally {
      setLoading(false);
    }
  }, [search, selectedLanguages, selectedGenres, priceRange, minRating, sort]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const filtered = books;

  const Sidebar = () => (
    <div className="space-y-6">
      {/* Languages */}
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: '#2D5016' }}>Language</h3>
        <div className="space-y-2">
          {languages.map(lang => (
            <label key={lang} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLanguages.includes(lang)}
                onChange={() => toggleFilter(selectedLanguages, setSelectedLanguages, lang)}
                className="rounded"
                style={{ accentColor: '#2D5016' }}
              />
              <span className="text-sm text-gray-700">{lang}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Genres */}
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: '#2D5016' }}>Genre</h3>
        <div className="space-y-2">
          {genres.map(genre => (
            <label key={genre} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => toggleFilter(selectedGenres, setSelectedGenres, genre)}
                className="rounded"
                style={{ accentColor: '#2D5016' }}
              />
              <span className="text-sm text-gray-700">{genre}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: '#2D5016' }}>Price Range</h3>
        <div className="space-y-2">
          {[['all', 'All Prices'], ['under300', 'Under ₹300'], ['300to500', '₹300 – ₹500'], ['above500', 'Above ₹500']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                value={val}
                checked={priceRange === val}
                onChange={() => setPriceRange(val)}
                style={{ accentColor: '#2D5016' }}
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: '#2D5016' }}>Min Rating</h3>
        <div className="space-y-2">
          {[[0, 'All'], [4, '4+ ★'], [4.5, '4.5+ ★'], [4.7, '4.7+ ★']].map(([val, label]) => (
            <label key={String(val)} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === val}
                onChange={() => setMinRating(Number(val))}
                style={{ accentColor: '#2D5016' }}
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => { setSelectedLanguages([]); setSelectedGenres([]); setPriceRange('all'); setMinRating(0); setSearch(''); }}
        className="w-full py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
        style={{ border: '1.5px solid #2D5016', color: '#2D5016', backgroundColor: 'transparent' }}
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#FAF7F2' }} className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: '#2D5016' }} className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#FAF7F2', fontFamily: 'var(--font-playfair), serif' }}>Our Collection</h1>
          <p style={{ color: 'rgba(250,247,242,0.7)' }}>Discover {total}+ books across languages and genres</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl outline-none shadow-sm text-sm"
              style={{ backgroundColor: 'white', border: '1.5px solid #E8E0D5' }}
            />
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="px-4 py-3 rounded-xl outline-none text-sm shadow-sm"
            style={{ backgroundColor: 'white', border: '1.5px solid #E8E0D5', color: '#1a1a1a' }}
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="title">Title: A–Z</option>
          </select>
          <button
            className="md:hidden px-4 py-3 rounded-xl text-sm font-medium"
            style={{ backgroundColor: '#2D5016', color: 'white' }}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'} ⚙️
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`w-60 shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="rounded-2xl p-6 sticky top-20" style={{ backgroundColor: 'white', border: '1px solid #E8E0D5' }}>
              <h2 className="text-lg font-bold mb-6" style={{ color: '#2D5016', fontFamily: 'var(--font-playfair), serif' }}>Filters</h2>
              <Sidebar />
            </div>
          </aside>

          {/* Books Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-gray-500">
              Showing <strong>{filtered.length}</strong> books
            </div>
            {loading ? (
              <div className="text-center py-20 text-gray-400">Loading books…</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📚</div>
                <p className="text-gray-500">No books found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(book => (
                  <BookCard key={book.id} book={{ ...book, coverColor: book.cover_color } as never} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
