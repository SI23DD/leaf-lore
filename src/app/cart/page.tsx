'use client';
import { useCart } from '@frontend/context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
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
      const res = await fetch(`${API_URL}/api/orders`, {
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

              {/* WhatsApp Order Button */}
              <a
                href={`https://wa.me/918779477753?text=${encodeURIComponent(
                  `Hi! I want to order from Leaf & Lore 🍃\n\n` +
                  items.map(i => `📚 ${i.book.title} × ${i.quantity} = ₹${i.book.price * i.quantity}`).join('\n') +
                  `\n\nSubtotal: ₹${totalPrice}` +
                  (shipping > 0 ? `\nShipping: ₹${shipping}` : '\nShipping: FREE 🎉') +
                  `\n*Total: ₹${total}*\n\nPlease confirm my order and share delivery details.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105 hover:shadow-lg mb-3 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#25D366', color: 'white', textDecoration: 'none', display: 'flex' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.111.547 4.1 1.505 5.832L0 24l6.335-1.481A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.028-1.382l-.36-.214-3.733.873.928-3.64-.235-.374A9.793 9.793 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/></svg>
                Order via WhatsApp
              </a>

              {/* Call button */}
              <a href="tel:+918779477753"
                className="w-full py-2.5 rounded-xl font-medium text-sm mb-3 flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ backgroundColor: '#f5f5f5', color: '#1a1a1a', textDecoration: 'none', border: '1px solid #e0e0e0' }}>
                📞 Call to Order: +91 877 947 7753
              </a>

              <Link href="/shop" className="block text-center text-sm hover:underline transition-opacity duration-200 hover:opacity-70" style={{ color: '#666666' }}>
                ← Continue Shopping
              </Link>

              <div className="mt-4 p-3 rounded-lg text-xs text-center space-y-1" style={{ backgroundColor: '#f0fff4', color: '#276749', border: '1px solid #c6f6d5' }}>
                <div>📱 Click WhatsApp to send your order instantly</div>
                <div>💬 We&apos;ll confirm & share delivery details</div>
                <div>📦 Free delivery above ₹500</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
