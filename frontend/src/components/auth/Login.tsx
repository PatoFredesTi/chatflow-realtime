// components/auth/Login.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authAPI } from '../../services/api';
import { AuthLayout, authInputStyle, authButtonStyle } from './AuthLayout';

export const Login = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      if (response.success) {
        setAuth(response.user, response.token);
      } else {
        setError(response.error || 'Error al iniciar sesión');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="ChatFlow" subtitle="Inicia sesión para continuar">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', display: 'block' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            style={authInputStyle}
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', display: 'block' }}>
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={authInputStyle}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div
            style={{
              padding: '10px 12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#fca5a5',
              fontSize: '12px',
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...authButtonStyle,
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'wait' : 'pointer',
            marginTop: '8px',
          }}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>

        <p
          style={{
            textAlign: 'center',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
            margin: '12px 0 0',
          }}
        >
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            style={{ color: 'var(--msn-blue-bright)', textDecoration: 'none', fontWeight: 500 }}
          >
            Crear cuenta
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
