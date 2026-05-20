// components/chat/MessageBubble.tsx
import { useState } from 'react';
import { Avatar } from '../common';
import { MessageStatusIcon } from './MessageStatus';
import { ReactionPicker } from './ReactionPicker';
import { ReactionBadge } from './ReactionBadge';
import { useReactions } from '../../hooks';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Message } from '../../types/message.types';

interface Props {
  message: Message;
  isOwn: boolean;
  currentUserId: string;
  conversationId: string;
  senderName?: string;
  showAvatar?: boolean;
}

export const MessageBubble = ({
  message,
  isOwn,
  currentUserId,
  conversationId,
  senderName,
  showAvatar = true,
}: Props) => {
  const [showPicker, setShowPicker] = useState(false);
  const { toggleReaction } = useReactions(conversationId);

  const formatTime = (timestamp: number) =>
    formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: es });

  const handleReact = (emoji: string) => {
    toggleReaction(message.messageId, emoji, currentUserId);
    setShowPicker(false);
  };

  const reactions = Object.entries(message.reactions ?? {}).filter(
    ([, users]) => users.length > 0
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: '8px',
        marginBottom: reactions.length > 0 ? '20px' : '12px',
      }}
    >
      {!isOwn && (
        <div style={{ width: '32px', flexShrink: 0 }}>
          {showAvatar && <Avatar alt={senderName || 'Usuario'} size="sm" />}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOwn ? 'flex-end' : 'flex-start',
          maxWidth: '70%',
          position: 'relative',
        }}
      >
        {!isOwn && senderName && showAvatar && (
          <span
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '3px',
              paddingLeft: '4px',
            }}
          >
            {senderName}
          </span>
        )}

        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setShowPicker(true)}
          onMouseLeave={() => setShowPicker(false)}
        >
          {showPicker && <ReactionPicker onReact={handleReact} isOwn={isOwn} />}

          <div
            style={{
              padding: '10px 14px',
              borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: isOwn
                ? 'linear-gradient(135deg, #0055dd 0%, #0077ff 100%)'
                : 'rgba(255,255,255,0.1)',
              border: isOwn ? 'none' : '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '14px',
              lineHeight: '1.45',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              boxShadow: isOwn
                ? '0 2px 12px rgba(0, 119, 255, 0.25)'
                : '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            {message.text}
          </div>
        </div>

        {reactions.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px',
              marginTop: '4px',
              paddingLeft: isOwn ? 0 : '2px',
              paddingRight: isOwn ? '2px' : 0,
            }}
          >
            {reactions.map(([emoji, userIds]) => (
              <ReactionBadge
                key={emoji}
                emoji={emoji}
                userIds={userIds}
                currentUserId={currentUserId}
                onClick={() => toggleReaction(message.messageId, emoji, currentUserId)}
              />
            ))}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '4px',
            flexDirection: isOwn ? 'row' : 'row-reverse',
            paddingRight: isOwn ? '2px' : 0,
            paddingLeft: isOwn ? 0 : '2px',
          }}
        >
          {isOwn && <MessageStatusIcon status={message.status} />}
          <span
            style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.35)',
              userSelect: 'none',
            }}
          >
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};
