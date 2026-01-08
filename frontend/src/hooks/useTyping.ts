import { useState, useEffect, useCallback } from 'react';

export const useTyping = (conversationId: string | null) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Notificar que el usuario está escribiendo
  const startTyping = useCallback(() => {
    if (!conversationId) return;

    setIsTyping(true);
    
    // Aquí enviarías el evento por WebSocket
    console.log('Usuario empezó a escribir en', conversationId);
  }, [conversationId]);

  // Notificar que el usuario dejó de escribir
  const stopTyping = useCallback(() => {
    if (!conversationId) return;

    setIsTyping(false);
    
    // Aquí enviarías el evento por WebSocket
    console.log('Usuario dejó de escribir en', conversationId);
  }, [conversationId]);

  // Auto-stop después de 3 segundos de inactividad
  useEffect(() => {
    if (!isTyping) return;

    const timeout = setTimeout(() => {
      stopTyping();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isTyping, stopTyping]);

  // Simular usuarios escribiendo (esto vendrá de WebSocket)
 const addTypingUser = (username: string) => {
  setTypingUsers((prev) => {
    if (prev.includes(username)) return prev;
    return [...prev, username];
  });

  // Auto-remover después de 3 segundos
  setTimeout(() => {
    removeTypingUser(username);
  }, 3000);
};

  const removeTypingUser = (username: string) => {
    setTypingUsers((prev) => prev.filter((user) => user !== username));
  };

  return {
    isTyping,
    typingUsers,
    startTyping,
    stopTyping,
    addTypingUser,
    removeTypingUser,
  };
};