'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AccountSidebar from '@/components/AccountSidebar';

const PREFS_KEY = 'll_prefs';

interface Prefs {
  emailNotifications: boolean;
  orderUpdates: boolean;
  newsletters: boolean;
  language: string;
  lightMode: boolean;
}

const DEFAULTS: Prefs = {
  emailNotifications: true,
  orderUpdates: true,
  newsletters: false,
  language: 'English',
  lightMode: true,
};

interface Toast { message: string; type: 'success' | 'error' }

function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '14px 0' }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: '500', color: '#1a1a1a', fontSize: '14px', marginBottom: desc ? '2px' : '0' }}>{label}</p>
        {desc && <p style={{ fontSize: '12px', color: '#9A8E85' }}>{desc}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: checked ? '#2D5016' : '#D4C9BE',
          position: 'relative',
          flexShrink: 0,
          transition: 'background-color 0.25s ease',
          padding: '0',
        }}
      >
        <span
          style={{
            display: 'block',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: 'white',
            position: 'absolute',
            top: '3px',
            left: checked ? '23px' : '3px',
            transition: 'left 0.25s ease',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
        />
      </button>
    </div>
  );
}

function SectionCard({ title, icon, children, delay }: { title: string; icon: string; children: React.ReactNode; delay?: string }) {
  return (
    <div
      className={`animate-fadeInUp ${delay || ''}`}
      style={{
        backgroundColor: 'white',
        border: '1px solid #E8E0D5',
        borderRadius: '20px',
        padding: '24px 28px',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #F0EBE3' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '17px', fontWeight: '600', color: '#1a1a1a' }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    const stored = localStorage.getItem(PREFS_KEY);
    if (stored) {
      try { setPrefs({ ...DEFAULTS, ...JSON.parse(stored) }); } catch {}
    }
  }, []);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function updatePref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
    showToast('Preference saved.');
  }

  function handleDeleteAccount() {
    if (deleteConfirm !== user?.email) {
      showToast('Email does not match.', 'error');
      return;
    }
    // In a real app this would call an API
    logout();
    router.push('/');
  }

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: '120px', height: '20px', borderRadius: '8px' }} />
      </div>
    );
  }

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

      {/* Delete account modal */}
      {showDeleteModal && (
        <div
          className="animate-fadeIn"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteModal(false); }}
        >
          <div
            className="animate-scaleIn"
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '16px', textAlign: 'center' }}>⚠️</div>
            <h2
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              Delete Account
            </h2>
            <p style={{ fontSize: '14px', color: '#9A8E85', textAlign: 'center', marginBottom: '20px', lineHeight: '1.6' }}>
              This will permanently delete your account and all your order history. This action cannot be undone.
            </p>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#5A5048', marginBottom: '8px' }}>
              Type your email to confirm: <span style={{ color: '#991B1B' }}>{user.email}</span>
            </p>
            <input
              type="email"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={user.email}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid #FECACA',
                backgroundColor: '#FFF5F5',
                fontSize: '14px',
                outline: 'none',
                marginBottom: '20px',
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '100px',
                  border: '1.5px solid #E8E0D5',
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#5A5048',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '100px',
                  border: 'none',
                  backgroundColor: '#991B1B',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <AccountSidebar />

        <main style={{ flex: 1, minWidth: 0 }}>
          <div className="animate-fadeInUp" style={{ marginBottom: '28px' }}>
            <p style={{ color: '#8B4513', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '600' }}>
              Your Preferences
            </p>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '32px', fontWeight: '700', color: '#1a1a1a' }}>
              Settings
            </h1>
          </div>

          {/* Notifications */}
          <SectionCard title="Notifications" icon="🔔" delay="delay-100">
            <Toggle
              checked={prefs.emailNotifications}
              onChange={(v) => updatePref('emailNotifications', v)}
              label="Email Notifications"
              desc="Receive emails about your account activity."
            />
            <div style={{ borderTop: '1px solid #F0EBE3' }} />
            <Toggle
              checked={prefs.orderUpdates}
              onChange={(v) => updatePref('orderUpdates', v)}
              label="Order Updates"
              desc="Get notified when your order status changes."
            />
            <div style={{ borderTop: '1px solid #F0EBE3' }} />
            <Toggle
              checked={prefs.newsletters}
              onChange={(v) => updatePref('newsletters', v)}
              label="Newsletters & Offers"
              desc="Curated book recommendations and seasonal offers."
            />
          </SectionCard>

          {/* Preferences */}
          <SectionCard title="Preferences" icon="🌍" delay="delay-200">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '8px 0' }}>
              <div>
                <p style={{ fontWeight: '500', color: '#1a1a1a', fontSize: '14px', marginBottom: '2px' }}>Language</p>
                <p style={{ fontSize: '12px', color: '#9A8E85' }}>Interface language for Leaf & Lore.</p>
              </div>
              <select
                value={prefs.language}
                onChange={(e) => updatePref('language', e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #E8E0D5',
                  backgroundColor: '#FAF7F2',
                  fontSize: '13px',
                  color: '#1a1a1a',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {['English', 'हिन्दी', 'मराठी', 'தமிழ்', 'తెలుగు'].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div style={{ borderTop: '1px solid #F0EBE3', paddingTop: '14px', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: '500', color: '#1a1a1a', fontSize: '14px', marginBottom: '2px' }}>Currency</p>
                  <p style={{ fontSize: '12px', color: '#9A8E85' }}>All prices are shown in Indian Rupees.</p>
                </div>
                <span
                  style={{
                    padding: '6px 14px',
                    borderRadius: '100px',
                    backgroundColor: '#F0EBE3',
                    fontSize: '13px',
                    color: '#8B4513',
                    fontWeight: '600',
                  }}
                >
                  ₹ INR
                </span>
              </div>
            </div>
          </SectionCard>

          {/* Appearance */}
          <SectionCard title="Appearance" icon="🎨" delay="delay-300">
            <Toggle
              checked={prefs.lightMode}
              onChange={(v) => updatePref('lightMode', v)}
              label="Light Mode"
              desc="The earthy cream theme — our recommended reading environment."
            />
            <p style={{ fontSize: '12px', color: '#B0A89E', marginTop: '4px' }}>
              Dark mode is in the works. We want it to feel just right before we ship it.
            </p>
          </SectionCard>

          {/* Privacy */}
          <SectionCard title="Privacy & Account" icon="🔒" delay="delay-400">
            <div style={{ padding: '8px 0' }}>
              <p style={{ fontSize: '14px', color: '#5A5048', lineHeight: '1.6', marginBottom: '16px' }}>
                Your data is yours. We never sell it or share it with third parties beyond what&apos;s needed to fulfil your orders.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '100px',
                  border: '1.5px solid #FECACA',
                  backgroundColor: 'transparent',
                  color: '#991B1B',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FFF5F5'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
              >
                Delete My Account
              </button>
            </div>
          </SectionCard>
        </main>
      </div>
    </div>
  );
}
