// components/layout/Header.tsx
import { Avatar } from '../common';
import { useAuthStore } from '../../stores/authStore';

export const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <div
      style={{
        padding: '14px 16px',
        background: 'linear-gradient(135deg, rgba(0, 80, 208, 0.6) 0%, rgba(26, 140, 255, 0.4) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
      }}
    >
      <Avatar alt={user?.username || '?'} online size="md" />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'white',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {user?.username}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: 'var(--msn-green)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--msn-green)',
              boxShadow: '0 0 6px var(--msn-green-glow)',
            }}
          />
          En línea
        </div>
      </div>

      <button
        onClick={logout}
        title="Cerrar sesión"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '8px',
          color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
          e.currentTarget.style.color = '#fca5a5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
        }}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    </div>
  );
};
