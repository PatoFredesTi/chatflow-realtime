// stores/chatStore.ts
import { create } from 'zustand';
import type { Message, MessageStatus } from '../types/message.types';
import type { Conversation, User } from '../types/chat.types';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>; // conversationId -> messages
  currentUser: User | null;

  // Conversation actions
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  setActiveConversation: (conversationId: string | null) => void;
  updateConversationLastMessage: (conversationId: string, message: Message) => void;

  // Message actions
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  prependMessages: (conversationId: string, messages: Message[]) => void;
  updateMessageStatus: (messageId: string, status: MessageStatus) => void;
  replaceMessage: (oldMessageId: string, newMessage: Message) => void;
  updateMessageReactions: (messageId: string, reactions: Record<string, string[]>) => void;

  // User
  setCurrentUser: (user: User | null) => void;
  updateUserStatus: (userId: string, status: 'online' | 'offline') => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  currentUser: null,

  setConversations: (conversations) => set({ conversations }),

  addConversation: (conversation) =>
    set((state) => {
      const exists = state.conversations.find(
        (c) => c.conversationId === conversation.conversationId
      );
      if (exists) return state;
      return { conversations: [conversation, ...state.conversations] };
    }),

  setActiveConversation: (conversationId) => set({ activeConversationId: conversationId }),

  updateConversationLastMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations
        .map((c) =>
          c.conversationId === conversationId
            ? {
                ...c,
                lastMessageAt: message.timestamp,
                lastMessage: {
                  text: message.text,
                  senderId: message.senderId,
                  timestamp: message.timestamp,
                },
              }
            : c
        )
        .sort((a, b) => b.lastMessageAt - a.lastMessageAt),
    })),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    })),

  addMessage: (conversationId, message) =>
    set((state) => {
      const existing = state.messages[conversationId] ?? [];
      // Avoid duplicates
      if (existing.some((m) => m.messageId === message.messageId)) return state;
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existing, message],
        },
      };
    }),

  prependMessages: (conversationId, newMessages) =>
    set((state) => {
      const existing = state.messages[conversationId] ?? [];
      const existingIds = new Set(existing.map((m) => m.messageId));
      const filtered = newMessages.filter((m) => !existingIds.has(m.messageId));
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...filtered, ...existing],
        },
      };
    }),

  updateMessageStatus: (messageId, status) =>
    set((state) => {
      const updated = { ...state.messages };
      for (const convId of Object.keys(updated)) {
        updated[convId] = updated[convId].map((m) =>
          m.messageId === messageId ? { ...m, status } : m
        );
      }
      return { messages: updated };
    }),

  replaceMessage: (oldMessageId, newMessage) =>
    set((state) => {
      const updated = { ...state.messages };
      for (const convId of Object.keys(updated)) {
        updated[convId] = updated[convId].map((m) =>
          m.messageId === oldMessageId ? newMessage : m
        );
      }
      return { messages: updated };
    }),

  updateMessageReactions: (messageId, reactions) =>
    set((state) => {
      const updated = { ...state.messages };
      for (const convId of Object.keys(updated)) {
        updated[convId] = updated[convId].map((m) =>
          m.messageId === messageId ? { ...m, reactions } : m
        );
      }
      return { messages: updated };
    }),

  setCurrentUser: (user) => set({ currentUser: user }),

  updateUserStatus: (userId, status) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.otherUserId === userId ? { ...c, isOnline: status === 'online' } : c
      ),
    })),
}));
