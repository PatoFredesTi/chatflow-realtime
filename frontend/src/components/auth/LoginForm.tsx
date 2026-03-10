import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validators';
import type { LoginFormData } from '../../utils/validators';
import { useState } from 'react';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
}

export const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ animation: 'fadeIn 0.5s 0.5s both' }}>
      {/* Email */}
      <div style={{ marginBottom: '18px' }}>
        <label style={{
          display: 'block',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          Correo electrónico
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.35)',
            fontSize: '16px',
            pointerEvents: 'none'
          }}>
            ✉
          </span>
          <input
            type="email"
            placeholder="tu@correo.com"
            {...register('email')}
            style={{
              width: '100%',
              padding: '13px 16px 13px 44px',
              background: 'rgba(255,255,255,0.07)',
              border: `1px solid ${errors.email ? 'rgba(255,80,80,0.5)' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'all 0.25s ease'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.11)';
              e.target.style.borderColor = 'var(--msn-blue-bright)';
              e.target.style.boxShadow = '0 0 0 3px rgba(26, 140, 255, 0.15), 0 0 20px rgba(26, 140, 255, 0.08)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.07)';
              e.target.style.borderColor = errors.email ? 'rgba(255,80,80,0.5)' : 'rgba(255,255,255,0.12)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        {errors.email && (
          <p style={{ marginTop: '6px', fontSize: '11px', color: '#ff8888' }}>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div style={{ marginBottom: '18px' }}>
        <label style={{
          display: 'block',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          Contraseña
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.35)',
            fontSize: '16px',
            pointerEvents: 'none'
          }}>
            🔒
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password')}
            style={{
              width: '100%',
              padding: '13px 44px 13px 44px',
              background: 'rgba(255,255,255,0.07)',
              border: `1px solid ${errors.password ? 'rgba(255,80,80,0.5)' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'all 0.25s ease'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.11)';
              e.target.style.borderColor = 'var(--msn-blue-bright)';
              e.target.style.boxShadow = '0 0 0 3px rgba(26, 140, 255, 0.15), 0 0 20px rgba(26, 140, 255, 0.08)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.07)';
              e.target.style.borderColor = errors.password ? 'rgba(255,80,80,0.5)' : 'rgba(255,255,255,0.12)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.35)',
              cursor: 'pointer',
              fontSize: '16px',
              userSelect: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--msn-blue-sky)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
          >
            {showPassword ? '🙈' : '👁'}
          </span>
        </div>
        {errors.password && (
          <p style={{ marginTop: '6px', fontSize: '11px', color: '#ff8888' }}>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Options row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-muted)', userSelect: 'none' }}>
          <input type="checkbox" style={{ display: 'none' }} />
          <div style={{
            width: '16px',
            height: '16px',
            border: '1.5px solid rgba(255,255,255,0.25)',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}></div>
          Recordarme
        </label>
        <a href="#" style={{ fontSize: '12px', color: 'var(--msn-blue-sky)', textDecoration: 'none' }}>
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '15px',
          background: 'linear-gradient(135deg, #0055dd 0%, #0077ff 50%, #1a8cff 100%)',
          border: 'none',
          borderRadius: '10px',
          color: 'white',
          fontSize: '15px',
          fontWeight: 700,
          fontFamily: 'inherit',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.25s ease',
          boxShadow: '0 4px 24px rgba(0, 119, 255, 0.45)',
          letterSpacing: '0.3px',
          opacity: isLoading ? 0.7 : 1
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 119, 255, 0.6)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 119, 255, 0.45)';
        }}
      >
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2.5px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite'
            }}></div>
            <span>Iniciando sesión...</span>
          </div>
        ) : (
          'Iniciar Sesión'
        )}
      </button>
    </form>
  );
};