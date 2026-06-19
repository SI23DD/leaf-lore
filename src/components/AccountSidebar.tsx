'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { href: '/account', label: 'My Orders', icon: '📦' },
  { href: '/account/profile', label: 'My Profile', icon: '👤' },
  { href: '/account/settings', label: 'Settings', icon: '⚙️' },
  { href: null, label: 'Wishlist', icon: '🔖', soon: true },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const AVATAR_COLORS = [
  '#2D5016', '#8B4513', '#4A7C59', '#7B5B3A', '#3D6B2C', '#9B6B3A',
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = getInitials(user.name || user.email);
  const bgColor = avatarColor(user.name || user.email);

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <aside
      className="animate-fadeInLeft"
      style={{
        width: '260px',
        minWidth: '220px',
        flexShrink: 0,
        backgroundColor: 'white',
        border: '1px solid #E8E0D5',
        borderRadius: '20px',
        padding: '28px 20px',
        height: 'fit-content',
        position: 'sticky',
        top: '96px',
      }}
    >
      {/* Avatar + user info */}
      <div style={{ textAlign: 'center', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid #E8E0D5' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: bgColor,
            color: 'white',
            fontFamily: 'var(--font-playfair), serif',
            fontSize: '26px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 4px 16px rgba(45,80,22,0.2)',
            letterSpacing: '1px',
          }}
        >
          {initials}
        </div>
        <p
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontWeight: '600',
            color: '#1a1a1a',
            fontSize: '15px',
            marginBottom: '2px',
            lineHeight: '1.3',
          }}
        >
          {user.name}
        </p>
        <p style={{ color: '#9A8E85', fontSize: '12px' }}>{user.email}</p>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {NAV_LINKS.map(({ href, label, icon, soon }) => {
          const isActive = href ? (href === '/account' ? pathname === '/account' : pathname.startsWith(href)) : false;

          if (soon) {
            return (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  color: '#C4BAB0',
                  fontSize: '14px',
                  cursor: 'default',
                  userSelect: 'none',
                }}
              >
                <span style={{ fontSize: '16px', opacity: 0.5 }}>{icon}</span>
                <span>{label}</span>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '10px',
                    backgroundColor: '#F0EBE3',
                    color: '#B0A89E',
                    padding: '2px 7px',
                    borderRadius: '20px',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                  }}
                >
                  SOON
                </span>
              </div>
            );
          }

          return (
            <Link
              key={label}
              href={href!}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? '#2D5016' : '#5A5048',
                backgroundColor: isActive ? '#EDF4E8' : 'transparent',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease, color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F0EB';
                  (e.currentTarget as HTMLElement).style.color = '#2D5016';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#5A5048';
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{icon}</span>
              {label}
              {isActive && (
                <span
                  style={{
                    marginLeft: 'auto',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#2D5016',
                    flexShrink: 0,
                  }}
                />
              )}
            </Link>
          );
        })}

        <div style={{ borderTop: '1px solid #E8E0D5', marginTop: '8px', paddingTop: '8px' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#C0392B',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#FDF0EE';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '16px' }}>🚪</span>
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}
