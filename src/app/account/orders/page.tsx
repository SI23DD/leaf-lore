'use client';
import { useEffect, useState } from 'react';
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
  customer_email: string;
  order_items: OrderItem[];
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Pending:    { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  Processing: { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
  Shipped:    { bg: '#E0E7FF', text: '#3730A3', dot: '#6366F1' },
  Delivered:  { bg: '#D1FAE5', text: '#065F46', dot: '#28A745' },
  Cancelled:  { bg: '#FEE2E2', text: '#991B1B', dot: '#C82333' },
};

export default function OrdersPage() {
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
        const res = await fetch('/api/orders');
        const data = await res.json();
        const all: Order[] = data.orders || [];
        setOrders(all.filter((o) => o.customer_email === user.email));
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

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', padding: '40px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <AccountSidebar />

        <main style={{ flex: 1, minWidth: 0 }}>
          <div className="animate-fadeInUp" style={{ marginBottom: '24px' }}>
            <p style={{ color: '#C82333', fontSize: '12px', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>
              Your Account
            </p>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1C1C1C', letterSpacing: '-0.02em' }}>
              Order History
            </h1>
          </div>

          {fetching ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton" style={{ height: '110px', borderRadius: '8px' }} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div
              className="animate-scaleIn"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '64px 24px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '14px' }}>📭</div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1C1C1C', marginBottom: '6px' }}>
                No orders yet
              </h2>
              <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>
                Start shopping — your order history will appear here.
              </p>
              <Link
                href="/shop"
                style={{
                  display: 'inline-block',
                  padding: '11px 30px',
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.map((order, idx) => {
                const sc = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                const date = new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                });
                const bookCount = order.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
                const titles = order.order_items?.map((i) => i.book?.title).filter(Boolean) ?? [];

                return (
                  <div
                    key={order.id}
                    className="animate-fadeInUp"
                    style={{
                      animationDelay: `${idx * 0.06}s`,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      padding: '18px 22px',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                    onClick={() => router.push(`/account/orders/${order.id}`)}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = '#C82333';
                      el.style.boxShadow = '0 2px 12px rgba(200,35,51,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = '#E5E7EB';
                      el.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      {/* Left */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '2px 7px', borderRadius: '4px' }}>
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: sc.bg,
                              color: sc.text,
                              padding: '2px 9px',
                              borderRadius: '100px',
                              fontSize: '11px',
                              fontWeight: '700',
                            }}
                          >
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: sc.dot, display: 'inline-block' }} />
                            {order.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>{date}</p>
                        <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.45' }}>
                          {bookCount} book{bookCount !== 1 ? 's' : ''}
                          {titles.length > 0 && (
                            <span style={{ color: '#6B7280' }}>
                              {' '}— {titles.slice(0, 2).join(', ')}{titles.length > 2 ? ` +${titles.length - 2} more` : ''}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Right */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: '20px', fontWeight: '700', color: '#1C1C1C', marginBottom: '3px' }}>
                          ₹{order.total_amount.toLocaleString('en-IN')}
                        </p>
                        <p style={{ fontSize: '11px', color: '#C82333', fontWeight: '600' }}>
                          View details →
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
