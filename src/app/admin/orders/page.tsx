'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface OrderItem { book?: { title: string; cover_color: string } }
interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}

const STATUS_COLORS: Record<string, string> = {
  Delivered: '#28A745', Processing: '#1F618D', Shipped: '#8B4513',
  Pending: '#B7950B', Cancelled: '#C82333',
};
const ALL_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/books', label: 'Books', icon: '📚' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/customers', label: 'Customers', icon: '👥' },
];

const PAGE_SIZE = 15;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String((page - 1) * PAGE_SIZE),
        ...(filterStatus ? { status: filterStatus } : {}),
      });
      const res = await fetch(`${API_URL}/api/orders?${params}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { setPage(1); }, [filterStatus]);

  async function updateStatus(orderId: string, status: string) {
    const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) { showToast('✅ Status updated'); fetchOrders(); }
    else showToast('Failed to update status');
  }

  const filtered = search
    ? orders.filter(o =>
        o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_email.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div style={{ backgroundColor: '#f8f8f8', minHeight: '100vh', display: 'flex' }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-slideDown"
          style={{ backgroundColor: '#1a1a1a' }}>{toast}</div>
      )}

      {/* Sidebar */}
      <aside style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', width: 220, flexShrink: 0 }}>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            <span style={{ fontSize: 20 }}>🍃</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Admin Panel</span>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {adminLinks.map(({ href, label, icon }) => (
              <Link key={label} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 8, textDecoration: 'none', fontSize: 13,
                color: label === 'Orders' ? '#fff' : 'rgba(255,255,255,0.65)',
                backgroundColor: label === 'Orders' ? '#C82333' : 'transparent',
                transition: 'all 0.15s',
              }}>
                <span>{icon}</span><span>{label}</span>
              </Link>
            ))}
          </nav>
          <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, textDecoration: 'none' }}>
              ← Back to Shop
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, padding: 32, overflowX: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a1a', marginBottom: 2 }}>Orders</h1>
            <p style={{ fontSize: 13, color: '#888' }}>{total} total orders</p>
          </div>
          <button onClick={fetchOrders} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8, border: '1px solid #ddd', background: 'white', cursor: 'pointer', color: '#666' }}>
            ↻ Refresh
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, order ID…"
            style={{ flex: 1, minWidth: 200, padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, outline: 'none', background: 'white' }}
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, outline: 'none', background: 'white', color: '#1a1a1a' }}>
            <option value="">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Status summary chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {ALL_STATUSES.map(s => (
            <button key={s} onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
              style={{
                padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
                backgroundColor: filterStatus === s ? STATUS_COLORS[s] : '#fff',
                color: filterStatus === s ? '#fff' : STATUS_COLORS[s],
                boxShadow: `inset 0 0 0 1.5px ${STATUS_COLORS[s]}`,
              }}>
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#aaa', fontSize: 14 }}>Loading orders…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#aaa', fontSize: 14 }}>No orders found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                  {['Order ID', 'Customer', 'Books', 'Amount', 'Date', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontWeight: 700, color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <tr key={order.id} style={{ borderTop: '1px solid #f0f0f0', backgroundColor: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 11, color: '#C82333', fontWeight: 600 }}>
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{order.customer_name}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>{order.customer_email}</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#555', maxWidth: 200 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.order_items?.map(i => i.book?.title).filter(Boolean).join(', ') || '—'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1a1a1a' }}>
                      ₹{order.total_amount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#888', fontSize: 12 }}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                        fontSize: 11, fontWeight: 700, color: 'white',
                        backgroundColor: STATUS_COLORS[order.status] || '#888',
                      }}>{order.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #ddd', fontSize: 12, outline: 'none', cursor: 'pointer', color: '#1a1a1a', background: 'white' }}>
                        {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
            <span style={{ fontSize: 12, color: '#888' }}>Page {page} of {totalPages}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #ddd', background: 'white', fontSize: 12, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
                ← Prev
              </button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #ddd', background: 'white', fontSize: 12, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1 }}>
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
