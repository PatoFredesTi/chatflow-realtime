import { useState, useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { conversationAPI } from '../services/api';
import { wsService } from '../services/websocket';
import type { Message } from '../types/message.types';

export const useMessages = (conversationId: string | null) => {
  const { messages, addMessage, updateMessageStatus } = useChatStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const conversationMessages = conversationId 
    ? messages[conversationId] || [] 
    : [];

  // Cargar mensajes cuando se selecciona una conversación
  useEffect(() => {
    if (conversationId && !messages[conversationId]) {
      loadMessages(conversationId);
    }
  }, [conversationId]);

  // Configurar listeners de WebSocket
  useEffect(() => {
    if (!conversationId) return;

    // Unirse a la conversación
    wsService.joinConversation(conversationId);

    // Escuchar nuevos mensajes
    const handleNewMessage = (message: Message) => {
      if (message.conversationId === conversationId) {
        addMessage(conversationId, message);
      }
    };

    // Escuchar confirmación de mensajes enviados
    const handleMessageSent = (data: { tempId?: string; message: Message }) => {
      if (data.tempId && data.message.conversationId === conversationId) {
        // Reemplazar mensaje temporal con el real
        updateMessageStatus(data.tempId, 'sent');
      }
    };

    // Escuchar cambios de estado de mensajes
    const handleMessageStatus = (data: { messageId: string; status: Message['status'] }) => {
      updateMessageStatus(data.messageId, data.status);
    };

    wsService.onNewMessage(handleNewMessage);
    wsService.onMessageSent(handleMessageSent);
    wsService.onMessageStatus(handleMessageStatus);

    // Cleanup
    return () => {
      // No removemos los listeners aquí porque son globales
    };
  }, [conversationId]);

  const loadMessages = async (convId: string) => {
    setIsLoading(true);
    
    try {
      const response = await conversationAPI.getMessages(convId);
      
      if (response.success && response.messages) {
        // Agregar mensajes al store
        response.messages.forEach((msg: Message) => addMessage(convId, msg));
      }
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!conversationId || !user) return;

    // Generar un ID temporal único
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const tempMessage: Message = {
      messageId: tempId,
      conversationId,
      senderId: user.userId,
      text,
      timestamp: Date.now(),
      status: 'sending',
    };

    // Agregar mensaje optimísticamente
    addMessage(conversationId, tempMessage);

    // Enviar mensaje por WebSocket
    wsService.sendMessage(conversationId, text, user.userId, tempId);
  };

  const loadMoreMessages = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    
    try {
      // Aquí cargarías mensajes más antiguos con paginación
      console.log('Cargando más mensajes...');
    } catch (error) {
      console.error('Error cargando más mensajes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages: conversationMessages,
    isLoading,
    sendMessage,
    loadMoreMessages,
  };
};