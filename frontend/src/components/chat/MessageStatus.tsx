// components/chat/MessageStatus.tsx
import type { MessageStatus } from '../../types/message.types';

interface Props {
  status: MessageStatus;
}

export const MessageStatusIcon = ({ status }: Props) => {
  if (status === 'sending') {
    return (
      <svg
        width="14" height="14" viewBox="0 0 14 14" fill="none"
        style={{ animation: 'spin 1s linear infinite', opacity: 0.5 }}
      >
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <circle
          cx="7" cy="7" r="5.5"
          stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
          strokeDasharray="20 14" strokeLinecap="round"
        />
      </svg>
    );
  }

  if (status === 'error') {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.8)" strokeWidth="1" />
        <path d="M7 4v3.5M7 9.5v.5" stroke="rgba(239,68,68,0.9)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (status === 'sent') {
    return (
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
        <path d="M1.5 5L5.5 9L14.5 1" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (status === 'delivered') {
    return (
      <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
        <path d="M1 5L5 9L14 1" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 5L9.5 9L18.5 1" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (status === 'read') {
    return (
      <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
        <path d="M1 5L5 9L14 1" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 5L9.5 9L18.5 1" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return null;
};
