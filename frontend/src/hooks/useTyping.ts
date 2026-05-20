// hooks/useTyping.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocketStore } from '../stores/socketStore';
import { useAuthStore } from '../stores/authStore';

interface TypingPayload {
  userId: string;
  username: string;
}

export function useTyping(conversationId: string) {
  const socket = useSocketStore((s) => s.socket);
  const { user } = useAuthStore();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // Listen for others typing
  useEffect(() => {
    if (!socket) return;

    const handleStart = (payload: TypingPayload) => {
      setTypingUsers((prev) =>
        prev.includes(payload.username) ? prev : [...prev, payload.username]
      );
    };

    const handleStop = (payload: { userId: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== payload.userId));
    };

    socket.on('typing:start', handleStart);
    socket.on('typing:stop', handleStop);

    return () => {
      socket.off('typing:start', handleStart);
      socket.off('typing:stop', handleStop);
    };
  }, [socket]);

  const notifyTyping = useCallback(() => {
    if (!socket || !user) return;

    if (!isTypingRef.current) {
      socket.emit('typing:start', {
        conversationId,
        userId: user.userId,
        username: user.username,
      });
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', { conversationId, userId: user.userId });
      isTypingRef.current = false;
    }, 2000);
  }, [socket, user, conversationId]);

  return { typingUsers, notifyTyping };
}
