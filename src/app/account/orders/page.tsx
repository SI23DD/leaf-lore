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
  customer_email: string;
  order_items: OrderItem[];
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Pending:    { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  Processing: { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
  Shipped:    { bg: '#E0E7FF', text: '#3730A3', dot: '#6366F1' },
  Delivered:  { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  Cancelled:  { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
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
      <div style={{ minHeight: '100vh', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: '120px', height: '20px', borderRadius: '8px' }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <AccountSidebar />

        <main style={{ flex: 1, minWidth: 0 }}>
          <div className="animate-fadeInUp" style={{ marginBottom: '28px' }}>
            <p style={{ color: '#8B4513', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '600' }}>
              Your Library
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: '32px',
                fontWeight: '700',
                color: '#1a1a1a',
              }}
            >
              Order History
            </h1>
          </div>

          {fetching ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '16px' }} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div
              className="animate-scaleIn"
              style={{
                backgroundColor: 'white',
                border: '1px solid #E8E0D5',
                borderRadius: '20px',
                padding: '72px 24px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>📭</div>
              <h2
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  fontSize: '22px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '8px',
                }}
              >
                No orders yet
              </h2>
              <p style={{ color: '#9A8E85', fontSize: '14px', marginBottom: '28px' }}>
                Start shopping! Your order history will appear here.
              </p>
              <Link
                href="/shop"
                style={{
                  display: 'inline-block',
                  padding: '12px 32px',
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    className={`animate-fadeInUp hover-lift`}
                    style={{
                      animationDelay: `${idx * 0.07}s`,
                      backgroundColor: 'white',
                      border: '1px solid #E8E0D5',
                      borderRadius: '16px',
                      padding: '20px 24px',
                      cursor: 'pointer',
                    }}
                    onClick={() => router.push(`/account/orders/${order.id}`)}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      {/* Left */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '12px',
                              color: '#9A8E85',
                              backgroundColor: '#F5F0EB',
                              padding: '2px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              backgroundColor: sc.bg,
                              color: sc.text,
                              padding: '3px 10px',
                              borderRadius: '100px',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: sc.dot, display: 'inline-block' }} />
                            {order.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#9A8E85', marginBottom: '8px' }}>{date}</p>
                        <p style={{ fontSize: '14px', color: '#5A5048', lineHeight: '1.5' }}>
                          {bookCount} book{bookCount !== 1 ? 's' : ''}
                          {titles.length > 0 && (
                            <span style={{ color: '#9A8E85' }}>
                              {' '}— {titles.slice(0, 2).join(', ')}{titles.length > 2 ? ` +${titles.length - 2} more` : ''}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Right */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p
                          style={{
                            fontFamily: 'var(--font-playfair), serif',
                            fontSize: '22px',
                            fontWeight: '700',
                            color: '#2D5016',
                            marginBottom: '4px',
                          }}
                        >
                          ₹{order.total_amount.toLocaleString('en-IN')}
                        </p>
                        <p style={{ fontSize: '12px', color: '#9A8E85' }}>
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
