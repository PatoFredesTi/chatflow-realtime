import type { Message } from '../../types/message.types';
import { Avatar } from '../common';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName?: string;
  showAvatar?: boolean;
}

export const MessageBubble = ({ message, isOwn, senderName, showAvatar }: MessageBubbleProps) => {
  const formatTime = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true, 
      locale: es 
    });
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: isOwn ? 'flex-end' : 'flex-start',
      marginBottom: '16px',
      gap: '8px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {!isOwn && (
        <div style={{ width: '32px', flexShrink: 0 }}>
          {showAvatar && <Avatar alt={senderName || 'Usuario'} size="sm" />}
        </div>
      )}

      <div style={{
        maxWidth: '65%',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {!isOwn && senderName && showAvatar && (
          <span style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            paddingLeft: '12px',
            fontWeight: 500
          }}>
            {senderName}
          </span>
        )}

        <div style={{
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
          wordBreak: 'break-word'
        }}>
          <p style={{
            color: 'white',
            fontSize: '14px',
            lineHeight: 1.5,
            margin: 0
          }}>
            {message.text}
          </p>

          {/* Timestamp y estado */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '6px',
            fontSize: '10px',
            color: isOwn ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)'
          }}>
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
      </div>
    </div>
  );
};