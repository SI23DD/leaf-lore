'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function getPasswordStrength(pwd: string): { label: string; color: string; width: string } {
  if (pwd.length === 0) return { label: '', color: 'transparent', width: '0%' };
  if (pwd.length < 6) return { label: 'Too short', color: '#C82333', width: '20%' };
  if (pwd.length < 8) return { label: 'Weak', color: '#E67E22', width: '35%' };
  if (pwd.length < 10 && !/[^a-zA-Z0-9]/.test(pwd)) return { label: 'Medium', color: '#F59E0B', width: '55%' };
  if (pwd.length >= 10 && /[^a-zA-Z0-9]/.test(pwd) && /[0-9]/.test(pwd)) return { label: 'Strong', color: '#28A745', width: '100%' };
  if (pwd.length >= 8) return { label: 'Medium', color: '#F59E0B', width: '65%' };
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

  return (
    <>
      <style>{`
        .ll-reg-page {
          min-height: 100vh;
          background-color: #F8F9FA;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.25rem;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .ll-reg-card {
          width: 100%;
          max-width: 420px;
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
        .ll-input-error {
          border-color: #C82333 !important;
        }
        .ll-error-msg {
          font-size: 0.72rem;
          color: #C82333;
          margin-top: 0.3rem;
          font-weight: 500;
        }
        .ll-strength-track {
          height: 3px;
          background-color: #E5E7EB;
          border-radius: 2px;
          overflow: hidden;
          margin-top: 0.5rem;
        }
        .ll-strength-bar {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease, background-color 0.3s ease;
        }
        .ll-error-box {
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
          margin-top: 0.25rem;
        }
        .ll-btn-primary:hover:not(:disabled) { background-color: #A71D2A; }
        .ll-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }
        .ll-checkbox-row {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          cursor: pointer;
        }
        .ll-checkbox-row input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          width: 17px;
          height: 17px;
          border: 1.5px solid #D1D5DB;
          border-radius: 4px;
          background: #F9FAFB;
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 2px;
          position: relative;
          transition: border-color 0.15s, background-color 0.15s;
        }
        .ll-checkbox-row input[type="checkbox"]:checked {
          background-color: #C82333;
          border-color: #C82333;
        }
        .ll-checkbox-row input[type="checkbox"]:checked::after {
          content: '';
          position: absolute;
          left: 4px;
          top: 1px;
          width: 5px;
          height: 9px;
          border: 2px solid #FFFFFF;
          border-top: none;
          border-left: none;
          transform: rotate(45deg);
        }
        .ll-terms-link {
          color: #C82333;
          font-weight: 600;
          text-decoration: none;
        }
        .ll-terms-link:hover { text-decoration: underline; }
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
        .ll-success-screen {
          text-align: center;
          padding: 1.5rem 0;
        }
        .ll-already {
          text-align: center;
          font-size: 0.875rem;
          color: #6B7280;
          margin-top: 1.5rem;
        }
        .ll-already a {
          color: #C82333;
          font-weight: 600;
          text-decoration: none;
        }
        .ll-already a:hover { text-decoration: underline; }
      `}</style>

      <div className="ll-reg-page">
        <div className="ll-reg-card">
          <Link href="/" className="ll-logo">
            <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>🍃</span>
            <span className="ll-logo-text">Leaf &amp; Lore</span>
          </Link>

          {success ? (
            <div className="ll-success-screen">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#28A745', marginBottom: '0.5rem' }}>
                Account created!
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Taking you to sign in…
              </p>
            </div>
          ) : (
            <>
              <h1 className="ll-heading">Create Account</h1>
              <p className="ll-subheading">It takes under a minute</p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="ll-form-stack">
                  {/* Name */}
                  <div>
                    <label htmlFor="ll-name" className="ll-field-label">Full Name</label>
                    <input
                      id="ll-name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      autoComplete="name"
                      className="ll-input"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="ll-reg-email" className="ll-field-label">Email</label>
                    <input
                      id="ll-reg-email"
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
                    <label htmlFor="ll-reg-password" className="ll-field-label">Password</label>
                    <input
                      id="ll-reg-password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      autoComplete="new-password"
                      className="ll-input"
                    />
                    {password.length > 0 && (
                      <div>
                        <div className="ll-strength-track">
                          <div
                            className="ll-strength-bar"
                            style={{ width: strength.width, backgroundColor: strength.color }}
                          />
                        </div>
                        <p className="ll-error-msg" style={{ color: strength.color }}>{strength.label}</p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="ll-confirm-password" className="ll-field-label">Confirm Password</label>
                    <input
                      id="ll-confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Same as above"
                      required
                      autoComplete="new-password"
                      className={`ll-input${confirmPassword && confirmPassword !== password ? ' ll-input-error' : ''}`}
                    />
                    {confirmPassword && confirmPassword !== password && (
                      <p className="ll-error-msg">Passwords do not match</p>
                    )}
                  </div>

                  {/* Terms */}
                  <label className="ll-checkbox-row">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={e => setAgreed(e.target.checked)}
                      required
                    />
                    <span style={{ fontSize: '0.84rem', color: '#6B7280', lineHeight: 1.5 }}>
                      I agree to the{' '}
                      <Link href="/terms" className="ll-terms-link">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="ll-terms-link">Privacy Policy</Link>
                    </span>
                  </label>

                  {/* Error */}
                  {error && (
                    <div role="alert" className="ll-error-box">{error}</div>
                  )}

                  {/* Submit */}
                  <button type="submit" disabled={loading} className="ll-btn-primary">
                    {loading ? <><span className="ll-spinner" /> Creating account…</> : 'REGISTER'}
                  </button>
                </div>
              </form>

              <p className="ll-already">
                Already have an account? <Link href="/login">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
