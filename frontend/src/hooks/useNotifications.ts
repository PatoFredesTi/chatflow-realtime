import { useEffect, useCallback } from 'react';
import { wsService } from '../services/websocket';
import { useAuthStore } from '../stores/authStore';
import type { Conversation } from '../types/chat.types';
import type { Message } from '../types/message.types';

export const useNotifications = (
  conversations: Conversation[],
  onNotificationClick: (conversationId: string) => void
) => {
  const { user } = useAuthStore();

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleNewMessage = useCallback(
    (message: Message) => {
      if (
        message.senderId === user?.userId ||
        !document.hidden ||
        !('Notification' in window) ||
        Notification.permission !== 'granted'
      ) return;

      const conv = conversations.find((c) => c.conversationId === message.conversationId);
      const title = conv?.name || 'Nuevo mensaje';
      const body = message.text.length > 80 ? message.text.slice(0, 80) + '…' : message.text;

      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: message.conversationId,
      });

      notification.onclick = () => {
        window.focus();
        onNotificationClick(message.conversationId);
        notification.close();
      };
    },
    [user?.userId, conversations, onNotificationClick]
  );

  useEffect(() => {
    wsService.onNewMessage(handleNewMessage);
    return () => wsService.offNewMessage(handleNewMessage);
  }, [handleNewMessage]);
};
