import { useAuthStore } from '../stores/authStore';
import { useState } from 'react';
import type { LoginFormData, RegisterFormData } from '../utils/validators';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout: logoutStore } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulación de login (después será API real)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simular respuesta del servidor
      const mockUser = {
        userId: '123',
        email: data.email,
        username: data.email.split('@')[0],
        createdAt: Date.now(),
        lastSeen: Date.now(),
        status: 'online' as const,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      setUser(mockUser);
      return { success: true };
    } catch (err) {
      const errorMessage = 'Error al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulación de registro (después será API real)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simular respuesta del servidor
      const mockUser = {
        userId: '123',
        email: data.email,
        username: data.username,
        createdAt: Date.now(),
        lastSeen: Date.now(),
        status: 'online' as const,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      setUser(mockUser);
      return { success: true };
    } catch (err) {
      const errorMessage = 'Error al registrarse';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutStore();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};