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
  unreadCount?: number;
}