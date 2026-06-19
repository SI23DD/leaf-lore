'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AccountSidebar from '@/components/AccountSidebar';

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

const NORMALISED_STATUS_MAP: Record<string, string> = {
  Pending: 'Pending',
  Processing: 'Processing',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
};

const STEP_META: Record<string, { icon: string; description: string }> = {
  Pending:             { icon: '🛒', description: 'We received your order and are preparing it.' },
  Processing:          { icon: '📋', description: 'Your books are being picked and packed.' },
  Shipped:             { icon: '🚚', description: 'Your package is on its way.' },
  'Out for Delivery':  { icon: '🛵', description: 'Your delivery person is nearby.' },
  Delivered:           { icon: '🎉', description: 'Enjoy your books!' },
};

function getActiveStep(status: string): number {
  // Map DB statuses to timeline index
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
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) { setError('Order not found.'); return; }
        const data = await res.json();
        setOrder(data.order);
      } catch { setError('Failed to load order.'); }
      finally { setFetching(false); }
    })();
  }, [orderId, user]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: '120px', height: '20px', borderRadius: '8px' }} />
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
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '40px 24px' }}>
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
              gap: '6px',
              color: '#8B4513',
              fontSize: '13px',
              fontWeight: '600',
              textDecoration: 'none',
              marginBottom: '20px',
            }}
          >
            ← Back to Orders
          </Link>

          {fetching ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '16px' }} />
              ))}
            </div>
          ) : error || !order ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
              <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '20px', color: '#1a1a1a', marginBottom: '8px' }}>
                {error || 'Order not found'}
              </p>
              <Link href="/account/orders" style={{ color: '#2D5016', fontWeight: '600', textDecoration: 'none' }}>
                View all orders
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="animate-fadeInUp" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <h1
                    style={{
                      fontFamily: 'var(--font-playfair), serif',
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                    }}
                  >
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </h1>
                  {(() => {
                    const sc = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                    return (
                      <span style={{ backgroundColor: sc.bg, color: sc.text, padding: '4px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: '600' }}>
                        {order.status}
                      </span>
                    );
                  })()}
                </div>
                <p style={{ color: '#9A8E85', fontSize: '14px' }}>Placed on {date}</p>
              </div>

              {/* Tracking Timeline */}
              {!isCancelled && (
                <div
                  className="animate-fadeInUp delay-100"
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #E8E0D5',
                    borderRadius: '20px',
                    padding: '28px 32px',
                    marginBottom: '24px',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'var(--font-playfair), serif',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      marginBottom: '28px',
                    }}
                  >
                    Track Your Order
                  </h2>

                  <div style={{ position: 'relative', paddingLeft: '36px' }}>
                    {/* Vertical line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '13px',
                        top: '16px',
                        bottom: '16px',
                        width: '2px',
                        backgroundColor: '#E8E0D5',
                      }}
                    />
                    {/* Progress line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '13px',
                        top: '16px',
                        width: '2px',
                        height: `${Math.min(activeStep / (STATUSES.length - 1), 1) * 100}%`,
                        backgroundColor: '#2D5016',
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
                          className={`animate-fadeInLeft`}
                          style={{
                            animationDelay: `${0.15 + idx * 0.1}s`,
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'flex-start',
                            marginBottom: idx < STATUSES.length - 1 ? '28px' : '0',
                            position: 'relative',
                          }}
                        >
                          {/* Circle */}
                          <div
                            style={{
                              position: 'absolute',
                              left: '-36px',
                              top: '0',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: isDone ? '#2D5016' : 'white',
                              border: `2px solid ${isDone ? '#2D5016' : '#D4C9BE'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '13px',
                              flexShrink: 0,
                              boxShadow: isCurrent ? '0 0 0 4px rgba(45,80,22,0.15)' : 'none',
                              transition: 'all 0.3s ease',
                              zIndex: 1,
                            }}
                          >
                            {isDone ? '✓' : <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4C9BE', display: 'block' }} />}
                          </div>

                          {/* Content */}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                              <span style={{ fontSize: '16px' }}>{meta?.icon}</span>
                              <span
                                style={{
                                  fontWeight: isCurrent ? '700' : '500',
                                  color: isDone ? '#1a1a1a' : '#C4BAB0',
                                  fontSize: '14px',
                                }}
                              >
                                {step}
                              </span>
                              {isCurrent && (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    backgroundColor: '#EDF4E8',
                                    color: '#2D5016',
                                    padding: '2px 8px',
                                    borderRadius: '100px',
                                    fontWeight: '700',
                                    letterSpacing: '0.5px',
                                  }}
                                >
                                  CURRENT
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '13px', color: isDone ? '#9A8E85' : '#C4BAB0' }}>
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
                    backgroundColor: '#FFF5F5',
                    border: '1px solid #FECACA',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    marginBottom: '24px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>❌</span>
                  <div>
                    <p style={{ fontWeight: '600', color: '#991B1B', marginBottom: '2px' }}>Order Cancelled</p>
                    <p style={{ fontSize: '13px', color: '#C4BAB0' }}>This order has been cancelled. Contact us if you need help.</p>
                  </div>
                </div>
              )}

              {/* Order items */}
              <div
                className="animate-fadeInUp delay-200"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #E8E0D5',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  marginBottom: '24px',
                }}
              >
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E0D5' }}>
                  <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
                    Items in this Order
                  </h2>
                </div>

                <div style={{ padding: '8px 0' }}>
                  {order.order_items?.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'center',
                        padding: '14px 24px',
                        borderTop: idx === 0 ? 'none' : '1px solid #F0EBE3',
                      }}
                    >
                      {/* Cover swatch */}
                      <div
                        style={{
                          width: '44px',
                          height: '56px',
                          borderRadius: '6px',
                          backgroundColor: item.book?.cover_color || '#D4C9BE',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                        }}
                      >
                        📖
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily: 'var(--font-playfair), serif',
                            fontWeight: '600',
                            color: '#1a1a1a',
                            fontSize: '14px',
                            marginBottom: '2px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.book?.title || 'Unknown Book'}
                        </p>
                        {item.book?.author && (
                          <p style={{ fontSize: '12px', color: '#8B4513' }}>{item.book.author}</p>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontWeight: '600', color: '#2D5016', fontSize: '15px' }}>
                          ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                        </p>
                        <p style={{ fontSize: '12px', color: '#9A8E85' }}>
                          ₹{item.unit_price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total breakdown */}
                <div style={{ padding: '16px 24px', backgroundColor: '#FAF7F2', borderTop: '1px solid #E8E0D5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#9A8E85', marginBottom: '6px' }}>
                    <span>Subtotal</span>
                    <span>₹{(order.total_amount - shipping).toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#9A8E85', marginBottom: '10px' }}>
                    <span>Shipping</span>
                    <span style={{ color: shipping === 0 ? '#2D5016' : '#9A8E85' }}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '700',
                      fontSize: '16px',
                      color: '#1a1a1a',
                      paddingTop: '10px',
                      borderTop: '1px solid #E8E0D5',
                    }}
                  >
                    <span>Total</span>
                    <span style={{ color: '#2D5016', fontFamily: 'var(--font-playfair), serif' }}>
                      ₹{order.total_amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Need help */}
              <div
                className="animate-fadeInUp delay-300"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #E8E0D5',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '3px', fontSize: '15px' }}>
                    Need help with this order?
                  </p>
                  <p style={{ fontSize: '13px', color: '#9A8E85' }}>
                    Write to us and we&apos;ll sort it out within 24 hours.
                  </p>
                </div>
                <a
                  href="mailto:hello@leafandlore.in"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '100px',
                    border: '1.5px solid #2D5016',
                    color: '#2D5016',
                    fontSize: '13px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
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
