// types/message.types.ts

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'error';

export interface Message {
  messageId: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: number;
  status: MessageStatus;
  reactions?: Record<string, string[]>;
}
