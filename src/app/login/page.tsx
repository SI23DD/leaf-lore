'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ll_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u?.id) router.replace('/account');
      } catch {}
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }
      const user = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || email.split('@')[0],
        role: data.user.role || 'customer',
      };
      localStorage.setItem('ll_user', JSON.stringify(user));
      localStorage.setItem('ll_token', data.access_token || '');
      router.push('/account');
    } catch {
      setError('Something went wrong. Check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .ll-login-page {
          min-height: 100vh;
          background-color: #F8F9FA;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.25rem;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .ll-login-card {
          width: 100%;
          max-width: 400px;
          background: #FFFFFF;
          border-radius: 10px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          border-top: 4px solid #C82333;
          padding: 2.5rem 2rem;
        }
        .ll-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.75rem;
          text-decoration: none;
        }
        .ll-logo-icon {
          font-size: 1.4rem;
          line-height: 1;
        }
        .ll-logo-text {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1C1C1C;
          letter-spacing: -0.01em;
        }
        .ll-heading {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1C1C1C;
          margin: 0 0 0.25rem;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .ll-subheading {
          font-size: 0.875rem;
          color: #6B7280;
          margin: 0 0 1.75rem;
        }
        .ll-field-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.4rem;
        }
        .ll-input {
          width: 100%;
          padding: 0.75rem 0.875rem;
          border-radius: 6px;
          border: 1.5px solid #E5E7EB;
          background-color: #F9FAFB;
          font-size: 0.9rem;
          color: #1C1C1C;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background-color 0.15s;
          box-sizing: border-box;
        }
        .ll-input:focus {
          border-color: #C82333;
          background-color: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(200,35,51,0.1);
        }
        .ll-pw-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.4rem;
        }
        .ll-forgot {
          font-size: 0.78rem;
          color: #C82333;
          text-decoration: none;
          font-weight: 500;
        }
        .ll-forgot:hover { text-decoration: underline; }
        .ll-error {
          padding: 0.7rem 0.875rem;
          border-radius: 6px;
          background-color: #FFF0F0;
          border: 1px solid #FECDD3;
          color: #C82333;
          font-size: 0.84rem;
          line-height: 1.45;
        }
        .ll-btn-primary {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 6px;
          background-color: #C82333;
          color: #FFFFFF;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: background-color 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .ll-btn-primary:hover:not(:disabled) { background-color: #A71D2A; }
        .ll-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }
        .ll-btn-outline {
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: 6px;
          background-color: transparent;
          color: #C82333;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border: 1.5px solid #C82333;
          cursor: pointer;
          transition: background-color 0.15s, color 0.15s;
          text-align: center;
          text-decoration: none;
          display: block;
        }
        .ll-btn-outline:hover { background-color: #C82333; color: #FFFFFF; }
        .ll-divider {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          margin: 1.5rem 0;
        }
        .ll-divider-line {
          flex: 1;
          height: 1px;
          background-color: #E5E7EB;
        }
        .ll-divider-text {
          font-size: 0.78rem;
          color: #9CA3AF;
          font-weight: 500;
        }
        .ll-spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          display: inline-block;
          animation: ll-spin 0.65s linear infinite;
        }
        @keyframes ll-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .ll-form-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      `}</style>

      <div className="ll-login-page">
        <div className="ll-login-card">
          {/* Logo */}
          <Link href="/" className="ll-logo">
            <span className="ll-logo-icon">🍃</span>
            <span className="ll-logo-text">Leaf &amp; Lore</span>
          </Link>

          <h1 className="ll-heading">Login</h1>
          <p className="ll-subheading">Sign in to your account</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="ll-form-stack">
              {/* Email */}
              <div>
                <label htmlFor="ll-email" className="ll-field-label">Email</label>
                <input
                  id="ll-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="ll-input"
                />
              </div>

              {/* Password */}
              <div>
                <div className="ll-pw-row">
                  <label htmlFor="ll-password" className="ll-field-label" style={{ margin: 0 }}>Password</label>
                  <span className="ll-forgot" style={{cursor:'default', opacity:0.5}}>Forgot password?</span>
                </div>
                <input
                  id="ll-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="ll-input"
                />
              </div>

              {/* Error */}
              {error && (
                <div role="alert" className="ll-error">{error}</div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading} className="ll-btn-primary" style={{ marginTop: '0.25rem' }}>
                {loading ? <><span className="ll-spinner" /> Signing in…</> : 'LOGIN'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="ll-divider">
            <div className="ll-divider-line" />
            <span className="ll-divider-text">OR</span>
            <div className="ll-divider-line" />
          </div>

          <Link href="/register" className="ll-btn-outline">Create Account</Link>
        </div>
      </div>
    </>
  );
}
