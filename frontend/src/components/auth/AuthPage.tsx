import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import type { LoginFormData, RegisterFormData } from '../../utils/validators';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (data: LoginFormData) => {
    console.log('Login:', data);
    // Aquí irá la lógica de autenticación
  };

  const handleRegister = (data: RegisterFormData) => {
    console.log('Register:', data);
    // Aquí irá la lógica de registro
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">ChatFlow</h1>
          <p className="text-gray-400">Conecta en tiempo real</p>
        </div>

        {/* Card del formulario */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-900 p-1 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                isLogin
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                !isLogin
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Formularios */}
          <div className="mt-6">
            {isLogin ? (
              <LoginForm onSubmit={handleLogin} />
            ) : (
              <RegisterForm onSubmit={handleRegister} />
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          © 2025 ChatFlow. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};