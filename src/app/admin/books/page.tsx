'use client';
import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  language: string;
  genre: string;
  rating: number;
  stock: number;
  cover_color: string;
  description: string;
}

const ITEMS_PER_PAGE = 10;

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/books', label: 'Books', icon: '📚' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/customers', label: 'Customers', icon: '👥' },
];

const LANGUAGES = ['English', 'Japanese', 'Hindi', 'Marathi', 'Manga/Anime'];
const GENRES = ['Fiction', 'Non-fiction', 'Mystery', 'Romance', 'Fantasy', 'Self-help', "Children's", 'Manga', 'Poetry', 'History'];

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(ITEMS_PER_PAGE),
        offset: String((page - 1) * ITEMS_PER_PAGE),
        ...(search ? { search } : {}),
      });
      const res = await fetch(`${API_URL}/api/books?${params}`);
      const data = await res.json();
      setBooks(data.books || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  // Reset to page 1 on search change
  useEffect(() => { setPage(1); }, [search]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`${API_URL}/api/books/${id}`, { method: 'DELETE' });
    if (res.ok) { showToast('Book deleted'); fetchBooks(); }
    else showToast('Failed to delete book');
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBook) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/books/${editingBook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingBook.title,
          author: editingBook.author,
          price: parseFloat(String(editingBook.price)),
          language: editingBook.language,
          genre: editingBook.genre,
          rating: parseFloat(String(editingBook.rating)),
          stock: parseInt(String(editingBook.stock)),
          cover_color: editingBook.cover_color,
          description: editingBook.description,
        }),
      });
      if (res.ok) {
        showToast('✅ Book updated');
        setEditingBook(null);
        fetchBooks();
      } else {
        const d = await res.json();
        showToast(d.error || 'Failed to update');
      }
    } finally {
      setSaving(false);
    }
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div style={{ backgroundColor: '#ffffff' }} className="min-h-screen flex">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium"
          style={{ backgroundColor: '#C82333' }}>{toast}</div>
      )}

      {/* Edit Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <h3 style={{ fontFamily: 'var(--font-playfair), serif', color: '#C82333' }} className="text-xl font-bold mb-4">Edit Book</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              {(['title', 'author', 'description'] as const).map(f => (
                <div key={f}>
                  <label className="text-xs font-medium text-gray-600 block mb-1 capitalize">{f}</label>
                  {f === 'description' ? (
                    <textarea rows={2} value={editingBook[f]}
                      onChange={e => setEditingBook(p => p ? { ...p, [f]: e.target.value } : p)}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                      style={{ border: '1.5px solid #e5e5e5', backgroundColor: '#ffffff' }} />
                  ) : (
                    <input type="text" value={editingBook[f]}
                      onChange={e => setEditingBook(p => p ? { ...p, [f]: e.target.value } : p)}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ border: '1.5px solid #e5e5e5', backgroundColor: '#ffffff' }} />
                  )}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Price (₹)</label>
                  <input type="number" min="1" value={editingBook.price}
                    onChange={e => setEditingBook(p => p ? { ...p, price: parseFloat(e.target.value) } : p)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ border: '1.5px solid #e5e5e5', backgroundColor: '#ffffff' }} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Stock</label>
                  <input type="number" min="0" value={editingBook.stock}
                    onChange={e => setEditingBook(p => p ? { ...p, stock: parseInt(e.target.value) } : p)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ border: '1.5px solid #e5e5e5', backgroundColor: '#ffffff' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Language</label>
                  <select value={editingBook.language}
                    onChange={e => setEditingBook(p => p ? { ...p, language: e.target.value } : p)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ border: '1.5px solid #e5e5e5', backgroundColor: '#ffffff', color: '#1a1a1a' }}>
                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Genre</label>
                  <select value={editingBook.genre}
                    onChange={e => setEditingBook(p => p ? { ...p, genre: e.target.value } : p)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ border: '1.5px solid #e5e5e5', backgroundColor: '#ffffff', color: '#1a1a1a' }}>
                    {GENRES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Rating (0–5)</label>
                <input type="number" min="0" max="5" step="0.1" value={editingBook.rating}
                  onChange={e => setEditingBook(p => p ? { ...p, rating: parseFloat(e.target.value) } : p)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ border: '1.5px solid #e5e5e5', backgroundColor: '#ffffff' }} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Cover Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={editingBook.cover_color}
                    onChange={e => setEditingBook(p => p ? { ...p, cover_color: e.target.value } : p)}
                    className="h-8 w-10 rounded cursor-pointer border-0" />
                  <span className="text-xs text-gray-500">{editingBook.cover_color}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: '#C82333' }}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditingBook(null)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-gray-50"
                  style={{ borderColor: '#e5e5e5', color: '#666' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside style={{ backgroundColor: '#1a1a1a', minHeight: '100vh' }} className="w-56 shrink-0">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl">🍃</span>
            <span style={{ fontFamily: 'var(--font-playfair), serif', color: '#ffffff' }} className="font-bold text-sm">Admin Panel</span>
          </div>
          <nav className="space-y-1">
            {adminLinks.map(({ href, label, icon }) => (
              <Link key={label} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-white/10"
                style={{ color: '#ffffff', backgroundColor: label === 'Books' ? 'rgba(255,255,255,0.15)' : 'transparent' }}>
                <span>{icon}</span><span>{label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-8 pt-8 border-t border-white/20">
            <Link href="/" className="flex items-center gap-2 text-xs opacity-70 hover:opacity-100 transition-opacity" style={{ color: '#ffffff' }}>
              ← Back to Shop
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', color: '#C82333' }} className="text-3xl font-bold mb-1">Books</h1>
            <p className="text-gray-500 text-sm">{total} books in catalog</p>
          </div>
          <Link href="/admin" className="text-sm px-4 py-2 rounded-xl font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#C82333' }}>+ Add Book</Link>
        </div>

        {/* Search */}
        <div className="mb-4 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or author…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ border: '1.5px solid #e5e5e5', backgroundColor: 'white' }}
          />
        </div>

        {/* Table */}
        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: 'white', border: '1px solid #e5e5e5' }}>
          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading books…</div>
          ) : books.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No books found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: '#f5f5f5' }}>
                <tr className="text-left text-xs text-gray-500">
                  <th className="px-4 py-3 font-medium">Book</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Language</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Genre</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id} className="border-t hover:bg-amber-50/30 transition-colors" style={{ borderColor: '#f5f5f5' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 rounded flex-shrink-0" style={{ backgroundColor: book.cover_color }} />
                        <div>
                          <div className="font-medium text-gray-800 text-xs leading-tight">{book.title}</div>
                          <div className="text-gray-400 text-xs">{book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f5f5f5', color: '#666666' }}>{book.language}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{book.genre}</td>
                    <td className="px-4 py-3 font-medium text-xs">₹{book.price}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className={book.stock < 5 ? 'text-red-500 font-medium' : 'text-gray-600'}>
                        {book.stock} {book.stock < 5 && book.stock > 0 ? '⚠️' : book.stock === 0 ? '❌' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setEditingBook(book)}
                          className="text-xs px-2.5 py-1 rounded-lg border transition-colors hover:bg-gray-50"
                          style={{ borderColor: '#e5e5e5', color: '#666666' }}>Edit</button>
                        <button onClick={() => handleDelete(book.id, book.title)}
                          className="text-xs px-2.5 py-1 rounded-lg border transition-colors hover:bg-red-50"
                          style={{ borderColor: '#fca5a5', color: '#dc2626' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-500 text-xs">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border text-xs disabled:opacity-40 transition-colors hover:bg-gray-50"
                style={{ borderColor: '#e5e5e5' }}>← Prev</button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border text-xs disabled:opacity-40 transition-colors hover:bg-gray-50"
                style={{ borderColor: '#e5e5e5' }}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
