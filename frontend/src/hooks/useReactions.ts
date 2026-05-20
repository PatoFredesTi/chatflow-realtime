// hooks/useReactions.ts
import { useCallback } from 'react';
import { useSocketStore } from '../stores/socketStore';

export function useReactions(conversationId: string) {
  const socket = useSocketStore((s) => s.socket);

  const toggleReaction = useCallback(
    (messageId: string, emoji: string, userId: string) => {
      socket?.emit('reaction:toggle', {
        messageId,
        conversationId,
        emoji,
        userId,
      });
    },
    [socket, conversationId]
  );

  return { toggleReaction };
}
