// hooks/useConversations.ts
import { useEffect, useState } from 'react';
import { useChatStore } from '../stores/chatStore';
import { useSocketStore } from '../stores/socketStore';
import { conversationAPI } from '../services/api';
import type { Conversation } from '../types/chat.types';
import type { Message } from '../types/message.types';

export function useConversations() {
  const { conversations, setConversations, addConversation, updateConversationLastMessage, updateUserStatus } =
    useChatStore();
  const socket = useSocketStore((s) => s.socket);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    const load = async () => {
      try {
        const response = await conversationAPI.list();
        if (response.success) {
          setConversations(response.conversations);
        }
      } catch (err) {
        console.error('[useConversations] Load error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [setConversations]);

  // Listen for new messages to update conversation list
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      updateConversationLastMessage(message.conversationId, message);
    };

    const handleUserStatus = (data: { userId: string; status: 'online' | 'offline' }) => {
      updateUserStatus(data.userId, data.status);
    };

    socket.on('message:new', handleNewMessage);
    socket.on('user:status', handleUserStatus);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('user:status', handleUserStatus);
    };
  }, [socket, updateConversationLastMessage, updateUserStatus]);

  const createConversation = async (
    participantIds: string[],
    type: 'individual' | 'group',
    name?: string
  ): Promise<Conversation | null> => {
    try {
      const response = await conversationAPI.create({ participantIds, type, name });
      if (response.success) {
        addConversation(response.conversation);
        return response.conversation;
      }
    } catch (err) {
      console.error('[useConversations] Create error:', err);
    }
    return null;
  };

  return { conversations, isLoading, createConversation };
}
