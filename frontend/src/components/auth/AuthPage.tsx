import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '../../hooks';
import type { LoginFormData, RegisterFormData } from '../../utils/validators';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoading, error } = useAuth();

  const handleLogin = async (data: LoginFormData) => {
    const result = await login(data);
    if (result.success) {
      console.log('Login exitoso');
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    const result = await register(data);
    if (result.success) {
      console.log('Registro exitoso');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* Background animado */}
      <div className="bg-scene">
        <div className="bg-gradient"></div>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
        <Stars />
        <div className="scanlines"></div>
      </div>

      {/* Mariposa gigante de fondo */}
      <ButterflyBackground />

      {/* Tarjeta principal */}
      <div style={{ position: 'relative', zIndex: 10, width: '420px', maxWidth: '90vw' }}>
        {/* Logo y marca */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '0 4px 20px', animation: 'fadeIn 0.8s 0.3s both' }}>
          <div style={{ width: '44px', height: '44px' }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="21" fill="url(#logoGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
              <ellipse cx="15" cy="15" rx="10" ry="7" fill="rgba(255,255,255,0.9)" transform="rotate(-40,15,15)"/>
              <ellipse cx="29" cy="15" rx="10" ry="7" fill="rgba(255,255,255,0.7)" transform="rotate(40,29,15)"/>
              <ellipse cx="15" cy="29" rx="10" ry="7" fill="rgba(255,255,255,0.7)" transform="rotate(40,15,29)"/>
              <ellipse cx="29" cy="29" rx="10" ry="7" fill="rgba(255,255,255,0.9)" transform="rotate(-40,29,29)"/>
              <circle cx="22" cy="22" r="4" fill="white"/>
              <defs>
                <radialGradient id="logoGrad" cx="35%" cy="35%">
                  <stop offset="0%" stopColor="#1a8cff"/>
                  <stop offset="100%" stopColor="#003399"/>
                </radialGradient>
              </defs>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'white', letterSpacing: '-0.5px' }}>
              Chat<span style={{ color: 'var(--msn-blue-sky)' }}>Flow</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '2px' }}>
              Real-Time Messenger
            </div>
          </div>
        </div>

        {/* Tarjeta con glassmorphism */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 1px 0 rgba(255,255,255,0.2) inset'
        }}>
          {/* Header con gradiente */}
          <div style={{
            padding: '28px 32px 24px',
            background: 'linear-gradient(135deg, rgba(0, 80, 208, 0.6) 0%, rgba(26, 140, 255, 0.3) 50%, rgba(0, 51, 153, 0.5) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
              {isLogin ? 'Bienvenido de vuelta' : 'Únete a ChatFlow'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
              {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta gratis'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: 'var(--msn-green)',
                borderRadius: '50%',
                boxShadow: '0 0 8px var(--msn-green)',
                animation: 'pulse-green 2s ease-in-out infinite'
              }}></div>
              <span style={{ fontSize: '12px', color: 'var(--msn-green)', fontWeight: 500, letterSpacing: '0.3px' }}>
                Servidores operativos
              </span>
            </div>
          </div>

          {/* Cuerpo con formularios */}
          <div style={{ padding: '32px' }}>
            {/* Error message */}
            {error && (
              <div style={{
                display: 'flex',
                background: 'rgba(255, 50, 50, 0.12)',
                border: '1px solid rgba(255,80,80,0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#ff8888',
                marginBottom: '16px',
                alignItems: 'center',
                gap: '8px',
                animation: 'shake 0.5s ease-in-out'
              }}>
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
              background: 'rgba(0,0,0,0.2)',
              padding: '6px',
              borderRadius: '12px'
            }}>
              <button
                onClick={() => setIsLogin(true)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: isLogin ? 'linear-gradient(135deg, #0055dd 0%, #0077ff 50%, #1a8cff 100%)' : 'transparent',
                  color: 'white',
                  boxShadow: isLogin ? '0 4px 12px rgba(0, 119, 255, 0.4)' : 'none'
                }}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setIsLogin(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: !isLogin ? 'linear-gradient(135deg, #0055dd 0%, #0077ff 50%, #1a8cff 100%)' : 'transparent',
                  color: 'white',
                  boxShadow: !isLogin ? '0 4px 12px rgba(0, 119, 255, 0.4)' : 'none'
                }}
              >
                Registrarse
              </button>
            </div>

            {/* Formularios */}
            {isLogin ? (
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            ) : (
              <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 32px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🛡</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Conexión segura SSL</span>
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.5px' }}>v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para las estrellas
const Stars = () => {
  const stars = [];
  for (let i = 0; i < 80; i++) {
    stars.push(
      <div
        key={i}
        className="star"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          '--tw': `${2 + Math.random() * 4}s`,
          animationDelay: `${Math.random() * 4}s`,
          width: Math.random() > 0.8 ? '3px' : '2px',
          height: Math.random() > 0.8 ? '3px' : '2px'
        } as React.CSSProperties}
      />
    );
  }
  return <div className="stars">{stars}</div>;
};

// Componente mariposa de fondo
const ButterflyBackground = () => (
  <div className="butterfly-container">
    <div className="butterfly-bg">
      <svg className="butterfly-svg" viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }}>
        <g transform="translate(200,200)">
          <ellipse cx="-70" cy="-70" rx="90" ry="60" fill="rgba(26,140,255,0.6)" transform="rotate(-45)"/>
          <ellipse cx="70" cy="-70" rx="90" ry="60" fill="rgba(0,102,255,0.5)" transform="rotate(45)"/>
          <ellipse cx="-70" cy="70" rx="90" ry="60" fill="rgba(0,170,255,0.5)" transform="rotate(45)"/>
          <ellipse cx="70" cy="70" rx="90" ry="60" fill="rgba(0,80,220,0.6)" transform="rotate(-45)"/>
          <circle cx="0" cy="0" r="28" fill="rgba(100,200,255,0.7)"/>
          <circle cx="0" cy="0" r="16" fill="rgba(200,235,255,0.8)"/>
        </g>
      </svg>
    </div>
  </div>
);