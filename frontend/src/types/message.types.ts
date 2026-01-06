export interface Message {
  messageId: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: {
    [emoji: string]: string[]; // emoji -> array of userIds
  };
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  username: string;
}