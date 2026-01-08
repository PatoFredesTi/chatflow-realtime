import { useState, useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';
import type { Message } from '../types/message.types';

export const useMessages = (conversationId: string | null) => {
  const { messages, addMessage, updateMessageStatus } = useChatStore();
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

  const loadMessages = async (convId: string) => {
    setIsLoading(true);
    
    try {
      // Simulación de carga de mensajes (después será API real)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mensajes mock
      const mockMessages: Message[] = [
        {
          messageId: '1',
          conversationId: convId,
          senderId: 'user2',
          text: '¡Hola! ¿Cómo estás?',
          timestamp: Date.now() - 1000 * 60 * 10,
          status: 'read',
        },
        {
          messageId: '2',
          conversationId: convId,
          senderId: 'currentUser',
          text: '¡Muy bien! ¿Y tú?',
          timestamp: Date.now() - 1000 * 60 * 9,
          status: 'read',
        },
        {
          messageId: '3',
          conversationId: convId,
          senderId: 'user2',
          text: 'Genial, trabajando en el proyecto',
          timestamp: Date.now() - 1000 * 60 * 8,
          status: 'read',
        },
      ];

      // Agregar mensajes al store
      mockMessages.forEach((msg) => addMessage(convId, msg));
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!conversationId) return;

    // Generar un ID único
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const tempMessage: Message = {
      messageId,
      conversationId,
      senderId: 'currentUser',
      text,
      timestamp: Date.now(),
      status: 'sending',
    };

    // Agregar mensaje optimísticamente
    addMessage(conversationId, tempMessage);

    try {
      // Simulación de envío (después será WebSocket)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Actualizar estado a 'sent'
      updateMessageStatus(messageId, 'sent');

      // Simular 'delivered' después de un momento
      setTimeout(() => {
        updateMessageStatus(messageId, 'delivered');
      }, 600);

      // Simular 'read' después de otro momento
      setTimeout(() => {
        updateMessageStatus(messageId, 'read');
      }, 1200);

    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  const loadMoreMessages = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    
    try {
      // Simulación de carga de más mensajes
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Aquí cargarías mensajes más antiguos
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