'use client';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@frontend/context/AuthContext';
import AccountSidebar from '@frontend/components/AccountSidebar';

interface Book {
  title: string;
  author: string;
  cover_color: string;
  price: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  book: Book;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  customer_name: string;
  customer_email: string;
  order_items: OrderItem[];
}

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const STEP_META: Record<string, { icon: string; description: string }> = {
  Pending:             { icon: '🛒', description: 'We received your order and are preparing it.' },
  Processing:          { icon: '📋', description: 'Your books are being picked and packed.' },
  Shipped:             { icon: '🚚', description: 'Your package is on its way.' },
  'Out for Delivery':  { icon: '🛵', description: 'Your delivery person is nearby.' },
  Delivered:           { icon: '🎉', description: 'Enjoy your books!' },
};

function getActiveStep(status: string): number {
  const map: Record<string, number> = {
    Pending: 0,
    Processing: 1,
    Shipped: 2,
    Delivered: 4,
    Cancelled: -1,
  };
  return map[status] ?? 0;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending:    { bg: '#FEF3C7', text: '#92400E' },
  Processing: { bg: '#DBEAFE', text: '#1E40AF' },
  Shipped:    { bg: '#E0E7FF', text: '#3730A3' },
  Delivered:  { bg: '#D1FAE5', text: '#065F46' },
  Cancelled:  { bg: '#FEE2E2', text: '#991B1B' },
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;
  const { user, loading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!orderId || !user) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/${orderId}`);
        if (!res.ok) { setError('Order not found.'); return; }
        const data = await res.json();
        setOrder(data.order);
      } catch { setError('Failed to load order.'); }
      finally { setFetching(false); }
    })();
  }, [orderId, user]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: '120px', height: '20px', borderRadius: '6px' }} />
      </div>
    );
  }

  const activeStep = order ? getActiveStep(order.status) : 0;
  const isCancelled = order?.status === 'Cancelled';

  const date = order
    ? new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

  const shipping = order && order.total_amount < 500 ? 50 : 0;

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', padding: '40px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <AccountSidebar />

        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Back link */}
          <Link
            href="/account/orders"
            className="animate-fadeInUp"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: '#C82333',
              fontSize: '13px',
              fontWeight: '600',
              textDecoration: 'none',
              marginBottom: '18px',
            }}
          >
            ← Back to Orders
          </Link>

          {fetching ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: '130px', borderRadius: '8px' }} />
              ))}
            </div>
          ) : error || !order ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔍</div>
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#1C1C1C', marginBottom: '6px' }}>
                {error || 'Order not found'}
              </p>
              <Link href="/account/orders" style={{ color: '#C82333', fontWeight: '600', textDecoration: 'none' }}>
                View all orders
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="animate-fadeInUp" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1C1C1C', letterSpacing: '-0.02em' }}>
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </h1>
                  {(() => {
                    const sc = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                    return (
                      <span style={{ backgroundColor: sc.bg, color: sc.text, padding: '3px 11px', borderRadius: '100px', fontSize: '12px', fontWeight: '700' }}>
                        {order.status}
                      </span>
                    );
                  })()}
                </div>
                <p style={{ color: '#6B7280', fontSize: '13px' }}>Placed on {date}</p>
              </div>

              {/* Tracking Timeline */}
              {!isCancelled && (
                <div
                  className="animate-fadeInUp delay-100"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '24px 28px',
                    marginBottom: '20px',
                  }}
                >
                  <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1C1C1C', marginBottom: '24px', letterSpacing: '-0.01em' }}>
                    Track Your Order
                  </h2>

                  <div style={{ position: 'relative', paddingLeft: '36px' }}>
                    {/* Gray track line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '14px',
                        bottom: '14px',
                        width: '2px',
                        backgroundColor: '#E5E7EB',
                      }}
                    />
                    {/* Red progress line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '14px',
                        width: '2px',
                        height: `${Math.min(activeStep / (STATUSES.length - 1), 1) * 100}%`,
                        backgroundColor: '#C82333',
                        transition: 'height 0.8s ease',
                      }}
                    />

                    {STATUSES.map((step, idx) => {
                      const isDone = idx <= activeStep;
                      const isCurrent = idx === activeStep;
                      const meta = STEP_META[step];

                      return (
                        <div
                          key={step}
                          className="animate-fadeInLeft"
                          style={{
                            animationDelay: `${0.12 + idx * 0.09}s`,
                            display: 'flex',
                            gap: '14px',
                            alignItems: 'flex-start',
                            marginBottom: idx < STATUSES.length - 1 ? '24px' : '0',
                            position: 'relative',
                          }}
                        >
                          {/* Circle */}
                          <div
                            style={{
                              position: 'absolute',
                              left: '-36px',
                              top: '0',
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              backgroundColor: isDone ? '#C82333' : '#FFFFFF',
                              border: `2px solid ${isDone ? '#C82333' : '#D1D5DB'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              color: '#FFFFFF',
                              fontWeight: '700',
                              flexShrink: 0,
                              boxShadow: isCurrent ? '0 0 0 4px rgba(200,35,51,0.15)' : 'none',
                              transition: 'all 0.25s ease',
                              zIndex: 1,
                            }}
                          >
                            {isDone ? '✓' : <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#D1D5DB', display: 'block' }} />}
                          </div>

                          {/* Content */}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '2px' }}>
                              <span style={{ fontSize: '14px' }}>{meta?.icon}</span>
                              <span style={{ fontWeight: isCurrent ? '700' : '500', color: isDone ? '#1C1C1C' : '#9CA3AF', fontSize: '13px' }}>
                                {step}
                              </span>
                              {isCurrent && (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    backgroundColor: '#FEE2E2',
                                    color: '#C82333',
                                    padding: '2px 7px',
                                    borderRadius: '100px',
                                    fontWeight: '700',
                                    letterSpacing: '0.4px',
                                  }}
                                >
                                  CURRENT
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '12px', color: isDone ? '#6B7280' : '#9CA3AF' }}>
                              {meta?.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {isCancelled && (
                <div
                  className="animate-fadeInUp delay-100"
                  style={{
                    backgroundColor: '#FFF0F0',
                    border: '1px solid #FECDD3',
                    borderRadius: '8px',
                    padding: '18px 22px',
                    marginBottom: '20px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>❌</span>
                  <div>
                    <p style={{ fontWeight: '700', color: '#C82333', marginBottom: '2px', fontSize: '14px' }}>Order Cancelled</p>
                    <p style={{ fontSize: '12px', color: '#6B7280' }}>This order has been cancelled. Contact us if you need help.</p>
                  </div>
                </div>
              )}

              {/* Order items */}
              <div
                className="animate-fadeInUp delay-200"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '20px',
                }}
              >
                <div style={{ padding: '16px 22px', borderBottom: '1px solid #E5E7EB' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1C1C1C', letterSpacing: '-0.01em' }}>
                    Items in this Order
                  </h2>
                </div>

                <div style={{ padding: '4px 0' }}>
                  {order.order_items?.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '14px',
                        alignItems: 'center',
                        padding: '13px 22px',
                        borderTop: idx === 0 ? 'none' : '1px solid #F3F4F6',
                      }}
                    >
                      {/* Cover swatch */}
                      <div
                        style={{
                          width: '40px',
                          height: '52px',
                          borderRadius: '4px',
                          backgroundColor: item.book?.cover_color || '#E5E7EB',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                        }}
                      >
                        📖
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontWeight: '600',
                            color: '#1C1C1C',
                            fontSize: '13px',
                            marginBottom: '2px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.book?.title || 'Unknown Book'}
                        </p>
                        {item.book?.author && (
                          <p style={{ fontSize: '12px', color: '#6B7280' }}>{item.book.author}</p>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontWeight: '700', color: '#1C1C1C', fontSize: '14px' }}>
                          ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                        </p>
                        <p style={{ fontSize: '11px', color: '#6B7280' }}>
                          ₹{item.unit_price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total breakdown */}
                <div style={{ padding: '14px 22px', backgroundColor: '#F8F9FA', borderTop: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280', marginBottom: '5px' }}>
                    <span>Subtotal</span>
                    <span>₹{(order.total_amount - shipping).toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280', marginBottom: '10px' }}>
                    <span>Shipping</span>
                    <span style={{ color: shipping === 0 ? '#28A745' : '#6B7280', fontWeight: shipping === 0 ? '600' : '400' }}>
                      {shipping === 0 ? 'Free' : `₹${shipping}`}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '700',
                      fontSize: '15px',
                      color: '#1C1C1C',
                      paddingTop: '10px',
                      borderTop: '1px solid #E5E7EB',
                    }}
                  >
                    <span>Total</span>
                    <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Need help */}
              <div
                className="animate-fadeInUp delay-300"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '18px 22px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '700', color: '#1C1C1C', marginBottom: '2px', fontSize: '14px' }}>
                    Need help with this order?
                  </p>
                  <p style={{ fontSize: '12px', color: '#6B7280' }}>
                    Write to us and we&apos;ll sort it out within 24 hours.
                  </p>
                </div>
                <a
                  href="mailto:hello@leafandlore.in"
                  style={{
                    padding: '9px 20px',
                    borderRadius: '100px',
                    border: '1.5px solid #C82333',
                    color: '#C82333',
                    fontSize: '13px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'background-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = '#C82333'; el.style.color = '#FFFFFF'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = 'transparent'; el.style.color = '#C82333'; }}
                >
                  Contact Support
                </a>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
