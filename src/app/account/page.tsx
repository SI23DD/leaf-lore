'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AccountSidebar from '@/components/AccountSidebar';

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
        backgroundColor: 'white',
        border: '1px solid #E8E0D5',
        borderRadius: '16px',
        padding: '20px 24px',
        flex: '1',
        minWidth: '120px',
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <p
        style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: '28px',
          fontWeight: '700',
          color: '#2D5016',
          lineHeight: '1',
          marginBottom: '4px',
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: '12px', color: '#9A8E85', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
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
        const res = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        const all: Order[] = data.orders || [];
        setOrders(all);
      } catch {}
      finally { setFetching(false); }
    })();
  }, [user]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: '120px', height: '20px', borderRadius: '8px' }} />
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
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <AccountSidebar />

        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Welcome header */}
          <div className="animate-fadeInUp" style={{ marginBottom: '32px' }}>
            <p style={{ color: '#8B4513', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '600' }}>
              Your Reading World
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: '36px',
                fontWeight: '700',
                color: '#1a1a1a',
                lineHeight: '1.2',
                marginBottom: '6px',
              }}
            >
              Welcome back, {firstName}.
            </h1>
            <p style={{ color: '#9A8E85', fontSize: '15px' }}>
              Here&apos;s what&apos;s been happening with your orders.
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '36px', flexWrap: 'wrap' }}>
            <StatCard value={String(myOrders.length)} label="Total Orders" delay="delay-100" icon="📦" />
            <StatCard value={`₹${totalSpent.toLocaleString('en-IN')}`} label="Amount Spent" delay="delay-200" icon="💳" />
            <StatCard value={String(booksRead)} label="Books Received" delay="delay-300" icon="📚" />
            <StatCard value="—" label="Wishlist Items" delay="delay-400" icon="🔖" />
          </div>

          {/* Recent orders */}
          <div
            className="animate-fadeInUp delay-300"
            style={{
              backgroundColor: 'white',
              border: '1px solid #E8E0D5',
              borderRadius: '20px',
              overflow: 'hidden',
              marginBottom: '24px',
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E0D5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
                Recent Orders
              </h2>
              <Link href="/account/orders" style={{ fontSize: '13px', color: '#2D5016', fontWeight: '600', textDecoration: 'none' }}>
                View all →
              </Link>
            </div>

            {fetching ? (
              <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton" style={{ height: '52px', borderRadius: '10px' }} />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📖</div>
                <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '18px', color: '#1a1a1a', marginBottom: '6px' }}>
                  No orders yet
                </p>
                <p style={{ color: '#9A8E85', fontSize: '14px', marginBottom: '20px' }}>
                  Your reading journey starts with the first book.
                </p>
                <Link
                  href="/shop"
                  style={{
                    display: 'inline-block',
                    padding: '10px 24px',
                    backgroundColor: '#2D5016',
                    color: 'white',
                    borderRadius: '100px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textDecoration: 'none',
                  }}
                >
                  Browse Books
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2' }}>
                      {['Order', 'Date', 'Books', 'Total', 'Status'].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: '12px 24px',
                            textAlign: 'left',
                            color: '#9A8E85',
                            fontWeight: '600',
                            fontSize: '12px',
                            letterSpacing: '0.8px',
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
                          style={{ borderTop: idx === 0 ? 'none' : '1px solid #F0EBE3', cursor: 'pointer', transition: 'background-color 0.15s' }}
                          onClick={() => router.push(`/account/orders/${order.id}`)}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FAF7F2'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                        >
                          <td style={{ padding: '14px 24px', fontFamily: 'monospace', fontSize: '12px', color: '#9A8E85' }}>
                            #{order.id.slice(0, 8).toUpperCase()}
                          </td>
                          <td style={{ padding: '14px 24px', color: '#5A5048' }}>{date}</td>
                          <td style={{ padding: '14px 24px', color: '#5A5048' }}>{bookCount} book{bookCount !== 1 ? 's' : ''}</td>
                          <td style={{ padding: '14px 24px', fontWeight: '600', color: '#2D5016' }}>₹{order.total_amount.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '14px 24px' }}>
                            <span style={{ backgroundColor: sc.bg, color: sc.text, padding: '3px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: '600' }}>
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
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
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
                  backgroundColor: 'white',
                  border: '1px solid #E8E0D5',
                  borderRadius: '16px',
                  padding: '20px',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                <div style={{ fontSize: '22px', marginBottom: '8px' }}>{icon}</div>
                <p style={{ fontWeight: '600', color: '#1a1a1a', fontSize: '15px', marginBottom: '3px' }}>{label}</p>
                <p style={{ color: '#9A8E85', fontSize: '13px' }}>{desc}</p>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
