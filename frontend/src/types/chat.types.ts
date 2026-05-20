// types/chat.types.ts

export interface User {
  userId: string;
  email: string;
  username: string;
  status?: 'online' | 'offline';
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
  // Enriched fields from backend
  displayName?: string;
  otherUserId?: string;
  isOnline?: boolean;
}
