import type { LoginFormData, RegisterFormData } from '../utils/validators';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const authAPI = {
  login: async (data: LoginFormData) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al iniciar sesión');
    }

    return response.json();
  },

  register: async (data: RegisterFormData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        username: data.username,
        password: data.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al registrarse');
    }

    return response.json();
  },

  logout: async (userId: string) => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    return response.json();
  },
};

export const conversationAPI = {
  getUserConversations: async (userId: string) => {
    const response = await fetch(`${API_URL}/conversations/${userId}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener conversaciones');
    }

    return response.json();
  },

  getMessages: async (conversationId: string) => {
    const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`);
    
    if (!response.ok) {
      throw new Error('Error al obtener mensajes');
    }

    return response.json();
  },

  createConversation: async (participants: string[], type: 'individual' | 'group' = 'individual') => {
    const response = await fetch(`${API_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ participants, type }),
    });

    if (!response.ok) {
      throw new Error('Error al crear conversación');
    }

    return response.json();
  },
};