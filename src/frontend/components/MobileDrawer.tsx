'use client';
import { useEffect } from 'react';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
  title?: string;
  side?: 'left' | 'right';
}

export default function MobileDrawer({ open, onClose, children, width = 300, title, side = 'left' }: MobileDrawerProps) {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay${open ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer panel */}
      <div
        className={`drawer${side === 'right' ? ' drawer-right' : ''}${open ? ' open' : ''}`}
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Menu'}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid #f0f0f0',
          position: 'sticky', top: 0, background: '#fff', zIndex: 1,
        }}>
          {title && <span style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>{title}</span>}
          <button onClick={onClose} aria-label="Close"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#666', lineHeight: 1, padding: '2px 6px', marginLeft: 'auto' }}>
            ×
          </button>
        </div>
        {/* Content */}
        <div style={{ padding: '16px 20px' }}>
          {children}
        </div>
      </div>
    </>
  );
}
