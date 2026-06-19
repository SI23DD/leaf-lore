'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{ backgroundColor: '#2D5016' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍃</span>
            <span style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F2' }} className="text-xl font-bold tracking-wide">
              Leaf & Lore
            </span>
            {isAdmin && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#8B4513', color: '#FAF7F2' }}>
                Admin
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {([['/', 'Home'], ['/shop', 'Shop'], ['/admin', 'Admin']] as [string, string][]).map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: pathname === href ? '#7A9E7E' : '#FAF7F2' }}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2">
              <span className="text-2xl">🛒</span>
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: '#8B4513', color: 'white' }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-white text-xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-2">
            {([['/', 'Home'], ['/shop', 'Shop'], ['/admin', 'Admin']] as [string, string][]).map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="px-2 py-1 text-sm"
                style={{ color: '#FAF7F2' }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
