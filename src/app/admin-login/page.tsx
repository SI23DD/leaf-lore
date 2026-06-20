'use client';
import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch(`${API_URL}/api/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });
    const data = await res.json();
    if (res.ok) {
      document.cookie = 'll_admin_key=' + key + '; path=/; max-age=86400';
      router.push('/admin');
    } else {
      setError(data.error || 'Invalid key');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center animate-fadeIn" style={{ backgroundColor: '#ffffff' }}>
      <div className="w-full max-w-sm animate-scaleIn">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 animate-float">🍃</div>
          <h1 style={{ fontFamily: 'var(--font-playfair), serif', color: '#C82333' }} className="text-2xl font-bold">Admin Access</h1>
          <p className="text-gray-500 text-sm mt-1">Shop owners only</p>
        </div>
        <div className="rounded-2xl p-8 shadow-sm" style={{ backgroundColor: 'white', border: '1px solid #e5e5e5' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Admin Secret Key</label>
              <input
                type="password"
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="Enter your admin key"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ border: '1.5px solid #e5e5e5', backgroundColor: '#ffffff' }}
                onFocus={e => e.target.style.borderColor = '#C82333'}
                onBlur={e => e.target.style.borderColor = '#e5e5e5'}
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#C82333', color: 'white' }}>
              {loading ? 'Verifying…' : 'Enter Admin Panel'}
            </button>
          </form>
          <p className="text-xs text-center text-gray-400 mt-4">Set ADMIN_SECRET_KEY in your .env.local file</p>
        </div>
      </div>
    </div>
  );
}
