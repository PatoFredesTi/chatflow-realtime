// components/auth/AuthLayout.tsx
import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const AuthLayout = ({ title, subtitle, children }: Props) => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '40px',
          background: 'rgba(0, 13, 46, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              fontSize: '48px',
              marginBottom: '12px',
              filter: 'drop-shadow(0 4px 12px rgba(26,140,255,0.4))',
            }}
          >
            💬
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '4px',
            }}
          >
            {title}
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
};

// Shared input style
export const authInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  color: 'white',
  fontSize: '14px',
  outline: 'none',
};

export const authButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'linear-gradient(135deg, #0055dd 0%, #0077ff 100%)',
  border: 'none',
  borderRadius: '10px',
  color: 'white',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0, 119, 255, 0.3)',
  transition: 'transform 0.15s ease',
};
