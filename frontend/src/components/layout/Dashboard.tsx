// components/layout/Dashboard.tsx
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatWindow } from '../chat/ChatWindow';
import { useConversations } from '../../hooks';

export const Dashboard = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { conversations, isLoading, createConversation } = useConversations();

  const activeConversation = conversations.find((c) => c.conversationId === activeId);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      <Sidebar
        conversations={conversations}
        activeConversationId={activeId}
        onSelectConversation={setActiveId}
        onCreateConversation={createConversation}
      />

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {activeConversation ? (
          <ChatWindow
            key={activeConversation.conversationId}
            conversationId={activeConversation.conversationId}
            conversationName={activeConversation.displayName ?? activeConversation.name ?? 'Chat'}
            isOnline={activeConversation.isOnline}
          />
        ) : (
          <EmptyState isLoading={isLoading} hasConversations={conversations.length > 0} />
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ isLoading, hasConversations }: { isLoading: boolean; hasConversations: boolean }) => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      background: 'rgba(0, 13, 46, 0.3)',
      padding: '32px',
    }}
  >
    <div style={{ fontSize: '64px', opacity: 0.3 }}>💬</div>
    <h2 style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '20px', fontWeight: 600 }}>
      ChatFlow
    </h2>
    <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '14px', textAlign: 'center', maxWidth: '320px' }}>
      {isLoading
        ? 'Cargando conversaciones...'
        : hasConversations
        ? 'Selecciona una conversación de la lista para empezar a chatear'
        : 'Crea tu primera conversación con el botón "Nueva conversación"'}
    </p>
  </div>
);
