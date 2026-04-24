import { useState, useRef } from 'react';
import type { Message } from '../../types/message.types';
import { Avatar } from '../common';
import { ReactionBadge } from './ReactionBadge';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢'];

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  currentUserId: string;
  senderName?: string;
  showAvatar?: boolean;
  onToggleReaction: (messageId: string, emoji: string) => void;
}

export const MessageBubble = ({
  message,
  isOwn,
  currentUserId,
  senderName,
  showAvatar,
  onToggleReaction,
}: MessageBubbleProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setShowPicker(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => setShowPicker(false), 350);
  };

  const formatTime = (timestamp: number) =>
    formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: es });

  const hasReactions = message.reactions && Object.keys(message.reactions).length > 0;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
        gap: '8px',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {!isOwn && (
        <div style={{ width: '32px', flexShrink: 0 }}>
          {showAvatar && <Avatar alt={senderName || 'Usuario'} size="sm" />}
        </div>
      )}

      <div
        style={{
          maxWidth: '65%',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {!isOwn && senderName && showAvatar && (
          <span
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.5)',
              paddingLeft: '12px',
              fontWeight: 500,
            }}
          >
            {senderName}
          </span>
        )}

        {/* Bubble + picker wrapper */}
        <div
          style={{ position: 'relative' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Emoji picker */}
          {showPicker && (
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                position: 'absolute',
                [isOwn ? 'right' : 'left']: 0,
                bottom: 'calc(100% + 6px)',
                display: 'flex',
                gap: '4px',
                background: 'rgba(30,30,40,0.95)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '20px',
                padding: '6px 10px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                zIndex: 10,
              }}
            >
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onToggleReaction(message.messageId, emoji);
                    setShowPicker(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '2px 4px',
                    borderRadius: '8px',
                    transition: 'transform 0.1s ease',
                    lineHeight: 1,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Message bubble */}
          <div
            style={{
              position: 'relative',
              padding: '12px 16px',
              borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: isOwn
                ? 'linear-gradient(135deg, #0055dd 0%, #0077ff 100%)'
                : 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isOwn ? 'rgba(0, 119, 255, 0.3)' : 'rgba(255,255,255,0.1)'}`,
              boxShadow: isOwn
                ? '0 4px 12px rgba(0, 119, 255, 0.2)'
                : '0 2px 8px rgba(0,0,0,0.1)',
              wordBreak: 'break-word',
            }}
          >
            <p style={{ color: 'white', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
              {message.text}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '6px',
                fontSize: '10px',
                color: isOwn ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
              }}
            >
              <span>{formatTime(message.timestamp)}</span>

              {isOwn && (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {message.status === 'sending' && '⏱'}
                  {message.status === 'sent' && '✓'}
                  {message.status === 'delivered' && '✓✓'}
                  {message.status === 'read' && (
                    <span style={{ color: 'var(--msn-blue-sky)' }}>✓✓</span>
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Reaction badges */}
          {hasReactions && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                marginTop: '4px',
                justifyContent: isOwn ? 'flex-end' : 'flex-start',
              }}
            >
              {Object.entries(message.reactions!).map(([emoji, userIds]) => (
                <ReactionBadge
                  key={emoji}
                  emoji={emoji}
                  userIds={userIds}
                  userId={currentUserId}
                  onToggle={(e) => onToggleReaction(message.messageId, e)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
