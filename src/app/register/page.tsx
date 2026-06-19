'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const FLOATING_BOOKS = [
  { top: '10%', left: '12%', emoji: '📖', size: 36, delay: '0s', duration: '7s', rotate: -10 },
  { top: '30%', left: '78%', emoji: '📚', size: 28, delay: '1s', duration: '6s', rotate: 15 },
  { top: '58%', left: '5%', emoji: '📕', size: 32, delay: '0.5s', duration: '8s', rotate: -5 },
  { top: '72%', left: '80%', emoji: '📗', size: 22, delay: '1.8s', duration: '5.5s', rotate: 20 },
  { top: '88%', left: '30%', emoji: '📘', size: 26, delay: '0.8s', duration: '7.5s', rotate: -12 },
  { top: '20%', left: '55%', emoji: '🍃', size: 20, delay: '2.2s', duration: '6.5s', rotate: 8 },
];

const GHOST_QUOTES = [
  '"Not all those who wander"',
  'are lost.',
  '"It was the best of times,"',
  'it was the worst',
  '"She is too fond of books,"',
  '"In the beginning"',
  '"Call me Ishmael."',
];

function getPasswordStrength(pwd: string): { label: string; color: string; width: string } {
  if (pwd.length === 0) return { label: '', color: 'transparent', width: '0%' };
  if (pwd.length < 6) return { label: 'Too short', color: '#E74C3C', width: '20%' };
  if (pwd.length < 8) return { label: 'Weak', color: '#E67E22', width: '35%' };
  if (pwd.length < 10 && !/[^a-zA-Z0-9]/.test(pwd)) return { label: 'Medium', color: '#F39C12', width: '55%' };
  if (pwd.length >= 10 && /[^a-zA-Z0-9]/.test(pwd) && /[0-9]/.test(pwd)) return { label: 'Strong', color: '#27AE60', width: '100%' };
  if (pwd.length >= 8) return { label: 'Medium', color: '#8FAF6A', width: '65%' };
  return { label: 'Weak', color: '#E67E22', width: '35%' };
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const strength = getPasswordStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!agreed) {
      setError('Please agree to the terms to continue.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setError('Something went wrong. Check your connection and try again.');
      setLoading(false);
    }
  }

  function inputStyle(field: string) {
    return {
      width: '100%',
      padding: '0.8rem 1rem',
      borderRadius: '10px',
      border: `1.5px solid ${focusField === field ? '#2D5016' : '#E0D8CE'}`,
      backgroundColor: focusField === field ? '#fff' : '#F5F1EB',
      fontSize: '0.95rem',
      color: '#1C1C1C',
      outline: 'none',
      transition: 'border-color 0.2s, background-color 0.2s, box-shadow 0.2s',
      boxShadow: focusField === field ? '0 0 0 3px rgba(45,80,22,0.1)' : 'none',
    };
  }

  return (
    <>
      <style>{`
        .ll-reg-wrap {
          min-height: 100vh;
          display: flex;
          align-items: stretch;
          background-color: #FAF7F2;
          font-family: var(--font-lato), sans-serif;
        }
        .ll-reg-panel-left {
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
        .ll-reg-panel-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          background-color: #FAF7F2;
          overflow-y: auto;
        }
        .ll-ghost-quote {
          position: absolute;
          font-family: var(--font-playfair), serif;
          font-style: italic;
          font-weight: 700;
          color: rgba(143, 175, 106, 0.12);
          white-space: nowrap;
          line-height: 1;
          user-select: none;
          pointer-events: none;
        }
        .ll-float-book {
          position: absolute;
          animation: float-gentle 6s ease-in-out infinite;
          opacity: 0.4;
        }
        .ll-reg-submit {
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
        .ll-reg-submit:hover:not(:disabled) {
          background-color: #3a6820;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(45,80,22,0.3);
        }
        .ll-reg-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          box-shadow: none;
        }
        .ll-reg-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(250,247,242,0.35);
          border-top-color: #FAF7F2;
          border-radius: 50%;
          display: inline-block;
          animation: spin-reg 0.7s linear infinite;
        }
        @keyframes spin-reg {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .ll-strength-bar {
          height: 3px;
          border-radius: 2px;
          transition: width 0.35s ease, background-color 0.35s ease;
        }
        .ll-checkbox-wrap {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          cursor: pointer;
        }
        .ll-checkbox-wrap input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border: 1.5px solid #E0D8CE;
          border-radius: 4px;
          background: #F5F1EB;
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 2px;
          position: relative;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .ll-checkbox-wrap input[type="checkbox"]:checked {
          background-color: #2D5016;
          border-color: #2D5016;
        }
        .ll-checkbox-wrap input[type="checkbox"]:checked::after {
          content: '';
          position: absolute;
          left: 4px;
          top: 1px;
          width: 6px;
          height: 10px;
          border: 2px solid #FAF7F2;
          border-top: none;
          border-left: none;
          transform: rotate(45deg);
        }
        .ll-success-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          animation: scaleIn 0.5s ease both;
        }
        @media (max-width: 768px) {
          .ll-reg-panel-left { display: none; }
          .ll-reg-panel-right { padding: 2.5rem 1.5rem; }
        }
      `}</style>

      <div className="ll-reg-wrap">
        {/* LEFT — Botanical panel with floating books */}
        <div className="ll-reg-panel-left animate-fadeInLeft">
          {/* Ghost literary quotes as texture */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {GHOST_QUOTES.map((quote, i) => (
              <div
                key={i}
                className="ll-ghost-quote"
                style={{
                  fontSize: `${1.8 + (i % 3) * 0.6}rem`,
                  top: `${i * 13 + 2}%`,
                  left: `${i % 2 === 0 ? -3 : 8}%`,
                  transform: `rotate(${i % 2 === 0 ? -1.5 : 2}deg)`,
                  letterSpacing: '-0.01em',
                }}
              >
                {quote}
              </div>
            ))}
          </div>

          {/* Floating books */}
          {mounted && FLOATING_BOOKS.map((item, i) => (
            <div
              key={i}
              aria-hidden="true"
              className="ll-float-book"
              style={{
                top: item.top,
                left: item.left,
                fontSize: `${item.size}px`,
                animationDelay: item.delay,
                animationDuration: item.duration,
                transform: `rotate(${item.rotate}deg)`,
              }}
            >
              {item.emoji}
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
                fontSize: '2.5rem',
                fontWeight: 700,
                lineHeight: 1.2,
                margin: '0 0 1rem',
                maxWidth: '340px',
              }}
            >
              Every great reader starts somewhere.
            </h2>

            <p
              className="animate-fadeInUp delay-200"
              style={{ color: 'rgba(250,247,242,0.65)', fontSize: '1rem', lineHeight: 1.65, maxWidth: '300px', margin: '0 0 3rem' }}
            >
              Build your wishlist, track your reads, and discover books chosen for you.
            </p>

            {/* Member benefits */}
            <div
              className="animate-fadeInUp delay-300"
              style={{ borderTop: '1px solid rgba(250,247,242,0.15)', paddingTop: '1.5rem' }}
            >
              <p style={{ color: 'rgba(250,247,242,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.85rem' }}>
                What you get
              </p>
              {[
                { icon: '📚', text: 'Personal reading wishlist' },
                { icon: '🍃', text: 'Curated recommendations' },
                { icon: '✉️', text: 'New arrivals in your inbox' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.65rem' }}>
                  <span style={{ fontSize: '1rem', opacity: 0.8 }}>{item.icon}</span>
                  <span style={{ color: 'rgba(250,247,242,0.7)', fontSize: '0.875rem' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Register form */}
        <div className="ll-reg-panel-right animate-fadeInRight">
          {success ? (
            <div className="ll-success-screen">
              <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem', animation: 'float-gentle 3s ease-in-out infinite' }}>🍃</div>
              <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.9rem', fontWeight: 700, color: '#2D5016', margin: '0 0 0.5rem' }}>
                Welcome to the shelf.
              </h2>
              <p style={{ color: '#6B6457', fontSize: '0.95rem', margin: '0 0 0.75rem' }}>
                Your account is ready. Taking you to sign in…
              </p>
              <div style={{ width: '48px', height: '3px', backgroundColor: '#8FAF6A', borderRadius: '2px' }} />
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: '420px' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '2.2rem', fontWeight: 700, color: '#1C1C1C', margin: '0 0 0.4rem', lineHeight: 1.15 }}>
                  Join Leaf &amp; Lore.
                </h1>
                <p style={{ color: '#6B6457', fontSize: '0.9rem', margin: 0 }}>
                  Create your account — it takes under a minute
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Name */}
                  <div>
                    <label htmlFor="ll-name" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6B6457', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.45rem' }}>
                      Full name
                    </label>
                    <input
                      id="ll-name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      autoComplete="name"
                      onFocus={() => setFocusField('name')}
                      onBlur={() => setFocusField(null)}
                      style={inputStyle('name')}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="ll-reg-email" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6B6457', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.45rem' }}>
                      Email
                    </label>
                    <input
                      id="ll-reg-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      onFocus={() => setFocusField('email')}
                      onBlur={() => setFocusField(null)}
                      style={inputStyle('email')}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="ll-reg-password" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6B6457', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.45rem' }}>
                      Password
                    </label>
                    <input
                      id="ll-reg-password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      autoComplete="new-password"
                      onFocus={() => setFocusField('password')}
                      onBlur={() => setFocusField(null)}
                      style={inputStyle('password')}
                    />
                    {/* Strength indicator */}
                    {password.length > 0 && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ height: '3px', backgroundColor: '#E0D8CE', borderRadius: '2px', overflow: 'hidden' }}>
                          <div
                            className="ll-strength-bar"
                            style={{ width: strength.width, backgroundColor: strength.color }}
                          />
                        </div>
                        <p style={{ fontSize: '0.72rem', color: strength.color, marginTop: '0.3rem', fontWeight: 500 }}>
                          {strength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="ll-confirm-password" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6B6457', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.45rem' }}>
                      Confirm password
                    </label>
                    <input
                      id="ll-confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Same as above"
                      required
                      autoComplete="new-password"
                      onFocus={() => setFocusField('confirm')}
                      onBlur={() => setFocusField(null)}
                      style={{
                        ...inputStyle('confirm'),
                        border: confirmPassword && confirmPassword !== password
                          ? '1.5px solid #E74C3C'
                          : `1.5px solid ${focusField === 'confirm' ? '#2D5016' : '#E0D8CE'}`,
                      }}
                    />
                    {confirmPassword && confirmPassword !== password && (
                      <p style={{ fontSize: '0.72rem', color: '#E74C3C', marginTop: '0.3rem' }}>
                        Passwords do not match
                      </p>
                    )}
                  </div>

                  {/* Terms */}
                  <label className="ll-checkbox-wrap">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={e => setAgreed(e.target.checked)}
                      required
                    />
                    <span style={{ fontSize: '0.85rem', color: '#6B6457', lineHeight: 1.5 }}>
                      I agree to the{' '}
                      <Link href="/terms" style={{ color: '#2D5016', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(45,80,22,0.3)' }}>
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" style={{ color: '#2D5016', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(45,80,22,0.3)' }}>
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

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
                  <button type="submit" disabled={loading} className="ll-reg-submit">
                    {loading ? (
                      <>
                        <span className="ll-reg-spinner" />
                        Creating your account…
                      </>
                    ) : (
                      'Create account'
                    )}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.6rem 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E0D8CE' }} />
                <span style={{ color: '#A8A09A', fontSize: '0.8rem' }}>or</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E0D8CE' }} />
              </div>

              <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#6B6457', margin: 0 }}>
                Already have an account?{' '}
                <Link
                  href="/login"
                  style={{
                    color: '#2D5016',
                    fontWeight: 600,
                    textDecoration: 'none',
                    borderBottom: '1.5px solid rgba(45,80,22,0.3)',
                    paddingBottom: '1px',
                  }}
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
