'use client';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@frontend/context/AuthContext';
import AccountSidebar from '@frontend/components/AccountSidebar';

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  book: { title: string; cover_color: string };
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  customer_email?: string;
  order_items: OrderItem[];
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending:    { bg: '#FEF3C7', text: '#92400E' },
  Processing: { bg: '#DBEAFE', text: '#1E40AF' },
  Shipped:    { bg: '#E0E7FF', text: '#3730A3' },
  Delivered:  { bg: '#D1FAE5', text: '#065F46' },
  Cancelled:  { bg: '#FEE2E2', text: '#991B1B' },
};

function StatCard({ value, label, delay, icon }: { value: string; label: string; delay: string; icon: string }) {
  return (
    <div
      className={`animate-fadeInUp ${delay}`}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '20px 24px',
        flex: '1',
        minWidth: '120px',
      }}
    >
      <div style={{ fontSize: '22px', marginBottom: '8px' }}>{icon}</div>
      <p style={{ fontSize: '26px', fontWeight: '700', color: '#C82333', lineHeight: '1', marginBottom: '4px' }}>
        {value}
      </p>
      <p style={{ fontSize: '11px', color: '#6B7280', letterSpacing: '0.6px', textTransform: 'uppercase', fontWeight: '600' }}>
        {label}
      </p>
    </div>
  );
}

export default function AccountDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        const all: Order[] = data.orders || [];
        setOrders(all);
      } catch {}
      finally { setFetching(false); }
    })();
  }, [user]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: '120px', height: '20px', borderRadius: '6px' }} />
      </div>
    );
  }

  const myOrders = orders.filter((o) => !o.customer_email || o.customer_email === user.email);
  const totalSpent = myOrders.reduce((s, o) => s + o.total_amount, 0);
  const booksRead = myOrders
    .filter((o) => o.status === 'Delivered')
    .reduce((s, o) => s + o.order_items.reduce((a, i) => a + i.quantity, 0), 0);

  const recentOrders = myOrders.slice(0, 5);
  const firstName = user.name ? user.name.split(' ')[0] : 'Reader';

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', padding: '40px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <AccountSidebar />

        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Welcome header */}
          <div className="animate-fadeInUp" style={{ marginBottom: '28px' }}>
            <p style={{ color: '#C82333', fontSize: '12px', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>
              Your Account
            </p>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1C1C1C', lineHeight: '1.2', marginBottom: '4px', letterSpacing: '-0.02em' }}>
              Welcome back, {firstName}.
            </h1>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>
              Here&apos;s what&apos;s been happening with your orders.
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <StatCard value={String(myOrders.length)} label="Total Orders" delay="delay-100" icon="📦" />
            <StatCard value={`₹${totalSpent.toLocaleString('en-IN')}`} label="Amount Spent" delay="delay-200" icon="💳" />
            <StatCard value={String(booksRead)} label="Books Received" delay="delay-300" icon="📚" />
            <StatCard value="—" label="Wishlist Items" delay="delay-400" icon="🔖" />
          </div>

          {/* Recent orders */}
          <div
            className="animate-fadeInUp delay-300"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}
          >
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1C1C1C', letterSpacing: '-0.01em' }}>
                Recent Orders
              </h2>
              <Link href="/account/orders" style={{ fontSize: '13px', color: '#C82333', fontWeight: '600', textDecoration: 'none' }}>
                View all →
              </Link>
            </div>

            {fetching ? (
              <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton" style={{ height: '48px', borderRadius: '6px' }} />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>📖</div>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1C1C1C', marginBottom: '4px' }}>No orders yet</p>
                <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '18px' }}>
                  Your reading journey starts with the first book.
                </p>
                <Link
                  href="/shop"
                  style={{
                    display: 'inline-block',
                    padding: '10px 24px',
                    backgroundColor: '#C82333',
                    color: '#FFFFFF',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: '700',
                    textDecoration: 'none',
                  }}
                >
                  Browse Books
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8F9FA' }}>
                      {['Order', 'Date', 'Books', 'Total', 'Status'].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: '10px 20px',
                            textAlign: 'left',
                            color: '#6B7280',
                            fontWeight: '700',
                            fontSize: '11px',
                            letterSpacing: '0.7px',
                            textTransform: 'uppercase',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, idx) => {
                      const sc = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                      const bookCount = order.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
                      const date = new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                      return (
                        <tr
                          key={order.id}
                          style={{ borderTop: '1px solid #F3F4F6', cursor: 'pointer', transition: 'background-color 0.1s' }}
                          onClick={() => router.push(`/account/orders/${order.id}`)}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FFF5F5'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                        >
                          <td style={{ padding: '13px 20px', fontFamily: 'monospace', fontSize: '11px', color: '#6B7280' }}>
                            #{order.id.slice(0, 8).toUpperCase()}
                          </td>
                          <td style={{ padding: '13px 20px', color: '#374151' }}>{date}</td>
                          <td style={{ padding: '13px 20px', color: '#374151' }}>{bookCount} book{bookCount !== 1 ? 's' : ''}</td>
                          <td style={{ padding: '13px 20px', fontWeight: '700', color: '#1C1C1C' }}>₹{order.total_amount.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '13px 20px' }}>
                            <span style={{ backgroundColor: sc.bg, color: sc.text, padding: '3px 9px', borderRadius: '100px', fontSize: '11px', fontWeight: '700' }}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { href: '/account/profile', label: 'Edit Profile', desc: 'Update your name, phone, address', icon: '✏️' },
              { href: '/account/settings', label: 'Preferences', desc: 'Notifications & privacy settings', icon: '🔧' },
            ].map(({ href, label, desc, icon }, i) => (
              <Link
                key={href}
                href={href}
                className={`animate-fadeInUp hover-lift`}
                style={{
                  animationDelay: `${0.4 + i * 0.1}s`,
                  flex: '1',
                  minWidth: '200px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '18px 20px',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#C82333'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; }}
              >
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
                <p style={{ fontWeight: '700', color: '#1C1C1C', fontSize: '14px', marginBottom: '3px' }}>{label}</p>
                <p style={{ color: '#6B7280', fontSize: '12px' }}>{desc}</p>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
