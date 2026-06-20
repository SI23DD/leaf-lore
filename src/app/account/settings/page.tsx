'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@frontend/context/AuthContext';
import AccountSidebar from '@frontend/components/AccountSidebar';

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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '13px 0' }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: '600', color: '#1C1C1C', fontSize: '13px', marginBottom: desc ? '2px' : '0' }}>{label}</p>
        {desc && <p style={{ fontSize: '12px', color: '#6B7280' }}>{desc}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: '42px',
          height: '23px',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: checked ? '#C82333' : '#D1D5DB',
          position: 'relative',
          flexShrink: 0,
          transition: 'background-color 0.2s ease',
          padding: '0',
        }}
      >
        <span
          style={{
            display: 'block',
            width: '17px',
            height: '17px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            position: 'absolute',
            top: '3px',
            left: checked ? '22px' : '3px',
            transition: 'left 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
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
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '20px 24px',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1C1C1C', letterSpacing: '-0.01em' }}>
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
    logout();
    router.push('/');
  }

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: '120px', height: '20px', borderRadius: '6px' }} />
      </div>
    );
  }

  return (
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

      {/* Delete account modal */}
      {showDeleteModal && (
        <div
          className="animate-fadeIn"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
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
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              padding: '28px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
              borderTop: '4px solid #C82333',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1C1C1C', marginBottom: '8px', letterSpacing: '-0.01em' }}>
              Delete Account
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '18px', lineHeight: '1.55' }}>
              This permanently deletes your account and all order history. This cannot be undone.
            </p>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '7px' }}>
              Type your email to confirm: <span style={{ color: '#C82333' }}>{user.email}</span>
            </p>
            <input
              type="email"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={user.email}
              style={{
                width: '100%',
                padding: '9px 13px',
                borderRadius: '6px',
                border: '1.5px solid #FECDD3',
                backgroundColor: '#FFF0F0',
                fontSize: '13px',
                outline: 'none',
                marginBottom: '18px',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '100px',
                  border: '1.5px solid #E5E7EB',
                  backgroundColor: 'transparent',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#374151',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '100px',
                  border: 'none',
                  backgroundColor: '#C82333',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '700',
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
          <div className="animate-fadeInUp" style={{ marginBottom: '24px' }}>
            <p style={{ color: '#C82333', fontSize: '12px', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>
              Your Account
            </p>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1C1C1C', letterSpacing: '-0.02em' }}>
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
            <div style={{ borderTop: '1px solid #F3F4F6' }} />
            <Toggle
              checked={prefs.orderUpdates}
              onChange={(v) => updatePref('orderUpdates', v)}
              label="Order Updates"
              desc="Get notified when your order status changes."
            />
            <div style={{ borderTop: '1px solid #F3F4F6' }} />
            <Toggle
              checked={prefs.newsletters}
              onChange={(v) => updatePref('newsletters', v)}
              label="Newsletters & Offers"
              desc="Curated book recommendations and seasonal offers."
            />
          </SectionCard>

          {/* Preferences */}
          <SectionCard title="Preferences" icon="🌍" delay="delay-200">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '7px 0' }}>
              <div>
                <p style={{ fontWeight: '600', color: '#1C1C1C', fontSize: '13px', marginBottom: '2px' }}>Language</p>
                <p style={{ fontSize: '12px', color: '#6B7280' }}>Interface language for Leaf &amp; Lore.</p>
              </div>
              <select
                value={prefs.language}
                onChange={(e) => updatePref('language', e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #E5E7EB',
                  backgroundColor: '#F9FAFB',
                  fontSize: '12px',
                  color: '#1C1C1C',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {['English', 'हिन्दी', 'मराठी', 'தமிழ்', 'తెలుగు'].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '12px', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: '600', color: '#1C1C1C', fontSize: '13px', marginBottom: '2px' }}>Currency</p>
                  <p style={{ fontSize: '12px', color: '#6B7280' }}>All prices are shown in Indian Rupees.</p>
                </div>
                <span
                  style={{
                    padding: '5px 12px',
                    borderRadius: '100px',
                    backgroundColor: '#F3F4F6',
                    fontSize: '12px',
                    color: '#374151',
                    fontWeight: '700',
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
              desc="Clean white theme — the default reading environment."
            />
            <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
              Dark mode is in the works. We want it to feel just right before we ship it.
            </p>
          </SectionCard>

          {/* Privacy */}
          <SectionCard title="Privacy & Account" icon="🔒" delay="delay-400">
            <div style={{ padding: '7px 0' }}>
              <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6', marginBottom: '14px' }}>
                Your data is yours. We never sell it or share it with third parties beyond what&apos;s needed to fulfil your orders.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                style={{
                  padding: '9px 20px',
                  borderRadius: '100px',
                  border: '1.5px solid #FECDD3',
                  backgroundColor: 'transparent',
                  color: '#C82333',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FFF0F0'; }}
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
