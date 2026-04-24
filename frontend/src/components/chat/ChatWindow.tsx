import { useRef, useEffect, useLayoutEffect, useCallback, useState, useMemo } from 'react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { Avatar } from '../common';
import { useMessages, useTyping } from '../../hooks';
import { useAuthStore } from '../../stores/authStore';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatWindowProps {
  conversationId: string;
  conversationName: string;
  isOnline?: boolean;
  lastSeen?: number;
}

export const ChatWindow = ({ conversationId, conversationName, isOnline, lastSeen }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const loadingMoreRef = useRef(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const { user } = useAuthStore();
  const { messages, isLoading, isLoadingMore, hasMore, sendMessage, loadMoreMessages, toggleReaction } = useMessages(conversationId);
  const { typingUsers, startTyping, stopTyping } = useTyping(conversationId);

  const presenceText = isOnline
    ? 'En línea'
    : lastSeen
    ? `Última vez ${formatDistanceToNow(new Date(lastSeen), { addSuffix: true, locale: es })}`
    : 'Desconectado';

  // Restaurar posición de scroll después de prepend
  useLayoutEffect(() => {
    if (loadingMoreRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight - prevScrollHeightRef.current;
      loadingMoreRef.current = false;
    }
  }, [messages]);

  // Scroll al fondo solo en carga inicial o mensaje nuevo propio
  useEffect(() => {
    if (!loadingMoreRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Computar matches de búsqueda
  const matchingIds = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return messages.filter((m) => m.text.toLowerCase().includes(q)).map((m) => m.messageId);
  }, [messages, searchQuery]);

  const currentMatchId = matchingIds[currentMatchIndex] ?? null;

  // Resetear búsqueda al cambiar conversación
  useEffect(() => {
    setShowSearch(false);
    setSearchQuery('');
    setCurrentMatchIndex(0);
  }, [conversationId]);

  // Enfocar input al abrir búsqueda
  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

  // Scroll al match actual
  useEffect(() => {
    if (currentMatchId) {
      document.getElementById(`msg-${currentMatchId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentMatchId]);

  const goToPrevMatch = () => {
    setCurrentMatchIndex((i) => (i - 1 + matchingIds.length) % matchingIds.length);
  };

  const goToNextMatch = () => {
    setCurrentMatchIndex((i) => (i + 1) % matchingIds.length);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') goToNextMatch();
    if (e.key === 'Escape') { setShowSearch(false); setSearchQuery(''); }
  };

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isLoadingMore || !hasMore) return;
    if (container.scrollTop <= 60) {
      prevScrollHeightRef.current = container.scrollHeight;
      loadingMoreRef.current = true;
      loadMoreMessages();
    }
  }, [isLoadingMore, hasMore, loadMoreMessages]);

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
                {presenceText}
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
            title="Buscar en la conversación"
            onClick={() => { setShowSearch((v) => !v); setSearchQuery(''); setCurrentMatchIndex(0); }}
            style={{
              background: showSearch ? 'rgba(0, 119, 255, 0.25)' : 'rgba(255,255,255,0.1)',
              border: `1px solid ${showSearch ? 'rgba(0,119,255,0.5)' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: '8px',
              color: showSearch ? 'white' : 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = showSearch ? 'rgba(0,119,255,0.25)' : 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = showSearch ? 'white' : 'rgba(255,255,255,0.7)';
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      {showSearch && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: 'rgba(0,0,0,0.2)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar en la conversación..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentMatchIndex(0); }}
              onKeyDown={handleSearchKeyDown}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '8px 12px 8px 32px',
                color: 'white',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {matchingIds.length > 0 && (
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
              {currentMatchIndex + 1} / {matchingIds.length}
            </span>
          )}
          {searchQuery && matchingIds.length === 0 && (
            <span style={{ fontSize: '12px', color: 'rgba(255,100,100,0.8)', whiteSpace: 'nowrap' }}>
              Sin resultados
            </span>
          )}

          <button onClick={goToPrevMatch} disabled={matchingIds.length === 0} title="Anterior" style={{ background: 'none', border: 'none', color: matchingIds.length > 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', cursor: matchingIds.length > 0 ? 'pointer' : 'default', padding: '4px' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          </button>
          <button onClick={goToNextMatch} disabled={matchingIds.length === 0} title="Siguiente" style={{ background: 'none', border: 'none', color: matchingIds.length > 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', cursor: matchingIds.length > 0 ? 'pointer' : 'default', padding: '4px' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} title="Cerrar" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* Área de mensajes */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{
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
        }}
      >
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
            {isLoadingMore && (
              <div style={{
                textAlign: 'center',
                padding: '8px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.4)',
              }}>
                Cargando mensajes anteriores...
              </div>
            )}
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
                  currentUserId={user?.userId || ''}
                  senderName={!isOwn ? conversationName : undefined}
                  showAvatar={showAvatar}
                  onToggleReaction={toggleReaction}
                  highlight={searchQuery.trim() || undefined}
                  isCurrentMatch={message.messageId === currentMatchId}
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
      <MessageInput
        onSendMessage={handleSendMessage}
        onStartTyping={startTyping}
        onStopTyping={stopTyping}
      />
    </div>
  );
};