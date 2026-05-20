// components/chat/ChatWindow.tsx
import { useRef, useEffect, useCallback } from 'react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { NudgeOverlay } from './NudgeOverlay';
import { Avatar } from '../common';
import { useInfiniteMessages, useTyping } from '../../hooks';
import { useAuthStore } from '../../stores/authStore';

interface Props {
  conversationId: string;
  conversationName: string;
  isOnline?: boolean;
}

export const ChatWindow = ({ conversationId, conversationName, isOnline }: Props) => {
  const { user } = useAuthStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const isFirstLoad = useRef(true);

  const { messages, isLoading, isLoadingMore, hasMore, sendMessage, loadMore } =
    useInfiniteMessages(conversationId);

  const { typingUsers } = useTyping(conversationId);

  // Reset first-load state when changing conversations
  useEffect(() => {
    isFirstLoad.current = true;
  }, [conversationId]);

  // Scroll to bottom on new messages (if user is near bottom)
  useEffect(() => {
    if (isFirstLoad.current && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
      isFirstLoad.current = false;
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceFromBottom < 120) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // RF-009: preserve scroll position on prepend
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isLoadingMore) return;
    prevScrollHeightRef.current = container.scrollHeight;
  }, [isLoadingMore]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isLoadingMore) return;
    if (prevScrollHeightRef.current > 0) {
      container.scrollTop += container.scrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = 0;
    }
  }, [messages, isLoadingMore]);

  // RF-009: trigger loadMore on scroll-to-top
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isLoadingMore || !hasMore) return;
    if (container.scrollTop <= 80) loadMore();
  }, [isLoadingMore, hasMore, loadMore]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <NudgeOverlay conversationId={conversationId}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(0, 13, 46, 0.4)',
          height: '100%',
        }}
      >
        {/* Header */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(0, 80, 208, 0.5) 0%, rgba(26, 140, 255, 0.3) 50%, rgba(0, 51, 153, 0.4) 100%)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0,
          }}
        >
          <Avatar alt={conversationName} online={isOnline} size="md" />
          <div>
            <h2 style={{ fontWeight: 600, color: 'white', fontSize: '16px', margin: 0, marginBottom: '2px' }}>
              {conversationName}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isOnline && (
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    background: 'var(--msn-green)',
                    borderRadius: '50%',
                    boxShadow: '0 0 6px var(--msn-green-glow)',
                  }}
                />
              )}
              <p
                style={{
                  fontSize: '12px',
                  margin: 0,
                  color: isOnline ? 'var(--msn-green)' : 'rgba(255,255,255,0.5)',
                }}
              >
                {isOnline ? 'En línea' : 'Desconectado'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            background: 'rgba(0, 13, 46, 0.2)',
          }}
        >
          {isLoadingMore && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{ animation: 'spin 1s linear infinite' }}
                >
                  <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
                  <circle cx="6" cy="6" r="4.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="16 10" strokeLinecap="round" />
                </svg>
                Cargando mensajes anteriores...
              </div>
            </div>
          )}

          {!hasMore && messages.length > 0 && !isLoadingMore && (
            <div style={{ textAlign: 'center', padding: '8px 0 16px', fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
              · Inicio de la conversación ·
            </div>
          )}

          {isLoading && messages.length === 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '14px',
              }}
            >
              Cargando mensajes...
            </div>
          ) : messages.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '48px', opacity: 0.3 }}>💬</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
                No hay mensajes aún
              </p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: 0 }}>
                Envía el primer mensaje — o un 📳 para empezar con estilo
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const isOwn = message.senderId === user?.userId;
                const showAvatar =
                  !isOwn && (index === 0 || messages[index - 1].senderId !== message.senderId);
                return (
                  <MessageBubble
                    key={message.messageId}
                    message={message}
                    isOwn={isOwn}
                    currentUserId={user?.userId ?? ''}
                    conversationId={conversationId}
                    senderName={!isOwn ? conversationName : undefined}
                    showAvatar={showAvatar}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {typingUsers.length > 0 && <TypingIndicator username={typingUsers[0]} />}

        <MessageInput onSendMessage={sendMessage} conversationId={conversationId} />
      </div>
    </NudgeOverlay>
  );
};
