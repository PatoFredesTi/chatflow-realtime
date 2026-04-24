import { create } from 'zustand';
import type { Conversation } from '../types/chat.types';
import type { Message } from '../types/message.types';

export interface UserPresence {
  status: 'online' | 'offline';
  lastSeen: number;
}

interface ChatState {
  conversations: Conversation[];
  currentConversation: string | null;
  messages: { [conversationId: string]: Message[] };
  hasMoreMessages: { [conversationId: string]: boolean };
  userPresence: { [userId: string]: UserPresence };

  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversationId: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  prependMessages: (conversationId: string, messages: Message[]) => void;
  replaceMessage: (conversationId: string, tempId: string, message: Message) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
  updateMessageReactions: (messageId: string, reactions: { [emoji: string]: string[] }) => void;
  setHasMore: (conversationId: string, hasMore: boolean) => void;
  setUserPresence: (userId: string, status: 'online' | 'offline', lastSeen?: number) => void;
  setUsersOnline: (userIds: string[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  currentConversation: null,
  messages: {},
  hasMoreMessages: {},
  userPresence: {},

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

  setUserPresence: (userId, status, lastSeen) =>
    set((state) => ({
      userPresence: {
        ...state.userPresence,
        [userId]: { status, lastSeen: lastSeen ?? state.userPresence[userId]?.lastSeen ?? Date.now() },
      },
    })),

  setUsersOnline: (userIds) =>
    set((state) => {
      const updated = { ...state.userPresence };
      userIds.forEach((id) => {
        updated[id] = { status: 'online', lastSeen: updated[id]?.lastSeen ?? Date.now() };
      });
      return { userPresence: updated };
    }),
}));