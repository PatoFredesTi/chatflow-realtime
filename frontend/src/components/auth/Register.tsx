// components/auth/Register.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authAPI } from '../../services/api';
import { AuthLayout, authInputStyle, authButtonStyle } from './AuthLayout';

export const Register = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.register({ email, username, password });
      if (response.success) {
        setAuth(response.user, response.token);
      } else {
        setError(response.error || 'Error al registrarse');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Crear cuenta" subtitle="Únete a ChatFlow">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', display: 'block' }}>
            Nombre de usuario
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            minLength={2}
            style={authInputStyle}
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', display: 'block' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={authInputStyle}
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', display: 'block' }}>
            Contraseña <span style={{ opacity: 0.5 }}>(mín. 8 caracteres)</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
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
          {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p
          style={{
            textAlign: 'center',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
            margin: '12px 0 0',
          }}
        >
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            style={{ color: 'var(--msn-blue-bright)', textDecoration: 'none', fontWeight: 500 }}
          >
            Iniciar sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
