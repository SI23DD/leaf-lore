'use client';
import Link from 'next/link';
import { useCart } from '@frontend/context/CartContext';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const navLinks: [string, string][] = [
  ['/', 'Home'],
  ['/shop', 'Shop'],
  ['/shop?genre=Fiction', 'Categories'],
  ['/shop?language=Hindi', 'Hindi Books'],
  ['/shop?genre=Manga', 'Manga'],
  ['/contact', 'Contact'],
];

export default function Navbar() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ll_user');
      if (stored) {
        const u = JSON.parse(stored);
        setUserName(u.name || u.email || null);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  return (
    <>
      <style>{`
        .ll-nav-link {
          position: relative;
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
          text-decoration: none;
          padding: 4px 0;
          white-space: nowrap;
          transition: color 0.18s;
        }
        .ll-nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #C82333;
          transition: width 0.22s ease;
        }
        .ll-nav-link:hover,
        .ll-nav-link.active {
          color: #C82333;
        }
        .ll-nav-link:hover::after,
        .ll-nav-link.active::after {
          width: 100%;
        }
        .ll-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1a1a1a;
          transition: color 0.18s;
          border-radius: 4px;
        }
        .ll-icon-btn:hover { color: #C82333; }
        .ll-search-bar {
          display: flex;
          align-items: center;
          border: 1.5px solid #C82333;
          border-radius: 4px;
          overflow: hidden;
          background: #fff;
        }
        .ll-search-bar input {
          border: none;
          outline: none;
          padding: 6px 12px;
          font-size: 13px;
          color: #1a1a1a;
          width: 220px;
          background: transparent;
        }
        .ll-search-bar button {
          background: #C82333;
          border: none;
          color: #fff;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s;
          white-space: nowrap;
        }
        .ll-search-bar button:hover { background: #A71D2A; }
        .ll-cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #C82333;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .ll-marquee-track {
          display: flex;
          width: max-content;
          animation: ll-marquee 28s linear infinite;
        }
        .ll-marquee-track:hover { animation-play-state: paused; }
        @keyframes ll-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ll-mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          border-top: 2px solid #C82333;
          box-shadow: 0 6px 24px rgba(0,0,0,0.12);
          z-index: 100;
        }
        .ll-mobile-link {
          display: block;
          padding: 11px 20px;
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          text-decoration: none;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.15s, color 0.15s;
        }
        .ll-mobile-link:hover { background: #fff5f5; color: #C82333; }
        @media (prefers-reduced-motion: reduce) {
          .ll-marquee-track { animation: none; }
        }
      `}</style>

      <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        {/* Announcement bar */}
        <div style={{ backgroundColor: '#FFC107', textAlign: 'center', padding: '6px 16px', fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>
          🎉 Sale is Live! Free shipping above ₹500 &nbsp;|&nbsp; Festive Offers Every Week
        </div>

        {/* Main navbar */}
        <div style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', height: 60, gap: 24 }}>

            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
              <span style={{ fontSize: 22 }}>🍃</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.3px' }}>
                Leaf &amp; Lore
              </span>
            </Link>

            {/* Center nav links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1, justifyContent: 'center' }} className="ll-desktop-nav">
              {navLinks.map(([href, label]) => {
                const active = pathname === href || (href !== '/' && pathname?.startsWith(href.split('?')[0]));
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`ll-nav-link${active ? ' active' : ''}`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {/* Search toggle + expandable */}
              {searchOpen ? (
                <form onSubmit={handleSearch} className="ll-search-bar">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search books, authors..."
                    onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                  />
                  <button type="submit">Search</button>
                </form>
              ) : (
                <button
                  className="ll-icon-btn"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Open search"
                  title="Search"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
              )}

              {/* Account / Login */}
              <Link
                href={userName ? '/account' : '/login'}
                className="ll-icon-btn"
                title={userName ? 'My Account' : 'Login'}
                style={{ fontSize: 13, fontWeight: 500, gap: 4, textDecoration: 'none' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span style={{ display: 'none', fontSize: 12 }} className="ll-username-label">
                  {userName ? userName.split(' ')[0] : 'Login'}
                </span>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="ll-icon-btn"
                title="Cart"
                style={{ position: 'relative', textDecoration: 'none' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                {totalItems > 0 && (
                  <span className="ll-cart-badge">{totalItems}</span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                className="ll-icon-btn ll-hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                style={{ display: 'none' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {menuOpen
                    ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                    : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="ll-mobile-menu">
              <form
                onSubmit={e => { handleSearch(e); setMenuOpen(false); }}
                style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 8 }}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search books..."
                  style={{ flex: 1, padding: '7px 12px', border: '1.5px solid #dee2e6', borderRadius: 4, fontSize: 13, outline: 'none' }}
                />
                <button
                  type="submit"
                  style={{ background: '#C82333', color: '#fff', border: 'none', borderRadius: 4, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Go
                </button>
              </form>
              {navLinks.map(([href, label]) => (
                <Link
                  key={label}
                  href={href}
                  className="ll-mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Marquee strip */}
        <div style={{ backgroundColor: '#8B0000', overflow: 'hidden', padding: '6px 0' }}>
          <div className="ll-marquee-track">
            {[1, 2].map(n => (
              <span key={n} style={{ color: '#fff', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', paddingRight: 80 }}>
                📚 Light up your bookshelf with stories from around the world! &nbsp;&nbsp;✨ Festive Reads, Unbelievable Prices! &nbsp;&nbsp;🎁 Free Bookmark with Every Order! &nbsp;&nbsp;⭐ 500+ Happy Readers! &nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* Responsive overrides */}
        <style>{`
          @media (max-width: 768px) {
            .ll-desktop-nav { display: none !important; }
            .ll-hamburger { display: flex !important; }
          }
          @media (min-width: 1024px) {
            .ll-username-label { display: inline !important; }
          }
        `}</style>
      </header>
    </>
  );
}
