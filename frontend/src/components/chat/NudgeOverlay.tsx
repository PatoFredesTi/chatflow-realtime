// components/chat/NudgeOverlay.tsx
import { useState, useEffect, useCallback } from 'react';
import { useSocketStore } from '../../stores/socketStore';
import { useNudge } from '../../hooks';

interface NudgePayload {
  conversationId: string;
  senderId: string;
  senderName: string;
  timestamp: number;
}

interface Props {
  conversationId: string;
  children: React.ReactNode;
}

export const NudgeOverlay = ({ conversationId, children }: Props) => {
  const socket = useSocketStore((s) => s.socket);
  const [isNudging, setIsNudging] = useState(false);
  const [nudgerName, setNudgerName] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const { triggerNudgeEffect } = useNudge(conversationId);

  const handleNudgeReceived = useCallback(
    (payload: NudgePayload) => {
      if (payload.conversationId !== conversationId) return;

      triggerNudgeEffect();
      setNudgerName(payload.senderName || 'Alguien');
      setIsNudging(true);
      setShowBanner(true);

      setTimeout(() => setIsNudging(false), 700);
      setTimeout(() => setShowBanner(false), 3000);
    },
    [conversationId, triggerNudgeEffect]
  );

  useEffect(() => {
    if (!socket) return;
    socket.on('nudge:received', handleNudgeReceived);
    return () => {
      socket.off('nudge:received', handleNudgeReceived);
    };
  }, [socket, handleNudgeReceived]);

  return (
    <div
      style={{ position: 'relative', height: '100%', width: '100%' }}
      className={isNudging ? 'nudge-window-shake' : ''}
    >
      {showBanner && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '99px',
            background: 'linear-gradient(135deg, rgba(255,200,50,0.95) 0%, rgba(255,140,0,0.95) 100%)',
            color: '#1a1000',
            fontSize: '13px',
            fontWeight: 600,
            backdropFilter: 'blur(8px)',
            animation: 'nudge-banner-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            boxShadow: '0 4px 20px rgba(255, 170, 0, 0.5)',
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: '16px' }}>📳</span>
          <span>{nudgerName} te envió un zumbido</span>
        </div>
      )}

      {children}
    </div>
  );
};
