import { create } from 'zustand';
import type { Conversation } from '../types/chat.types';
import type { Message } from '../types/message.types';

interface ChatState {
  conversations: Conversation[];
  currentConversation: string | null;
  messages: { [conversationId: string]: Message[] };
  hasMoreMessages: { [conversationId: string]: boolean };

  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversationId: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  prependMessages: (conversationId: string, messages: Message[]) => void;
  replaceMessage: (conversationId: string, tempId: string, message: Message) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
  updateMessageReactions: (messageId: string, reactions: { [emoji: string]: string[] }) => void;
  setHasMore: (conversationId: string, hasMore: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  currentConversation: null,
  messages: {},
  hasMoreMessages: {},

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

  prependMessages: (conversationId, newMessages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...newMessages, ...(state.messages[conversationId] || [])],
      },
    })),

  replaceMessage: (conversationId, tempId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map((msg) =>
          msg.messageId === tempId ? message : msg
        ),
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

  updateMessageReactions: (messageId, reactions) =>
    set((state) => {
      const updatedMessages = { ...state.messages };
      Object.keys(updatedMessages).forEach((convId) => {
        updatedMessages[convId] = updatedMessages[convId].map((msg) =>
          msg.messageId === messageId ? { ...msg, reactions } : msg
        );
      });
      return { messages: updatedMessages };
    }),

  setHasMore: (conversationId, hasMore) =>
    set((state) => ({
      hasMoreMessages: { ...state.hasMoreMessages, [conversationId]: hasMore },
    })),
}));