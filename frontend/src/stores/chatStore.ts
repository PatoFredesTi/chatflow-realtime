import { create } from 'zustand';
import type { Conversation } from '../types/chat.types';
import type { Message } from '../types/message.types';

interface ChatState {
  conversations: Conversation[];
  currentConversation: string | null;
  messages: { [conversationId: string]: Message[] };
  
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversationId: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  currentConversation: null,
  messages: {},
  
  setConversations: (conversations) => set({ conversations }),
  
  setCurrentConversation: (conversationId) => 
    set({ currentConversation: conversationId }),
  
  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
    })),
  
  updateMessageStatus: (messageId, status) =>
    set((state) => {
      const updatedMessages = { ...state.messages };
      Object.keys(updatedMessages).forEach((convId) => {
        updatedMessages[convId] = updatedMessages[convId].map((msg) =>
          msg.messageId === messageId ? { ...msg, status } : msg
        );
      });
      return { messages: updatedMessages };
    }),
}));