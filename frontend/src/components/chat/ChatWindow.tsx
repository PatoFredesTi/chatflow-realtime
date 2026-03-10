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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0, 13, 46, 0.4)' }}>
      {/* Header del chat */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 80, 208, 0.5) 0%, rgba(26, 140, 255, 0.3) 50%, rgba(0, 51, 153, 0.4) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar alt={conversationName} online={isOnline} size="md" />
          <div>
            <h2 style={{ fontWeight: 600, color: 'white', fontSize: '16px', marginBottom: '2px' }}>
              {conversationName}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isOnline && (
                <div style={{
                  width: '6px',
                  height: '6px',
                  background: 'var(--msn-green)',
                  borderRadius: '50%',
                  boxShadow: '0 0 6px var(--msn-green)'
                }}></div>
              )}
              <p style={{ fontSize: '12px', color: isOnline ? 'var(--msn-green)' : 'rgba(255,255,255,0.5)' }}>
                {isOnline ? 'En línea' : 'Desconectado'}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            title="Llamada de voz"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button 
            title="Videollamada"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button 
            title="Más opciones"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Área de mensajes */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        background: 'rgba(0, 13, 46, 0.2)',
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.02) 2px,
            rgba(0,0,0,0.02) 4px
          )
        `
      }}>
        {isLoading && messages.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '14px'
          }}>
            Cargando mensajes...
          </div>
        ) : messages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '12px'
          }}>
            <div style={{ fontSize: '48px', opacity: 0.3 }}>💬</div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
              No hay mensajes aún
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
              Envía el primer mensaje para iniciar la conversación
            </p>
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