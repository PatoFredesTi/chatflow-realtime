import { Avatar } from '../common';
import { formatMessageTime } from '../../utils';
import type { Message } from '../../types/message.types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName?: string;
  showAvatar?: boolean;
}

export const MessageBubble = ({
  message,
  isOwn,
  senderName,
  showAvatar = true,
}: MessageBubbleProps) => {
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
      case 'sent':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'delivered':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13l4 4L23 7" />
          </svg>
        );
      case 'read':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13l4 4L23 7" />
          </svg>
        );
    }
  };

  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {showAvatar && !isOwn && (
        <div className="flex-shrink-0">
          <Avatar alt={senderName || 'Usuario'} size="sm" />
        </div>
      )}

      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {!isOwn && senderName && (
          <span className="text-xs text-gray-400 mb-1 px-2">{senderName}</span>
        )}
        
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-gray-700 text-white rounded-tl-sm'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>

        <div className={`flex items-center gap-1 mt-1 px-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs text-gray-500">
            {formatMessageTime(message.timestamp)}
          </span>
          {isOwn && <div className="text-gray-500">{getStatusIcon()}</div>}
        </div>
      </div>
    </div>
  );
};