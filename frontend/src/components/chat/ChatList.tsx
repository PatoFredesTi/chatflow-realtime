// components/chat/ChatList.tsx
import { Avatar } from '../common';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Conversation } from '../../types/chat.types';

interface Props {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export const ChatList = ({ conversations, activeConversationId, onSelectConversation }: Props) => {
  if (conversations.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '13px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '32px', opacity: 0.3, marginBottom: '8px' }}>💭</div>
        <p style={{ margin: 0 }}>No hay conversaciones aún</p>
        <p style={{ margin: '4px 0 0', fontSize: '11px' }}>Crea una nueva para empezar</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {conversations.map((conv) => {
        const isActive = conv.conversationId === activeConversationId;
        const displayName = conv.displayName ?? conv.name ?? 'Conversación';

        return (
          <button
            key={conv.conversationId}
            onClick={() => onSelectConversation(conv.conversationId)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              background: isActive
                ? 'linear-gradient(90deg, rgba(26,140,255,0.2) 0%, rgba(26,140,255,0.05) 100%)'
                : 'transparent',
              borderLeft: isActive ? '3px solid var(--msn-blue-bright)' : '3px solid transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s ease',
              width: '100%',
              color: 'inherit',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
          >
            <Avatar alt={displayName} online={conv.isOnline} size="md" />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '2px',
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: 'white',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {displayName}
                </span>
                {conv.lastMessageAt > 0 && (
                  <span
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.4)',
                      flexShrink: 0,
                      marginLeft: '8px',
                    }}
                  >
                    {formatDistanceToNow(new Date(conv.lastMessageAt), {
                      addSuffix: false,
                      locale: es,
                    })}
                  </span>
                )}
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {conv.lastMessage?.text ?? 'Inicia la conversación...'}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
