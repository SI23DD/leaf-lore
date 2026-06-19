'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const navLinks: [string, string][] = [
  ['/', 'Home'],
  ['/shop', 'Shop'],
  ['/shop?genre=Fiction', 'Fiction'],
  ['/shop?genre=Manga', 'Manga'],
  ['/shop?language=Hindi', 'Hindi Books'],
  ['/shop?language=Marathi', 'Marathi Books'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

const categories = ['All', 'Fiction', 'Non-fiction', 'Mystery', 'Romance', 'Fantasy', 'Self-help', 'Manga', 'Poetry'];

export default function Navbar() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ll_user');
      if (stored) {
        const u = JSON.parse(stored);
        setUserName(u.name || u.email || null);
      }
    } catch {}
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (searchCategory !== 'All') params.set('genre', searchCategory);
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      {/* Main navbar row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🍃</span>
            <span
              className="text-xl font-bold tracking-wide"
              style={{ fontFamily: 'Georgia, serif', color: '#2D5016' }}
            >
              Leaf &amp; Lore
            </span>
          </Link>

          {/* Search bar — center */}
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center max-w-xl mx-auto hidden md:flex"
            style={{ border: '1.5px solid #D1D5DB', borderRadius: 8, overflow: 'hidden', backgroundColor: '#FAF7F2' }}
          >
            <select
              value={searchCategory}
              onChange={e => setSearchCategory(e.target.value)}
              className="text-xs px-2 py-2 outline-none bg-transparent border-r"
              style={{ borderColor: '#D1D5DB', color: '#555', minWidth: 80 }}
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search books, authors, genres..."
              className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
              style={{ color: '#1a1a1a' }}
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#2D5016' }}
            >
              Search
            </button>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            {/* Account / Login */}
            <Link
              href={userName ? '/account' : '/login'}
              className="relative p-1.5 hidden md:flex items-center gap-1 text-xs font-medium"
              style={{ color: '#2D5016' }}
              title={userName ? 'My Account' : 'Login'}
            >
              <span className="text-lg">👤</span>
              <span className="hidden lg:inline">{userName ? userName.split(' ')[0] : 'Login'}</span>
            </Link>

            {/* Wishlist placeholder */}
            <button className="relative p-1.5 hidden md:flex items-center" title="Wishlist" style={{ color: '#555' }}>
              <span className="text-xl">♡</span>
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-1.5 flex items-center" title="Cart">
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: '#8B4513', color: 'white' }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-xl"
              style={{ color: '#2D5016' }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Bottom nav links row */}
      <nav
        className="hidden md:block border-t"
        style={{ backgroundColor: '#2D5016', borderColor: '#1a3a0a' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 h-10 overflow-x-auto">
          {navLinks.map(([href, label]) => {
            const active = pathname === href || (href !== '/' && pathname?.startsWith(href.split('?')[0]));
            return (
              <Link
                key={label}
                href={href}
                className="text-xs font-medium whitespace-nowrap transition-opacity hover:opacity-80 shrink-0"
                style={{ color: active ? '#A8D5A2' : '#FAF7F2' }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4" style={{ backgroundColor: '#FAF7F2', borderTop: '1px solid #E8E0D5' }}>
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="flex mt-3 mb-3" style={{ border: '1.5px solid #D1D5DB', borderRadius: 8, overflow: 'hidden' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search books..."
              className="flex-1 px-3 py-2 text-sm outline-none"
              style={{ color: '#1a1a1a' }}
            />
            <button type="submit" className="px-3 py-2 text-sm text-white" style={{ backgroundColor: '#2D5016' }}>Go</button>
          </form>
          {navLinks.map(([href, label]) => (
            <Link
              key={label}
              href={href}
              className="block py-2 text-sm font-medium border-b"
              style={{ color: '#2D5016', borderColor: '#E8E0D5' }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
