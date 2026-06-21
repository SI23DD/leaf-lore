'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@frontend/context/AuthContext';
import AccountSidebar, { AccountMobileNav } from '@frontend/components/AccountSidebar';
import MobileDrawer from '@frontend/components/MobileDrawer';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const AVATAR_COLORS = ['#C82333', '#A71D2A', '#991B1B', '#7F1D1D', '#B91C1C', '#DC2626'];
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: '120px', height: '20px', borderRadius: '6px' }} />
      </div>
    );
  }

  const initials = getInitials(form.name || user.email);
  const bgColor = avatarColor(form.name || user.email);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .account-layout { flex-direction: column !important; padding: 16px !important; }
          .account-desktop-sidebar { display: none !important; }
          .account-mobile-nav { display: flex !important; }
          .save-btn { width: 100% !important; }
          .profile-header { flex-direction: column !important; align-items: flex-start !important; }
        }
        @media (min-width: 769px) {
          .account-mobile-nav { display: none !important; }
        }
      `}</style>

      <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', padding: '40px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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
              backgroundColor: toast.type === 'success' ? '#28A745' : '#C82333',
              color: '#FFFFFF',
              padding: '11px 22px',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: '700',
              boxShadow: '0 6px 24px rgba(0,0,0,0.14)',
              whiteSpace: 'nowrap',
            }}
          >
            {toast.type === 'success' ? '✓ ' : '✗ '}{toast.message}
          </div>
        )}

        <div className="account-layout" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

          <div className="account-desktop-sidebar">
            <AccountSidebar />
          </div>

          <MobileDrawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} title="My Account" width={280}>
            <AccountSidebar isMobile onClose={() => setSidebarOpen(false)} />
          </MobileDrawer>

          <main style={{ flex: 1, minWidth: 0 }}>
            <div className="account-mobile-nav">
              <AccountMobileNav onOpen={() => setSidebarOpen(true)} pageTitle="My Profile" />
            </div>

            <div className="animate-fadeInUp" style={{ marginBottom: '24px' }}>
              <p style={{ color: '#C82333', fontSize: '12px', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>
                Your Account
              </p>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1C1C1C', letterSpacing: '-0.02em' }}>
                My Profile
              </h1>
            </div>

            {/* Avatar section */}
            <div
              className="animate-fadeInUp delay-100 profile-header"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '24px 28px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: bgColor,
                  color: '#FFFFFF',
                  fontSize: '28px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  letterSpacing: '1px',
                }}
              >
                {initials}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '18px', fontWeight: '700', color: '#1C1C1C', marginBottom: '2px', letterSpacing: '-0.01em' }}>
                  {form.name || user.name}
                </p>
                <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '10px' }}>{user.email}</p>
                <button
                  style={{
                    padding: '6px 16px',
                    borderRadius: '100px',
                    border: '1.5px solid #E5E7EB',
                    backgroundColor: 'transparent',
                    color: '#9CA3AF',
                    fontSize: '12px',
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
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '24px 28px',
              }}
            >
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1C1C1C', marginBottom: '20px', letterSpacing: '-0.01em' }}>
                Personal Information
              </h2>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#374151', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '6px' }}
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
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1.5px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      fontSize: '14px',
                      color: '#1C1C1C',
                      outline: 'none',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#C82333'; e.target.style.boxShadow = '0 0 0 3px rgba(200,35,51,0.1)'; e.target.style.backgroundColor = '#FFFFFF'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#F9FAFB'; }}
                  />
                </div>

                {/* Email — readonly */}
                <div>
                  <label
                    htmlFor="email"
                    style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#374151', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '6px' }}
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
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1.5px solid #E5E7EB',
                      backgroundColor: '#F3F4F6',
                      fontSize: '14px',
                      color: '#9CA3AF',
                      outline: 'none',
                      cursor: 'not-allowed',
                      boxSizing: 'border-box',
                    }}
                  />
                  <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
                    Email cannot be changed after registration.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#374151', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '6px' }}
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
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1.5px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      fontSize: '14px',
                      color: '#1C1C1C',
                      outline: 'none',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#C82333'; e.target.style.boxShadow = '0 0 0 3px rgba(200,35,51,0.1)'; e.target.style.backgroundColor = '#FFFFFF'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#F9FAFB'; }}
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#374151', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '6px' }}
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
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1.5px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      fontSize: '14px',
                      color: '#1C1C1C',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#C82333'; e.target.style.boxShadow = '0 0 0 3px rgba(200,35,51,0.1)'; e.target.style.backgroundColor = '#FFFFFF'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#F9FAFB'; }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    disabled={saving}
                    className="save-btn"
                    style={{
                      padding: '11px 28px',
                      backgroundColor: saving ? '#E5E7EB' : '#C82333',
                      color: saving ? '#6B7280' : '#FFFFFF',
                      borderRadius: '100px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '700',
                      letterSpacing: '0.05em',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.15s',
                      textTransform: 'uppercase',
                    }}
                    onMouseEnter={(e) => { if (!saving) (e.currentTarget as HTMLElement).style.backgroundColor = '#A71D2A'; }}
                    onMouseLeave={(e) => { if (!saving) (e.currentTarget as HTMLElement).style.backgroundColor = '#C82333'; }}
                  >
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
