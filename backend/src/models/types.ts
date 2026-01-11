export interface User {
  userId: string;
  email: string;
  username: string;
  password: string; // En producción esto estaría hasheado
  avatar?: string;
  createdAt: number;
  lastSeen: number;
  status: 'online' | 'offline';
}

export interface Conversation {
  conversationId: string;
  type: 'individual' | 'group';
  name?: string;
  participants: string[];
  createdAt: number;
  lastMessageAt: number;
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: number;
  };
}

export interface Message {
  messageId: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
}

export interface AuthResponse {
  success: boolean;
  user?: {
    userId: string;
    email: string;
    username: string;
    avatar?: string;
    status: 'online' | 'offline';
  };
  accessToken?: string;
  error?: string;
}