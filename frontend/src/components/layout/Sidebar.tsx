// components/layout/Sidebar.tsx
import { useState } from 'react';
import { Header } from './Header';
import { ChatList } from '../chat/ChatList';
import { NewConversationModal } from '../chat/NewConversationModal';
import type { Conversation } from '../../types/chat.types';

interface Props {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateConversation: (
    participantIds: string[],
    type: 'individual' | 'group',
    name?: string
  ) => Promise<Conversation | null>;
}

export const Sidebar = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = searchQuery.trim()
    ? conversations.filter((c) =>
        (c.displayName ?? c.name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  const handleCreate = async (
    participantIds: string[],
    type: 'individual' | 'group',
    name?: string
  ) => {
    const conv = await onCreateConversation(participantIds, type, name);
    if (conv) onSelectConversation(conv.conversationId);
  };

  return (
    <div
      style={{
        width: '320px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(0, 13, 46, 0.5)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }}
    >
      <Header />

      {/* New conversation + search */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 14px',
            background: 'linear-gradient(135deg, #0055dd 0%, #0077ff 100%)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 119, 255, 0.3)',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <span style={{ fontSize: '16px' }}>+</span>
          Nueva conversación
        </button>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar chats..."
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '12px',
            outline: 'none',
          }}
        />
      </div>

      {/* Chat list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <ChatList
          conversations={filtered}
          activeConversationId={activeConversationId}
          onSelectConversation={onSelectConversation}
        />
      </div>

      {showModal && (
        <NewConversationModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};
