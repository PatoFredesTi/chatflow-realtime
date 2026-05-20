// services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({ baseURL: API_URL });

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('chatflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: async (data: { email: string; username: string; password: string }) => {
    const res = await api.post('/api/auth/register', data);
    return res.data;
  },
  login: async (data: { email: string; password: string }) => {
    const res = await api.post('/api/auth/login', data);
    return res.data;
  },
  me: async () => {
    const res = await api.get('/api/auth/me');
    return res.data;
  },
  searchUsers: async (query: string) => {
    const res = await api.get('/api/auth/users/search', { params: { q: query } });
    return res.data;
  },
};

// ── Conversations ─────────────────────────────────────────────────────────
export const conversationAPI = {
  list: async () => {
    const res = await api.get('/api/conversations');
    return res.data;
  },
  create: async (data: {
    participantIds: string[];
    type: 'individual' | 'group';
    name?: string;
  }) => {
    const res = await api.post('/api/conversations', data);
    return res.data;
  },
  getMessages: async (
    conversationId: string,
    options: { limit?: number; before?: number } = {}
  ) => {
    const res = await api.get(`/api/conversations/${conversationId}/messages`, {
      params: options,
    });
    return res.data;
  },
};

export default api;
