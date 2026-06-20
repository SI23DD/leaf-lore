'use client';
import { useCart } from '@frontend/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';

const itemDelays = ['delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500', 'delay-600'];

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '' });
  const [showForm, setShowForm] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderDone, setOrderDone] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  function handleRemove(bookId: string) {
    // Mark item as removing (fade out), then actually remove after transition
    setRemovingIds(prev => new Set(prev).add(bookId));
    setTimeout(() => {
      removeFromCart(bookId);
      setRemovingIds(prev => {
        const next = new Set(prev);
        next.delete(bookId);
        return next;
      });
    }, 300);
  }

  if (orderDone) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-fadeIn" style={{ backgroundColor: '#ffffff' }}>
        <div className="text-center max-w-md">
          {/* Animated checkmark */}
          <div className="flex items-center justify-center mb-8">
            <div style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              backgroundColor: '#C82333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            }}>
              <svg
                viewBox="0 0 52 52"
                width="44"
                height="44"
                style={{ display: 'block' }}
              >
                <style>{`
                  @keyframes checkmark-draw {
                    from { stroke-dashoffset: 60; }
                    to { stroke-dashoffset: 0; }
                  }
                `}</style>
                <polyline
                  points="10,28 22,40 42,16"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="60"
                  strokeDashoffset="60"
                  style={{ animation: 'checkmark-draw 0.5s ease 0.35s forwards' }}
                />
              </svg>
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--font-playfair), serif', color: '#C82333', opacity: 0, animationFillMode: 'forwards' }} className="text-3xl font-bold mb-4 animate-fadeInUp delay-200">Order Placed!</h2>
          <p className="text-gray-500 mb-2 animate-fadeInUp delay-300" style={{ opacity: 0, animationFillMode: 'forwards' }}>Thank you for your order.</p>
          <p className="text-xs text-gray-400 mb-8 font-mono break-all animate-fadeInUp delay-400" style={{ opacity: 0, animationFillMode: 'forwards' }}>Order ID: {orderDone}</p>
          <Link href="/shop"
            className="inline-block px-8 py-3 rounded-full font-medium transition-all hover:scale-105 animate-fadeInUp delay-500"
            style={{ backgroundColor: '#C82333', color: 'white', opacity: 0, animationFillMode: 'forwards' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-fadeIn" style={{ backgroundColor: '#ffffff' }}>
        <div className="text-center">
          <div className="text-6xl mb-6">📚</div>
          <h2 style={{ fontFamily: 'var(--font-playfair), serif', color: '#C82333' }} className="text-3xl font-bold mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8">Looks like you haven&apos;t added any books yet.</p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: '#C82333', color: 'white' }}
          >
            Explore Books
          </Link>
        </div>
      </div>
    );
  }

  const shipping = totalPrice >= 500 ? 0 : 50;
  const total = totalPrice + shipping;

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.email) { setError('Please fill in your name and email.'); return; }
    setPlacing(true); setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: checkoutForm.name,
          customer_email: checkoutForm.email,
          items: items.map(i => ({ book_id: i.book.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to place order'); return; }
      setOrderDone(data.order.id);
      clearCart();
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div style={{ backgroundColor: '#ffffff' }} className="min-h-screen animate-fadeIn">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 style={{ fontFamily: 'var(--font-playfair), serif', color: '#C82333' }} className="text-4xl font-bold mb-2">
          Your Cart
        </h1>
        <p className="text-gray-500 mb-8">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ book, quantity }, idx) => {
              const isRemoving = removingIds.has(book.id);
              return (
                <div
                  key={book.id}
                  className={`rounded-2xl p-5 flex gap-5 items-center animate-fadeInUp ${itemDelays[Math.min(idx, itemDelays.length - 1)]}`}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    opacity: isRemoving ? 0 : 0,
                    transform: isRemoving ? 'translateX(32px)' : undefined,
                    transition: isRemoving ? 'opacity 0.3s ease, transform 0.3s ease' : undefined,
                    animationFillMode: 'forwards',
                  }}
                >
                  {/* Cover */}
                  <div
                    className="w-16 h-20 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    <span className="text-2xl">📚</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base leading-tight mb-1 truncate"
                      style={{ fontFamily: 'var(--font-playfair), serif', color: '#1a1a1a' }}>
                      {book.title}
                    </h3>
                    <p className="text-sm mb-1" style={{ color: '#666666' }}>{book.author}</p>
                    <p className="text-xs text-gray-400">{book.language} · {book.genre}</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(book.id, quantity - 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-150 hover:opacity-70 active:scale-90"
                      style={{ backgroundColor: '#f5f5f5', color: '#C82333' }}
                    >−</button>
                    <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(book.id, quantity + 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-150 hover:opacity-70 active:scale-90"
                      style={{ backgroundColor: '#C82333', color: 'white' }}
                    >+</button>
                  </div>

                  {/* Price + remove */}
                  <div className="text-right shrink-0">
                    <p className="font-bold transition-colors duration-200" style={{ color: '#C82333' }}>₹{book.price * quantity}</p>
                    <p className="text-xs text-gray-400">₹{book.price} each</p>
                    <button
                      onClick={() => handleRemove(book.id)}
                      className="text-xs mt-1 text-red-400 hover:text-red-600 transition-colors duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary — fadeInRight */}
          <div className="lg:col-span-1 animate-fadeInRight delay-200" style={{ opacity: 0, animationFillMode: 'forwards' }}>
            <div className="rounded-2xl p-6 sticky top-24" style={{ backgroundColor: 'white', border: '1px solid #e5e5e5' }}>
              <h2 style={{ fontFamily: 'var(--font-playfair), serif', color: '#C82333' }} className="text-xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium" style={{ color: shipping === 0 ? '#C82333' : '#1a1a1a' }}>
                    {shipping === 0 ? 'Free 🎉' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">Add ₹{500 - totalPrice} more for free shipping</p>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-base" style={{ borderColor: '#e5e5e5' }}>
                  <span>Total</span>
                  <span style={{ color: '#C82333' }}>₹{total}</span>
                </div>
              </div>

              {showForm ? (
                <form onSubmit={placeOrder} className="mb-3 space-y-2">
                  <input
                    required
                    value={checkoutForm.name}
                    onChange={e => setCheckoutForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200"
                    style={{ border: '1.5px solid #e5e5e5', backgroundColor: '#ffffff' }}
                    onFocus={e => { e.currentTarget.style.border = '1.5px solid #C82333'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,35,51,0.1)'; }}
                    onBlur={e => { e.currentTarget.style.border = '1.5px solid #e5e5e5'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                  <input
                    required
                    type="email"
                    value={checkoutForm.email}
                    onChange={e => setCheckoutForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="Email address"
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200"
                    style={{ border: '1.5px solid #e5e5e5', backgroundColor: '#ffffff' }}
                    onFocus={e => { e.currentTarget.style.border = '1.5px solid #C82333'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,35,51,0.1)'; }}
                    onBlur={e => { e.currentTarget.style.border = '1.5px solid #e5e5e5'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <button type="submit" disabled={placing}
                    className="w-full py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 active:scale-95"
                    style={{ backgroundColor: '#C82333', color: 'white' }}>
                    {placing ? 'Placing Order…' : 'Confirm Order'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">Cancel</button>
                </form>
              ) : (
                <button onClick={() => setShowForm(true)}
                  className="w-full py-3.5 rounded-full font-semibold text-base transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 mb-3"
                  style={{ backgroundColor: '#C82333', color: 'white' }}>
                  Proceed to Checkout
                </button>
              )}

              <Link href="/shop" className="block text-center text-sm hover:underline transition-opacity duration-200 hover:opacity-70" style={{ color: '#666666' }}>
                ← Continue Shopping
              </Link>

              <div className="mt-4 p-3 rounded-lg text-xs text-center" style={{ backgroundColor: '#f5f5f5', color: '#7A9E7E' }}>
                🔒 Secure checkout · Free returns · 7-day policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
