// backend/src/models/types.ts

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'error';

export interface User {
  userId: string;
  email: string;
  username: string;
  passwordHash: string;
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
  status: MessageStatus;
  reactions?: Record<string, string[]>;
}
