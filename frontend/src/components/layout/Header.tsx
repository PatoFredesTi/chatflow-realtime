import { Avatar } from '../common';
import { useAuthStore } from '../../stores/authStore';

export const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <header style={{
      background: 'linear-gradient(135deg, rgba(0, 80, 208, 0.8) 0%, rgba(26, 140, 255, 0.6) 50%, rgba(0, 51, 153, 0.7) 100%)',
      borderBottom: '1px solid rgba(255,255,255,0.15)',
      padding: '12px 24px',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo y título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="21" fill="url(#logoGrad2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
              <ellipse cx="15" cy="15" rx="10" ry="7" fill="rgba(255,255,255,0.95)" transform="rotate(-40,15,15)"/>
              <ellipse cx="29" cy="15" rx="10" ry="7" fill="rgba(255,255,255,0.8)" transform="rotate(40,29,15)"/>
              <ellipse cx="15" cy="29" rx="10" ry="7" fill="rgba(255,255,255,0.8)" transform="rotate(40,15,29)"/>
              <ellipse cx="29" cy="29" rx="10" ry="7" fill="rgba(255,255,255,0.95)" transform="rotate(-40,29,29)"/>
              <circle cx="22" cy="22" r="4" fill="white"/>
              <defs>
                <radialGradient id="logoGrad2" cx="35%" cy="35%">
                  <stop offset="0%" stopColor="#1a8cff"/>
                  <stop offset="100%" stopColor="#003399"/>
                </radialGradient>
              </defs>
            </svg>
            <div>
              <h1 style={{
                fontSize: '22px',
                fontWeight: 700,
                color: 'white',
                letterSpacing: '-0.5px',
                lineHeight: 1
              }}>
                Chat<span style={{ color: 'rgba(255,255,255,0.7)' }}>Flow</span>
              </h1>
              <div style={{
                fontSize: '9px',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginTop: '2px'
              }}>
                Messenger
              </div>
            </div>
          </div>
        </div>

        {/* Usuario y logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Status indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: 'var(--msn-green)',
              borderRadius: '50%',
              boxShadow: '0 0 8px var(--msn-green)',
              animation: 'pulse-green 2s ease-in-out infinite'
            }}></div>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
              En línea
            </span>
          </div>

          {/* User info */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', lineHeight: 1 }}>
              {user?.username || 'Usuario'}
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
              {user?.email || 'email@example.com'}
            </p>
          </div>

          <Avatar alt={user?.username || 'Usuario'} online size="md" />

          {/* Logout button */}
          <button
            onClick={logout}
            title="Cerrar sesión"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Salir
          </button>
        </div>
      </div>
    </header>
  );
};