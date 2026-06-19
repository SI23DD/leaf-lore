'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AccountSidebar from '@/components/AccountSidebar';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const AVATAR_COLORS = ['#2D5016', '#8B4513', '#4A7C59', '#7B5B3A', '#3D6B2C', '#9B6B3A'];
function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

interface Toast { message: string; type: 'success' | 'error' }

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [toast, setToast] = useState<Toast | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem('ll_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setForm({
          name: parsed.name || '',
          phone: parsed.phone || '',
          address: parsed.address || '',
        });
      } catch {}
    }
  }, [user]);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setTimeout(() => {
      try {
        const stored = localStorage.getItem('ll_user');
        const current = stored ? JSON.parse(stored) : {};
        const updated = { ...current, name: form.name, phone: form.phone, address: form.address };
        localStorage.setItem('ll_user', JSON.stringify(updated));
        showToast('Profile saved successfully.');
      } catch {
        showToast('Failed to save profile.', 'error');
      } finally {
        setSaving(false);
      }
    }, 600);
  }

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: '120px', height: '20px', borderRadius: '8px' }} />
      </div>
    );
  }

  const initials = getInitials(form.name || user.email);
  const bgColor = avatarColor(form.name || user.email);

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '40px 24px' }}>
      {/* Toast */}
      {toast && (
        <div
          className="animate-slideDown"
          style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            backgroundColor: toast.type === 'success' ? '#2D5016' : '#991B1B',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '100px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap',
          }}
        >
          {toast.type === 'success' ? '✓ ' : '✗ '}{toast.message}
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <AccountSidebar />

        <main style={{ flex: 1, minWidth: 0 }}>
          <div className="animate-fadeInUp" style={{ marginBottom: '28px' }}>
            <p style={{ color: '#8B4513', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '600' }}>
              Your Identity
            </p>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '32px', fontWeight: '700', color: '#1a1a1a' }}>
              My Profile
            </h1>
          </div>

          {/* Avatar section */}
          <div
            className="animate-fadeInUp delay-100"
            style={{
              backgroundColor: 'white',
              border: '1px solid #E8E0D5',
              borderRadius: '20px',
              padding: '28px 32px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  backgroundColor: bgColor,
                  color: 'white',
                  fontFamily: 'var(--font-playfair), serif',
                  fontSize: '32px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 24px rgba(45,80,22,0.25)',
                  letterSpacing: '1px',
                }}
              >
                {initials}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '3px',
                }}
              >
                {form.name || user.name}
              </p>
              <p style={{ color: '#9A8E85', fontSize: '14px', marginBottom: '12px' }}>{user.email}</p>
              <button
                style={{
                  padding: '7px 18px',
                  borderRadius: '100px',
                  border: '1.5px solid #E8E0D5',
                  backgroundColor: 'transparent',
                  color: '#9A8E85',
                  fontSize: '13px',
                  cursor: 'not-allowed',
                  opacity: 0.6,
                }}
                disabled
                title="Photo upload coming soon"
              >
                Change Photo — coming soon
              </button>
            </div>
          </div>

          {/* Edit form */}
          <div
            className="animate-fadeInUp delay-200"
            style={{
              backgroundColor: 'white',
              border: '1px solid #E8E0D5',
              borderRadius: '20px',
              padding: '28px 32px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '24px',
              }}
            >
              Personal Information
            </h2>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#5A5048', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px' }}
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #E8E0D5',
                    backgroundColor: '#FAF7F2',
                    fontSize: '14px',
                    color: '#1a1a1a',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#2D5016'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8E0D5'; }}
                />
              </div>

              {/* Email — readonly */}
              <div>
                <label
                  htmlFor="email"
                  style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#5A5048', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px' }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #E8E0D5',
                    backgroundColor: '#F5F0EB',
                    fontSize: '14px',
                    color: '#9A8E85',
                    outline: 'none',
                    cursor: 'not-allowed',
                  }}
                />
                <p style={{ fontSize: '12px', color: '#B0A89E', marginTop: '5px' }}>
                  Email cannot be changed after registration.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#5A5048', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px' }}
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #E8E0D5',
                    backgroundColor: '#FAF7F2',
                    fontSize: '14px',
                    color: '#1a1a1a',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#2D5016'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8E0D5'; }}
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#5A5048', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px' }}
                >
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Street, City, State, PIN"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #E8E0D5',
                    backgroundColor: '#FAF7F2',
                    fontSize: '14px',
                    color: '#1a1a1a',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'var(--font-lato), sans-serif',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#2D5016'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8E0D5'; }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '12px 32px',
                    backgroundColor: saving ? '#7A9E7E' : '#2D5016',
                    color: 'white',
                    borderRadius: '100px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s, transform 0.15s',
                  }}
                  onMouseEnter={(e) => { if (!saving) (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
