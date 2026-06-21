'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import MobileDrawer from '@frontend/components/MobileDrawer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Customer {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  created_at: string;
  order_count?: number;
  total_spent?: number;
  type?: 'registered' | 'guest';
  joined_at?: string;
}

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/books', label: 'Books', icon: '📚' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/customers', label: 'Customers', icon: '👥' },
];

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = ['#C82333', '#1F618D', '#28A745', '#8B4513', '#4A235A', '#7A9E7E', '#B7950B'];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/api/orders?limit=500`).then(r => r.json()),
        fetch(`${API_URL}/api/users`).then(r => r.json()).catch(() => ({ users: [] })),
      ]);

      const orders = ordersRes.orders || [];
      const registeredUsers: { id: string; name: string; email: string; role: string; created_at: string }[] = usersRes.users || [];

      const map: Record<string, { name: string; email: string; count: number; spent: number; latest: string; type: 'registered' | 'guest'; joined_at?: string }> = {};

      for (const u of registeredUsers) {
        map[u.email] = { name: u.name, email: u.email, count: 0, spent: 0, latest: u.created_at, type: 'registered', joined_at: u.created_at };
      }

      for (const o of orders) {
        if (!map[o.customer_email]) {
          map[o.customer_email] = { name: o.customer_name, email: o.customer_email, count: 0, spent: 0, latest: o.created_at, type: 'guest' };
        }
        map[o.customer_email].count += 1;
        map[o.customer_email].spent += o.total_amount;
        if (o.created_at > map[o.customer_email].latest) map[o.customer_email].latest = o.created_at;
      }

      setCustomers(Object.values(map).map((c, i) => ({
        id: String(i),
        customer_name: c.name,
        customer_email: c.email,
        total_amount: c.spent,
        created_at: c.latest,
        order_count: c.count,
        total_spent: c.spent,
        type: c.type,
        joined_at: c.joined_at,
      })).sort((a, b) => (b.total_spent ?? 0) - (a.total_spent ?? 0)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const filtered = search
    ? customers.filter(c =>
        c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        c.customer_email.toLowerCase().includes(search.toLowerCase())
      )
    : customers;

  const totalRevenue = customers.reduce((s, c) => s + (c.total_spent ?? 0), 0);

  const sidebarNav = (
    <>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {adminLinks.map(({ href, label, icon }) => (
          <Link key={label} href={href}
            onClick={() => setSidebarOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 8, textDecoration: 'none', fontSize: 13,
              color: label === 'Customers' ? '#fff' : 'rgba(255,255,255,0.65)',
              backgroundColor: label === 'Customers' ? '#C82333' : 'transparent',
            }}>
            <span>{icon}</span><span>{label}</span>
          </Link>
        ))}
      </nav>
      <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Link href="/" onClick={() => setSidebarOpen(false)} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, textDecoration: 'none' }}>← Back to Shop</Link>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .admin-desktop-sidebar { display: none !important; }
          .admin-mobile-topbar { display: flex !important; }
          .admin-main-padding { padding: 16px !important; }
          .admin-heading { font-size: 1.5rem !important; }
          .admin-header-row { flex-direction: column; align-items: flex-start !important; gap: 12px; }
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-table-scroll { overflow-x: auto; }
        }
        @media (min-width: 769px) {
          .admin-mobile-topbar { display: none !important; }
        }
      `}</style>

      <div style={{ backgroundColor: '#f8f8f8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Mobile top bar */}
        <div
          className="admin-mobile-topbar"
          style={{
            position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#1a1a1a',
            color: 'white', padding: '12px 16px', alignItems: 'center', gap: 12,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            style={{ background: 'none', border: 'none', color: 'white', fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: 0 }}
          >
            ≡
          </button>
          <span style={{ fontWeight: 700, fontSize: 15 }}>🍃 Admin Panel</span>
        </div>

        {/* Mobile sidebar drawer */}
        <MobileDrawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} title="" width={260}>
          <div style={{ backgroundColor: '#1a1a1a', minHeight: '100%', margin: '-16px -20px', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <span style={{ fontSize: 20 }}>🍃</span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Admin Panel</span>
            </div>
            {sidebarNav}
          </div>
        </MobileDrawer>

        <div style={{ display: 'flex', flex: 1 }}>
          {/* Desktop Sidebar */}
          <aside
            className="admin-desktop-sidebar"
            style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', width: 220, flexShrink: 0 }}
          >
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
                <span style={{ fontSize: 20 }}>🍃</span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Admin Panel</span>
              </div>
              {sidebarNav}
            </div>
          </aside>

          {/* Main */}
          <div className="admin-main-padding" style={{ flex: 1, padding: 32 }}>
            {/* Header */}
            <div className="admin-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h1 className="admin-heading" style={{ fontSize: 26, fontWeight: 800, color: '#1a1a1a', marginBottom: 2 }}>Customers</h1>
                <p style={{ fontSize: 13, color: '#888' }}>{customers.length} unique customers</p>
              </div>
              <button onClick={fetchCustomers}
                style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8, border: '1px solid #ddd', background: 'white', cursor: 'pointer', color: '#666' }}>
                ↻ Refresh
              </button>
            </div>

            {/* Stats */}
            <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Total Customers', value: customers.length, icon: '👥' },
                { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: '💰' },
                { label: 'Avg Order Value', value: customers.length ? `₹${Math.round(totalRevenue / customers.reduce((s, c) => s + (c.order_count ?? 0), 0) || 0).toLocaleString('en-IN')}` : '₹0', icon: '📊' },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#C82333', marginBottom: 2 }}>{value}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Search */}
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search customers by name or email…"
              style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, outline: 'none', background: 'white', marginBottom: 16, boxSizing: 'border-box' }}
            />

            {/* Customer table */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: 48, color: '#aaa', fontSize: 14 }}>Loading customers…</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, color: '#aaa', fontSize: 14 }}>
                {customers.length === 0 ? 'No orders yet — customers will appear here after their first order.' : 'No customers match your search.'}
              </div>
            ) : (
              <div className="admin-table-scroll" style={{ backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 520 }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      {['Customer', 'Email', 'Orders', 'Total Spent', 'Last Order'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c, i) => {
                      const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
                      return (
                        <tr key={c.customer_email} style={{ borderTop: '1px solid #f0f0f0', backgroundColor: i % 2 === 0 ? 'white' : '#fafafa' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 36, height: 36, borderRadius: '50%', backgroundColor: color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 700, fontSize: 13, flexShrink: 0,
                              }}>
                                {getInitials(c.customer_name)}
                              </div>
                              <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{c.customer_name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ color: '#555', fontSize: 13 }}>{c.customer_email}</div>
                            <span style={{ display: 'inline-block', marginTop: 3, padding: '1px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700,
                              backgroundColor: c.type === 'registered' ? '#e8f5e9' : '#fff3e0',
                              color: c.type === 'registered' ? '#2e7d32' : '#e65100' }}>
                              {c.type === 'registered' ? '✓ Registered' : 'Guest'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, backgroundColor: '#fff3f4', color: '#C82333', fontWeight: 700, fontSize: 12 }}>
                              {c.order_count} order{(c.order_count ?? 0) > 1 ? 's' : ''}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1a1a1a' }}>
                            ₹{(c.total_spent ?? 0).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#888', fontSize: 12 }}>
                            {new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
