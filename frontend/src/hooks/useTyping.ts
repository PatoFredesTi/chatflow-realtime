import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { wsService } from '../services/websocket';

export const useTyping = (conversationId: string | null) => {
  const { user } = useAuthStore();
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Configurar listeners de WebSocket
  useEffect(() => {
    if (!conversationId) return;

    const handleTypingStart = (data: { userId: string; username: string }) => {
      // No mostrar cuando el usuario actual está escribiendo
      if (data.userId !== user?.userId) {
        setTypingUsers((prev) => {
          if (prev.includes(data.username)) return prev;
          return [...prev, data.username];
        });
      }
    };

    const handleTypingStop = (data: { userId: string }) => {
      if (data.userId !== user?.userId) {
        setTypingUsers((prev) => prev.filter((_, index) => index !== 0));
      }
    };

    wsService.onTypingStart(handleTypingStart);
    wsService.onTypingStop(handleTypingStop);

    return () => {
      // Cleanup si es necesario
    };
  }, [conversationId, user?.userId]);

  // Notificar que el usuario está escribiendo
  const startTyping = useCallback(() => {
    if (!conversationId || !user) return;

    setIsTyping(true);
    wsService.startTyping(conversationId, user.userId, user.username);
  }, [conversationId, user]);

  // Notificar que el usuario dejó de escribir
  const stopTyping = useCallback(() => {
    if (!conversationId || !user) return;

    setIsTyping(false);
    wsService.stopTyping(conversationId, user.userId);
  }, [conversationId, user]);

  // Auto-stop después de 3 segundos de inactividad
  useEffect(() => {
    if (!isTyping) return;

    const timeout = setTimeout(() => {
      stopTyping();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isTyping, stopTyping]);

  return {
    isTyping,
    typingUsers,
    startTyping,
    stopTyping,
  };
};