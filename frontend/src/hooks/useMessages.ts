import { useState, useEffect, useCallback } from 'react';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { conversationAPI } from '../services/api';
import { wsService } from '../services/websocket';
import type { Message } from '../types/message.types';

export const useMessages = (conversationId: string | null) => {
  const {
    messages,
    hasMoreMessages,
    addMessage,
    prependMessages,
    replaceMessage,
    updateMessageStatus,
    updateMessageReactions,
    setHasMore,
  } = useChatStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const conversationMessages = conversationId ? messages[conversationId] || [] : [];
  const hasMore = conversationId ? hasMoreMessages[conversationId] ?? true : false;

  useEffect(() => {
    if (conversationId && !messages[conversationId]) {
      loadMessages(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    wsService.joinConversation(conversationId);

    const handleNewMessage = (message: Message) => {
      if (message.conversationId !== conversationId) return;
      addMessage(conversationId, message);
      if (message.senderId !== user?.userId) {
        wsService.markAsDelivered(message.messageId, conversationId);
        setTimeout(() => wsService.markAsRead(message.messageId, conversationId), 1200);
      }
    };

    const handleMessageSent = (data: { tempId?: string; message: Message }) => {
      if (data.tempId && data.message.conversationId === conversationId) {
        replaceMessage(conversationId, data.tempId, data.message);
      }
    };

    const handleMessageStatus = (data: { messageId: string; status: Message['status'] }) => {
      updateMessageStatus(data.messageId, data.status);
    };

    const handleReactionUpdated = (data: {
      messageId: string;
      reactions: { [emoji: string]: string[] };
    }) => {
      updateMessageReactions(data.messageId, data.reactions);
    };

    wsService.onNewMessage(handleNewMessage);
    wsService.onMessageSent(handleMessageSent);
    wsService.onMessageStatus(handleMessageStatus);
    wsService.onReactionUpdated(handleReactionUpdated);

    return () => {
      wsService.offNewMessage(handleNewMessage);
      wsService.offMessageSent(handleMessageSent);
      wsService.offMessageStatus(handleMessageStatus);
      wsService.offReactionUpdated(handleReactionUpdated);
    };
  }, [conversationId, user?.userId]);

  const loadMessages = useCallback(
    async (convId: string) => {
      setIsLoading(true);
      try {
        const response = await conversationAPI.getMessages(convId, undefined, 20);
        if (response.success && response.messages) {
          response.messages.forEach((msg: Message) => addMessage(convId, msg));
          setHasMore(convId, response.hasMore ?? false);

          response.messages
            .filter((msg: Message) => msg.senderId !== user?.userId && msg.status !== 'read')
            .forEach((msg: Message) => wsService.markAsRead(msg.messageId, convId));
        }
      } catch (error) {
        console.error('Error cargando mensajes:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [user?.userId]
  );

  const loadMoreMessages = useCallback(async () => {
    if (!conversationId || isLoadingMore || !hasMore) return;

    const oldest = conversationMessages[0];
    if (!oldest) return;

    setIsLoadingMore(true);
    try {
      const response = await conversationAPI.getMessages(conversationId, oldest.timestamp, 20);
      if (response.success && response.messages && response.messages.length > 0) {
        prependMessages(conversationId, response.messages);
        setHasMore(conversationId, response.hasMore ?? false);
      } else {
        setHasMore(conversationId, false);
      }
    } catch (error) {
      console.error('Error cargando más mensajes:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [conversationId, isLoadingMore, hasMore, conversationMessages]);

  const sendMessage = async (text: string) => {
    if (!conversationId || !user) return;

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const tempMessage: Message = {
      messageId: tempId,
      conversationId,
      senderId: user.userId,
      text,
      timestamp: Date.now(),
      status: 'sending',
    };

    addMessage(conversationId, tempMessage);
    wsService.sendMessage(conversationId, text, user.userId, tempId);
  };

  const toggleReaction = (messageId: string, emoji: string) => {
    if (!conversationId || !user) return;
    wsService.toggleReaction(messageId, conversationId, emoji, user.userId);
  };

  return {
    messages: conversationMessages,
    isLoading,
    isLoadingMore,
    hasMore,
    sendMessage,
    loadMoreMessages,
    toggleReaction,
  };
};
