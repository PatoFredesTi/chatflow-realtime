import { useAuthStore } from '../stores/authStore';
import { useState } from 'react';
import { authAPI } from '../services/api';
import { wsService } from '../services/websocket';
import type { LoginFormData, RegisterFormData } from '../utils/validators';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout: logoutStore } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(data);

      if (response.success && response.user) {
        const authUser = {
          ...response.user,
          accessToken: response.accessToken,
          refreshToken: '', // No usamos refresh token en este ejemplo
          createdAt: Date.now(),
          lastSeen: Date.now(),
        };

        setUser(authUser);
        
        // Conectar al WebSocket
        wsService.connect(response.user.userId);

        return { success: true };
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
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
      const response = await authAPI.register(data);

      if (response.success && response.user) {
        const authUser = {
          ...response.user,
          accessToken: response.accessToken,
          refreshToken: '',
          createdAt: Date.now(),
          lastSeen: Date.now(),
        };

        setUser(authUser);
        
        // Conectar al WebSocket
        wsService.connect(response.user.userId);

        return { success: true };
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrarse';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (user) {
      await authAPI.logout(user.userId);
      wsService.disconnect();
    }
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