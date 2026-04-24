import { useState, useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { conversationAPI } from '../services/api';
import { wsService } from '../services/websocket';
import type { Conversation } from '../types/chat.types';

export const useConversations = () => {
  const { conversations, setConversations, currentConversation, setCurrentConversation, setUserPresence, setUsersOnline } = useChatStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar conversaciones al iniciar
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // Suscribirse a eventos de presencia
  useEffect(() => {
    wsService.onPresenceInitial((userIds) => setUsersOnline(userIds));

    const handleStatus = (data: { userId: string; status: 'online' | 'offline'; lastSeen?: number }) => {
      setUserPresence(data.userId, data.status, data.lastSeen);
    };
    wsService.onUserStatus(handleStatus);

    return () => wsService.offUserStatus(handleStatus);
  }, []);

  // Escuchar nuevos mensajes para actualizar "último mensaje"
  useEffect(() => {
    const handleNewMessage = (message: any) => {
      setConversations(
        conversations.map((conv) =>
          conv.conversationId === message.conversationId
            ? {
                ...conv,
                lastMessage: {
                  text: message.text,
                  senderId: message.senderId,
                  timestamp: message.timestamp,
                },
                lastMessageAt: message.timestamp,
              }
            : conv
        )
      );
    };

    wsService.onNewMessage(handleNewMessage);
  }, [conversations]);

  const loadConversations = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await conversationAPI.getUserConversations(user.userId);
      
      if (response.success && response.conversations) {
        setConversations(response.conversations);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar conversaciones';
      setError(errorMessage);
      console.error('Error cargando conversaciones:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createConversation = async (participantIds: string[], type: 'individual' | 'group' = 'individual') => {
    if (!user) return null;

    try {
      const response = await conversationAPI.createConversation([user.userId, ...participantIds], type);
      
      if (response.success && response.conversation) {
        setConversations([...conversations, response.conversation]);
        return response.conversation;
      }
    } catch (err) {
      console.error('Error creando conversación:', err);
    }

    return null;
  };

  const selectConversation = (conversationId: string) => {
    setCurrentConversation(conversationId);
  };

  return {
    conversations,
    currentConversation,
    isLoading,
    error,
    loadConversations,
    createConversation,
    selectConversation,
  };
};