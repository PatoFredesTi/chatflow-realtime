import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validators';
import type { RegisterFormData } from '../../utils/validators';
import { useState } from 'react';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading?: boolean;
}

export const RegisterForm = ({ onSubmit, isLoading }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: '13px 16px 13px 44px',
    background: 'rgba(255,255,255,0.07)',
    border: `1px solid ${hasError ? 'rgba(255,80,80,0.5)' : 'rgba(255,255,255,0.12)'}`,
    borderRadius: '10px',
    color: 'white',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.25s ease'
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ animation: 'fadeIn 0.5s 0.5s both' }}>
      {/* Username */}
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
          Nombre de usuario
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
            👤
          </span>
          <input
            type="text"
            placeholder="johndoe"
            {...register('username')}
            style={inputStyle(!!errors.username)}
          />
        </div>
        {errors.username && (
          <p style={{ marginTop: '6px', fontSize: '11px', color: '#ff8888' }}>
            {errors.username.message}
          </p>
        )}
      </div>

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
            style={inputStyle(!!errors.email)}
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
            style={{...inputStyle(!!errors.password), paddingRight: '44px'}}
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
              fontSize: '16px'
            }}
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

      {/* Confirm Password */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          Confirmar contraseña
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
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('confirmPassword')}
            style={{...inputStyle(!!errors.confirmPassword), paddingRight: '44px'}}
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.35)',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {showConfirmPassword ? '🙈' : '👁'}
          </span>
        </div>
        {errors.confirmPassword && (
          <p style={{ marginTop: '6px', fontSize: '11px', color: '#ff8888' }}>
            {errors.confirmPassword.message}
          </p>
        )}
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
          cursor: isLoading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 24px rgba(0, 119, 255, 0.45)',
          letterSpacing: '0.3px',
          opacity: isLoading ? 0.7 : 1,
          transition: 'all 0.25s ease'
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
            <span>Creando cuenta...</span>
          </div>
        ) : (
          'Crear Cuenta'
        )}
      </button>
    </form>
  );
};