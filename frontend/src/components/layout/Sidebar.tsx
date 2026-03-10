import { useState } from 'react';
import { Avatar } from '../common';
import { NewConversationModal } from '../chat';
import { useConversations } from '../../hooks';
import type { Conversation } from '../../types/chat.types';

interface SidebarProps {
  onSelectChat?: (chatId: string) => void;
}

export const Sidebar = ({ onSelectChat }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { conversations, currentConversation, selectConversation, isLoading } = useConversations();

  const getConversationName = (conv: Conversation): string => {
    if (conv.name) return conv.name;
    if (conv.type === 'individual') {
      return 'Usuario';
    }
    return 'Grupo sin nombre';
  };

  const filteredConversations = conversations.filter((conv) => {
    const convName = getConversationName(conv);
    return convName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  };

  const handleSelectChat = (chatId: string) => {
    selectConversation(chatId);
    onSelectChat?.(chatId);
  };

  return (
    <aside style={{
      width: '320px',
      background: 'rgba(0, 13, 46, 0.6)',
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Header con botón nuevo chat */}
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #0055dd 0%, #0077ff 50%, #1a8cff 100%)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontWeight: 700,
            padding: '14px',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.25s ease',
            boxShadow: '0 4px 16px rgba(0, 119, 255, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 119, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 119, 255, 0.3)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nueva Conversación
        </button>
      </div>

      {/* Búsqueda */}
      <div style={{ padding: '16px' }}>
        <div style={{ position: 'relative' }}>
          <svg
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: 'rgba(255,255,255,0.4)',
              pointerEvents: 'none'
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '10px 14px 10px 40px',
              color: 'white',
              fontSize: '13px',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.12)';
              e.target.style.borderColor = 'var(--msn-blue-bright)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.08)';
              e.target.style.borderColor = 'rgba(255,255,255,0.12)';
            }}
          />
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Cargando...</div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
              No tienes conversaciones
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
              Inicia una nueva para empezar
            </div>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const convName = getConversationName(conv);
            const lastMessage = conv.lastMessage?.text || 'No hay mensajes';
            const isSelected = currentConversation === conv.conversationId;
            
            return (
              <button
                key={conv.conversationId}
                onClick={() => handleSelectChat(conv.conversationId)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: isSelected ? 'rgba(26, 140, 255, 0.15)' : 'transparent',
                  border: 'none',
                  borderLeft: `3px solid ${isSelected ? 'var(--msn-blue-bright)' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Avatar alt={convName} online={false} size="md" />
                
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h3 style={{
                      fontWeight: 600,
                      color: 'white',
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {convName}
                    </h3>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', flexShrink: 0, marginLeft: '8px' }}>
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.5)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {lastMessage}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Modal de nueva conversación */}
      <NewConversationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </aside>
  );
};