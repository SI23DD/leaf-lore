'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const GHOST_TITLES = [
  'One Hundred Years',
  'of Solitude',
  'The Midnight',
  'Library',
  'Piranesi',
  'Normal People',
  'Pachinko',
  'The God of',
  'Small Things',
  'Beloved',
];

const LEAF_POSITIONS = [
  { top: '12%', left: '8%', size: 38, delay: '0s', duration: '6s', rotate: -15 },
  { top: '28%', left: '82%', size: 24, delay: '1.2s', duration: '7.5s', rotate: 20 },
  { top: '55%', left: '6%', size: 30, delay: '0.6s', duration: '5.5s', rotate: 8 },
  { top: '70%', left: '75%', size: 20, delay: '2s', duration: '8s', rotate: -25 },
  { top: '85%', left: '20%', size: 26, delay: '0.3s', duration: '6.5s', rotate: 12 },
  { top: '40%', left: '90%', size: 18, delay: '1.8s', duration: '7s', rotate: -8 },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
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
      const res = await fetch('/api/auth/login', {
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
        .ll-login-wrap {
          min-height: 100vh;
          display: flex;
          align-items: stretch;
          background-color: #FAF7F2;
          font-family: var(--font-lato), sans-serif;
        }
        .ll-panel-left {
          flex: 0 0 45%;
          background-color: #2D5016;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 3rem 3.5rem;
        }
        .ll-panel-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          background-color: #FAF7F2;
        }
        .ll-ghost-title {
          position: absolute;
          font-family: var(--font-playfair), serif;
          font-style: italic;
          font-weight: 700;
          color: rgba(143, 175, 106, 0.13);
          white-space: nowrap;
          letter-spacing: -0.02em;
          line-height: 1;
          user-select: none;
          pointer-events: none;
        }
        .ll-leaf {
          position: absolute;
          animation: float-gentle 6s ease-in-out infinite;
          opacity: 0.35;
        }
        .ll-submit-btn {
          width: 100%;
          padding: 0.9rem 1rem;
          border-radius: 10px;
          background-color: #2D5016;
          color: #FAF7F2;
          font-size: 0.95rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.15s, box-shadow 0.2s;
          margin-top: 0.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 14px rgba(45,80,22,0.25);
          letter-spacing: 0.02em;
        }
        .ll-submit-btn:hover:not(:disabled) {
          background-color: #3a6820;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(45,80,22,0.3);
        }
        .ll-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          box-shadow: none;
        }
        .ll-forgot-link:hover { border-color: #2D5016 !important; }
        .ll-register-link:hover { border-color: #2D5016 !important; }
        .ll-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(250,247,242,0.35);
          border-top-color: #FAF7F2;
          border-radius: 50%;
          display: inline-block;
          animation: spin-btn 0.7s linear infinite;
        }
        @keyframes spin-btn {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .ll-panel-left { display: none; }
          .ll-panel-right { padding: 2.5rem 1.5rem; }
          .ll-login-wrap { min-height: 100vh; }
        }
      `}</style>

      <div className="ll-login-wrap">
        {/* LEFT — Botanical manuscript panel */}
        <div className="ll-panel-left animate-fadeInLeft">
          {/* Ghost book-title typography as texture */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {GHOST_TITLES.map((title, i) => (
              <div
                key={i}
                className="ll-ghost-title"
                style={{
                  fontSize: `${2.4 + (i % 3) * 0.8}rem`,
                  top: `${i * 9.5 + 3}%`,
                  left: `${i % 2 === 0 ? -5 : 10}%`,
                  transform: `rotate(${i % 2 === 0 ? -2 : 1.5}deg)`,
                }}
              >
                {title}
              </div>
            ))}
          </div>

          {/* Floating leaves */}
          {mounted && LEAF_POSITIONS.map((leaf, i) => (
            <div
              key={i}
              aria-hidden="true"
              className="ll-leaf"
              style={{
                top: leaf.top,
                left: leaf.left,
                fontSize: `${leaf.size}px`,
                animationDelay: leaf.delay,
                animationDuration: leaf.duration,
                transform: `rotate(${leaf.rotate}deg)`,
              }}
            >
              🍃
            </div>
          ))}

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="animate-scaleIn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '2rem' }}>🍃</span>
              <span style={{ fontFamily: 'var(--font-playfair), serif', color: '#FAF7F2', fontSize: '1.3rem', fontWeight: 600, letterSpacing: '0.02em' }}>
                Leaf &amp; Lore
              </span>
            </div>

            <h2
              className="animate-fadeInUp delay-100"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                color: '#FAF7F2',
                fontSize: '2.6rem',
                fontWeight: 700,
                lineHeight: 1.2,
                margin: '0 0 1rem',
                maxWidth: '340px',
              }}
            >
              Your next favourite story awaits.
            </h2>

            <p
              className="animate-fadeInUp delay-200"
              style={{ color: 'rgba(250,247,242,0.65)', fontSize: '1rem', lineHeight: 1.65, maxWidth: '300px', margin: '0 0 3rem' }}
            >
              A hand-curated shelf of books worth losing yourself in.
            </p>

            <div
              className="animate-fadeInUp delay-300"
              style={{ borderTop: '1px solid rgba(250,247,242,0.15)', paddingTop: '1.5rem' }}
            >
              <p style={{ color: 'rgba(250,247,242,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.85rem' }}>
                Readers are loving
              </p>
              {[
                { title: 'Intermezzo', author: 'Sally Rooney' },
                { title: 'The Women', author: 'Kristin Hannah' },
                { title: 'James', author: 'Percival Everett' },
              ].map((book, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-playfair), serif', fontStyle: 'italic', color: '#8FAF6A', fontSize: '0.9rem' }}>
                    {book.title}
                  </span>
                  <span style={{ color: 'rgba(250,247,242,0.35)', fontSize: '0.78rem' }}>— {book.author}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Login form */}
        <div className="ll-panel-right animate-fadeInRight">
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '2.2rem', fontWeight: 700, color: '#1C1C1C', margin: '0 0 0.4rem', lineHeight: 1.15 }}>
                Welcome back.
              </h1>
              <p style={{ color: '#6B6457', fontSize: '0.9rem', margin: 0 }}>
                Sign in to your shelf
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {/* Email */}
                <div>
                  <label htmlFor="ll-email" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6B6457', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.45rem' }}>
                    Email
                  </label>
                  <input
                    id="ll-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    onFocus={() => setFocusField('email')}
                    onBlur={() => setFocusField(null)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '10px',
                      border: `1.5px solid ${focusField === 'email' ? '#2D5016' : '#E0D8CE'}`,
                      backgroundColor: focusField === 'email' ? '#fff' : '#F5F1EB',
                      fontSize: '0.95rem',
                      color: '#1C1C1C',
                      outline: 'none',
                      transition: 'border-color 0.2s, background-color 0.2s, box-shadow 0.2s',
                      boxShadow: focusField === 'email' ? '0 0 0 3px rgba(45,80,22,0.1)' : 'none',
                    }}
                  />
                </div>

                {/* Password */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                    <label htmlFor="ll-password" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B6457', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="ll-forgot-link"
                      style={{ fontSize: '0.78rem', color: '#2D5016', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    id="ll-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    onFocus={() => setFocusField('password')}
                    onBlur={() => setFocusField(null)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '10px',
                      border: `1.5px solid ${focusField === 'password' ? '#2D5016' : '#E0D8CE'}`,
                      backgroundColor: focusField === 'password' ? '#fff' : '#F5F1EB',
                      fontSize: '0.95rem',
                      color: '#1C1C1C',
                      outline: 'none',
                      transition: 'border-color 0.2s, background-color 0.2s, box-shadow 0.2s',
                      boxShadow: focusField === 'password' ? '0 0 0 3px rgba(45,80,22,0.1)' : 'none',
                    }}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="animate-slideDown"
                    role="alert"
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: '#FFF0F0',
                      border: '1px solid #FECDD3',
                      color: '#C0392B',
                      fontSize: '0.85rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading} className="ll-submit-btn">
                  {loading ? (
                    <>
                      <span className="ll-spinner" />
                      Signing in…
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.8rem 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E0D8CE' }} />
              <span style={{ color: '#A8A09A', fontSize: '0.8rem' }}>or</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E0D8CE' }} />
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#6B6457', margin: 0 }}>
              New to Leaf &amp; Lore?{' '}
              <Link
                href="/register"
                className="ll-register-link"
                style={{
                  color: '#2D5016',
                  fontWeight: 600,
                  textDecoration: 'none',
                  borderBottom: '1.5px solid rgba(45,80,22,0.3)',
                  paddingBottom: '1px',
                  transition: 'border-color 0.2s',
                }}
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
