import { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { Avatar } from '../common';
import { useMessages, useTyping } from '../../hooks';
import { useAuthStore } from '../../stores/authStore';

interface ChatWindowProps {
  conversationId: string;
  conversationName: string;
  isOnline?: boolean;
}

export const ChatWindow = ({ conversationId, conversationName, isOnline }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { messages, isLoading, sendMessage } = useMessages(conversationId);
  const { typingUsers } = useTyping(conversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    await sendMessage(text);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Header del chat */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar alt={conversationName} online={isOnline} />
          <div>
            <h2 className="font-semibold text-white">{conversationName}</h2>
            <p className="text-sm text-gray-400">
              {isOnline ? 'En línea' : 'Desconectado'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-white p-2 transition-colors" title="Llamada de voz">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white p-2 transition-colors" title="Videollamada">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white p-2 transition-colors" title="Más opciones">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Cargando mensajes...</div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwn = message.senderId === user?.userId;
              const showAvatar = !isOwn && (
                index === 0 || messages[index - 1].senderId !== message.senderId
              );
              
              return (
                <MessageBubble
                  key={message.messageId}
                  message={message}
                  isOwn={isOwn}
                  senderName={!isOwn ? conversationName : undefined}
                  showAvatar={showAvatar}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Indicador de escritura */}
      {typingUsers.length > 0 && (
        <TypingIndicator username={typingUsers[0]} />
      )}

      {/* Input de mensaje */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};