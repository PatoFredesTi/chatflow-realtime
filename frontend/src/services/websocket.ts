import { io, Socket } from 'socket.io-client';
import type { Message } from '../types/message.types';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

class WebSocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string) {
    if (this.socket?.connected) {
      console.log('Ya hay una conexión activa');
      return;
    }

    this.userId = userId;
    this.socket = io(WS_URL);

    this.socket.on('connect', () => {
      console.log('✅ Conectado al servidor WebSocket');
      this.socket?.emit('authenticate', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado del servidor WebSocket');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  // Unirse a una conversación
  joinConversation(conversationId: string) {
    this.socket?.emit('join:conversation', conversationId);
  }

  // Enviar mensaje
  sendMessage(conversationId: string, text: string, senderId: string, tempId?: string) {
    this.socket?.emit('message:send', {
      conversationId,
      text,
      senderId,
      tempId,
    });
  }

  // Escuchar nuevos mensajes
  onNewMessage(callback: (message: Message) => void) {
    this.socket?.on('message:new', callback);
  }

  // Escuchar confirmación de mensaje enviado
  onMessageSent(callback: (data: { tempId?: string; message: Message }) => void) {
    this.socket?.on('message:sent', callback);
  }

  // Escuchar cambios de estado de mensaje
  onMessageStatus(callback: (data: { messageId: string; status: Message['status'] }) => void) {
    this.socket?.on('message:status', callback);
  }

  // Notificar que está escribiendo
  startTyping(conversationId: string, userId: string, username: string) {
    this.socket?.emit('typing:start', { conversationId, userId, username });
  }

  // Notificar que dejó de escribir
  stopTyping(conversationId: string, userId: string) {
    this.socket?.emit('typing:stop', { conversationId, userId });
  }

  // Escuchar cuando alguien está escribiendo
  onTypingStart(callback: (data: { userId: string; username: string }) => void) {
    this.socket?.on('typing:start', callback);
  }

  onTypingStop(callback: (data: { userId: string }) => void) {
    this.socket?.on('typing:stop', callback);
  }

  // Marcar mensaje como entregado
  markAsDelivered(messageId: string, conversationId: string) {
    this.socket?.emit('message:delivered', { messageId, conversationId });
  }

  // Marcar mensaje como leído
  markAsRead(messageId: string, conversationId: string) {
    this.socket?.emit('message:read', { messageId, conversationId });
  }

  // Escuchar cambios de estado de usuarios
  onUserStatus(callback: (data: { userId: string; status: 'online' | 'offline' }) => void) {
    this.socket?.on('user:status', callback);
  }

  offNewMessage(callback: (message: Message) => void) {
    this.socket?.off('message:new', callback);
  }

  offMessageSent(callback: (data: { tempId?: string; message: Message }) => void) {
    this.socket?.off('message:sent', callback);
  }

  offMessageStatus(callback: (data: { messageId: string; status: Message['status'] }) => void) {
    this.socket?.off('message:status', callback);
  }

  // Enviar reacción (toggle)
  toggleReaction(messageId: string, conversationId: string, emoji: string, userId: string) {
    this.socket?.emit('reaction:toggle', { messageId, conversationId, emoji, userId });
  }

  // Escuchar actualizaciones de reacciones
  onReactionUpdated(callback: (data: { messageId: string; reactions: { [emoji: string]: string[] } }) => void) {
    this.socket?.on('reaction:updated', callback);
  }

  offReactionUpdated(callback: (data: { messageId: string; reactions: { [emoji: string]: string[] } }) => void) {
    this.socket?.off('reaction:updated', callback);
  }

  // Limpiar todos los listeners
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export const wsService = new WebSocketService();