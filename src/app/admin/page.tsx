'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

interface Stats {
  totalBooks: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: number;
  ordersByStatus: Record<string, number>;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items?: { book?: { title: string } }[];
}

const statusColors: Record<string, string> = {
  Delivered: '#2D5016', Processing: '#8B4513', Shipped: '#1F618D',
  Pending: '#B7950B', Cancelled: '#922B21',
};

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/books', label: 'Books', icon: '📚' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/customers', label: 'Customers', icon: '👥' },
];

const LANGUAGES = ['English', 'Japanese', 'Hindi', 'Marathi', 'Manga/Anime'];
const GENRES = ['Fiction', 'Non-fiction', 'Mystery', 'Romance', 'Fantasy', 'Self-help', "Children's", 'Manga', 'Poetry', 'History'];

const statDelays = ['delay-100', 'delay-200', 'delay-300', 'delay-400'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', author: '', price: '', language: 'English', genre: 'Fiction', description: '', cover_color: '#2D5016', stock: '10' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/orders?limit=5').then(r => r.json()),
      ]);
      setStats(statsRes);
      setOrders(ordersRes.orders || []);
    } catch {
      showToast('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleAddBook(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Failed to add book'); return; }
      showToast('✅ Book added successfully!');
      setFormData({ title: '', author: '', price: '', language: 'English', genre: 'Fiction', description: '', cover_color: '#2D5016', stock: '10' });
      fetchData();
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(orderId: string, status: string) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) { showToast('Order status updated'); fetchData(); }
    else showToast('Failed to update status');
  }

  const statCards = [
    { label: 'Total Books', value: stats?.totalBooks ?? '—', icon: '📚', color: '#2D5016' },
    { label: 'Total Orders', value: stats?.totalOrders ?? '—', icon: '📦', color: '#8B4513' },
    { label: 'Revenue', value: stats ? `₹${stats.totalRevenue.toLocaleString('en-IN')}` : '—', icon: '💰', color: '#4A235A' },
    { label: 'Customers', value: stats?.totalUsers ?? '—', icon: '👥', color: '#1F618D' },
  ];

  return (
    <div style={{ backgroundColor: '#FAF7F2' }} className="min-h-screen flex">
      {/* Toast — slideDown animation */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-slideDown"
          style={{ backgroundColor: '#2D5016' }}
        >
          {toast}
        </div>
      )}

      {/* Sidebar */}
      <aside style={{ backgroundColor: '#2D5016', minHeight: '100vh' }} className="w-56 shrink-0">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl">🍃</span>
            <span style={{ fontFamily: 'var(--font-playfair), serif', color: '#FAF7F2' }} className="font-bold text-sm">Admin Panel</span>
          </div>
          <nav className="space-y-1">
            {adminLinks.map(({ href, label, icon }) => (
              <Link key={label} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-white/10"
                style={{ color: '#FAF7F2' }}>
                <span>{icon}</span><span>{label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-8 pt-8 border-t border-white/20">
            <Link href="/" className="flex items-center gap-2 text-xs opacity-70 hover:opacity-100 transition-opacity" style={{ color: '#FAF7F2' }}>
              ← Back to Shop
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', color: '#2D5016' }} className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back! Here&apos;s what&apos;s happening at Leaf &amp; Lore.</p>
          </div>
          <button onClick={fetchData} className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50" style={{ borderColor: '#E8E0D5', color: '#8B4513' }}>
            ↻ Refresh
          </button>
        </div>

        {/* Stats — each card gets scaleIn with staggered delays */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon, color }, idx) => (
            <div
              key={label}
              className={`rounded-2xl p-5 shadow-sm animate-scaleIn ${statDelays[idx]} hover-lift`}
              style={{ backgroundColor: 'white', border: '1px solid #E8E0D5', opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{icon}</span>
                {loading && <span className="text-xs text-gray-400">loading…</span>}
              </div>
              <p style={{ fontFamily: 'var(--font-playfair), serif', color }} className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Status breakdown */}
        {stats?.ordersByStatus && Object.keys(stats.ordersByStatus).length > 0 && (
          <div className="mb-6 rounded-2xl p-5 shadow-sm flex flex-wrap gap-3" style={{ backgroundColor: 'white', border: '1px solid #E8E0D5' }}>
            <span className="text-xs font-medium text-gray-500 self-center mr-2">Orders by status:</span>
            {Object.entries(stats.ordersByStatus).map(([s, n]) => (
              <span key={s} className="text-xs px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: statusColors[s] || '#888' }}>
                {s}: {n}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: 'white', border: '1px solid #E8E0D5' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontFamily: 'var(--font-playfair), serif', color: '#2D5016' }} className="text-xl font-bold">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs hover:underline" style={{ color: '#8B4513' }}>View all →</Link>
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-400 text-sm">Loading orders…</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No orders yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b" style={{ borderColor: '#E8E0D5' }}>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium hidden md:table-cell">Books</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, rowIdx) => (
                      <tr
                        key={order.id}
                        className={`border-b last:border-0 animate-fadeInUp`}
                        style={{
                          borderColor: '#F0EBE3',
                          animationDelay: `${0.05 * rowIdx + 0.2}s`,
                          opacity: 0,
                          animationFillMode: 'forwards',
                        }}
                      >
                        <td className="py-3">
                          <div className="font-medium text-gray-800 text-xs">{order.customer_name}</div>
                          <div className="text-gray-400 text-xs">{order.customer_email}</div>
                        </td>
                        <td className="py-3 text-gray-500 hidden md:table-cell text-xs max-w-[150px] truncate">
                          {order.order_items?.map(i => i.book?.title).filter(Boolean).join(', ') || '—'}
                        </td>
                        <td className="py-3 font-medium text-xs">₹{order.total_amount.toLocaleString('en-IN')}</td>
                        <td className="py-3">
                          <select
                            value={order.status}
                            onChange={e => handleStatusChange(order.id, e.target.value)}
                            className="text-xs px-2 py-0.5 rounded-full text-white border-0 outline-none cursor-pointer"
                            style={{ backgroundColor: statusColors[order.status] || '#888' }}>
                            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                              <option key={s} value={s} style={{ backgroundColor: '#fff', color: '#1a1a1a' }}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Add Book */}
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: 'white', border: '1px solid #E8E0D5' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair), serif', color: '#2D5016' }} className="text-xl font-bold mb-5">Add Book</h2>
            <form onSubmit={handleAddBook} className="space-y-3">
              {(['title', 'author'] as const).map(field => (
                <div key={field}>
                  <label className="text-xs font-medium text-gray-600 block mb-1 capitalize">{field}</label>
                  <input
                    type="text"
                    required
                    value={formData[field]}
                    onChange={e => setFormData(p => ({ ...p, [field]: e.target.value }))}
                    placeholder={`Book ${field}`}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200"
                    style={{ border: '1.5px solid #E8E0D5', backgroundColor: '#FAF7F2' }}
                    onFocus={e => { e.currentTarget.style.border = '1.5px solid #2D5016'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,80,22,0.1)'; }}
                    onBlur={e => { e.currentTarget.style.border = '1.5px solid #E8E0D5'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                    placeholder="₹"
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200"
                    style={{ border: '1.5px solid #E8E0D5', backgroundColor: '#FAF7F2' }}
                    onFocus={e => { e.currentTarget.style.border = '1.5px solid #2D5016'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,80,22,0.1)'; }}
                    onBlur={e => { e.currentTarget.style.border = '1.5px solid #E8E0D5'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={e => setFormData(p => ({ ...p, stock: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200"
                    style={{ border: '1.5px solid #E8E0D5', backgroundColor: '#FAF7F2' }}
                    onFocus={e => { e.currentTarget.style.border = '1.5px solid #2D5016'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,80,22,0.1)'; }}
                    onBlur={e => { e.currentTarget.style.border = '1.5px solid #E8E0D5'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
              {(['language', 'genre'] as const).map(field => (
                <div key={field}>
                  <label className="text-xs font-medium text-gray-600 block mb-1 capitalize">{field}</label>
                  <select
                    value={formData[field]}
                    onChange={e => setFormData(p => ({ ...p, [field]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200"
                    style={{ border: '1.5px solid #E8E0D5', backgroundColor: '#FAF7F2', color: '#1a1a1a' }}
                    onFocus={e => { e.currentTarget.style.border = '1.5px solid #2D5016'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,80,22,0.1)'; }}
                    onBlur={e => { e.currentTarget.style.border = '1.5px solid #E8E0D5'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {(field === 'language' ? LANGUAGES : GENRES).map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Cover Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={formData.cover_color}
                    onChange={e => setFormData(p => ({ ...p, cover_color: e.target.value }))}
                    className="h-8 w-10 rounded cursor-pointer border-0" />
                  <span className="text-xs text-gray-500">{formData.cover_color}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Short description…"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none transition-all duration-200"
                  style={{ border: '1.5px solid #E8E0D5', backgroundColor: '#FAF7F2' }}
                  onFocus={e => { e.currentTarget.style.border = '1.5px solid #2D5016'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,80,22,0.1)'; }}
                  onBlur={e => { e.currentTarget.style.border = '1.5px solid #E8E0D5'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
              <button type="submit" disabled={saving}
                className="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:opacity-90 mt-2 disabled:opacity-60"
                style={{ backgroundColor: '#2D5016', color: 'white' }}>
                {saving ? 'Adding…' : '+ Add Book'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
