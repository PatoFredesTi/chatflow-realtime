// hooks/useInfiniteMessages.ts
// RF-009: Pagination + RF-010: Status + RF-011: Reactions
// All real-time message handling lives here.

import { useState, useEffect, useCallback, useRef } from 'react';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { useSocketStore } from '../stores/socketStore';
import { conversationAPI } from '../services/api';
import type { Message, MessageStatus } from '../types/message.types';

const PAGE_SIZE = 20;

export function useInfiniteMessages(conversationId: string) {
  const { user } = useAuthStore();
  const socket = useSocketStore((s) => s.socket);

  const messages = useChatStore((s) => s.messages[conversationId] ?? []);
  const setMessages = useChatStore((s) => s.setMessages);
  const addMessage = useChatStore((s) => s.addMessage);
  const prependMessages = useChatStore((s) => s.prependMessages);
  const replaceMessage = useChatStore((s) => s.replaceMessage);
  const updateMessageStatus = useChatStore((s) => s.updateMessageStatus);
  const updateMessageReactions = useChatStore((s) => s.updateMessageReactions);
  const updateConversationLastMessage = useChatStore((s) => s.updateConversationLastMessage);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const cursor = useRef<number | null>(null);
  const initializedFor = useRef<string | null>(null);

  // ── Initial load ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!conversationId) return;
    if (initializedFor.current === conversationId) return;
    initializedFor.current = conversationId;

    const load = async () => {
      setIsLoading(true);
      setHasMore(true);
      cursor.current = null;
      try {
        const response = await conversationAPI.getMessages(conversationId, {
          limit: PAGE_SIZE,
        });
        if (response.success && response.messages) {
          const msgs: Message[] = response.messages;
          setMessages(conversationId, msgs);
          if (msgs.length > 0) {
            cursor.current = Math.min(...msgs.map((m) => m.timestamp));
          }
          setHasMore(msgs.length >= PAGE_SIZE);
        }
      } catch (err) {
        console.error('[useInfiniteMessages] Initial load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
    socket?.emit('join:conversation', conversationId);
  }, [conversationId, setMessages, socket]);

  // ── Load older messages ─────────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || cursor.current === null) return;

    setIsLoadingMore(true);
    try {
      const response = await conversationAPI.getMessages(conversationId, {
        limit: PAGE_SIZE,
        before: cursor.current,
      });

      if (response.success && response.messages) {
        const msgs: Message[] = response.messages;
        if (msgs.length === 0) {
          setHasMore(false);
          return;
        }
        prependMessages(conversationId, msgs);
        cursor.current = Math.min(...msgs.map((m) => m.timestamp));
        setHasMore(msgs.length >= PAGE_SIZE);
      }
    } catch (err) {
      console.error('[useInfiniteMessages] Load more error:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [conversationId, isLoadingMore, hasMore, prependMessages]);

  // ── Socket listeners ────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNewMessage = (message: Message) => {
      if (message.conversationId !== conversationId) return;
      addMessage(conversationId, message);
      updateConversationLastMessage(conversationId, message);
    };

    const handleMessageSent = (data: { tempId: string; message: Message }) => {
      if (data.message.conversationId !== conversationId) return;
      // Replace the optimistic message with the real one
      replaceMessage(data.tempId, data.message);
    };

    const handleMessageStatus = (data: {
      messageId: string;
      status: MessageStatus;
    }) => {
      updateMessageStatus(data.messageId, data.status);
    };

    const handleReactionUpdated = (data: {
      messageId: string;
      conversationId: string;
      reactions: Record<string, string[]>;
    }) => {
      if (data.conversationId !== conversationId) return;
      updateMessageReactions(data.messageId, data.reactions);
    };

    socket.on('message:new', handleNewMessage);
    socket.on('message:sent', handleMessageSent);
    socket.on('message:status', handleMessageStatus);
    socket.on('reaction:updated', handleReactionUpdated);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('message:sent', handleMessageSent);
      socket.off('message:status', handleMessageStatus);
      socket.off('reaction:updated', handleReactionUpdated);
    };
  }, [
    socket,
    conversationId,
    addMessage,
    replaceMessage,
    updateMessageStatus,
    updateMessageReactions,
    updateConversationLastMessage,
  ]);

  // ── Send message with optimistic update ─────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      if (!user || !conversationId) return;

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const tempMessage: Message = {
        messageId: tempId,
        conversationId,
        senderId: user.userId,
        text,
        timestamp: Date.now(),
        status: 'sending',
      };

      addMessage(conversationId, tempMessage);

      socket?.emit('message:send', {
        conversationId,
        text,
        senderId: user.userId,
        tempId,
      });
    },
    [user, conversationId, socket, addMessage]
  );

  return {
    messages,
    isLoading,
    isLoadingMore,
    hasMore,
    sendMessage,
    loadMore,
  };
}
