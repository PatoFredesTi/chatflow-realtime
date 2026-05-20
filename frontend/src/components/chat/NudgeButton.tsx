// components/chat/NudgeButton.tsx
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNudge } from '../../hooks';

interface Props {
  conversationId: string;
  disabled?: boolean;
}

export const NudgeButton = ({ conversationId, disabled = false }: Props) => {
  const [isShaking, setIsShaking] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownProgress, setCooldownProgress] = useState(100);
  const [tooltip, setTooltip] = useState('');
  const cooldownInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const cooldownStart = useRef<number>(0);

  const { sendNudge, cooldownMs } = useNudge(conversationId);

  const startCooldownTimer = useCallback(() => {
    cooldownStart.current = Date.now();
    setCooldownActive(true);
    setCooldownProgress(0);

    cooldownInterval.current = setInterval(() => {
      const elapsed = Date.now() - cooldownStart.current;
      const progress = Math.min((elapsed / cooldownMs) * 100, 100);
      setCooldownProgress(progress);

      if (elapsed >= cooldownMs) {
        setCooldownActive(false);
        setCooldownProgress(100);
        if (cooldownInterval.current) clearInterval(cooldownInterval.current);
      }
    }, 50);
  }, [cooldownMs]);

  const handleClick = useCallback(() => {
    if (disabled || cooldownActive) {
      if (cooldownActive) {
        const remaining = Math.ceil((cooldownMs - (Date.now() - cooldownStart.current)) / 1000);
        setTooltip(`Espera ${remaining}s...`);
        setTimeout(() => setTooltip(''), 1500);
      }
      return;
    }

    const sent = sendNudge();
    if (sent) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      startCooldownTimer();
      setTooltip('¡Zumbido enviado!');
      setTimeout(() => setTooltip(''), 1500);
    }
  }, [disabled, cooldownActive, cooldownMs, sendNudge, startCooldownTimer]);

  useEffect(() => {
    return () => {
      if (cooldownInterval.current) clearInterval(cooldownInterval.current);
    };
  }, []);

  const isDisabled = disabled || cooldownActive;
  const radius = 11;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cooldownProgress / 100) * circumference;

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            top: '-32px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 500,
            color: 'white',
            background: 'rgba(20,30,60,0.95)',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            pointerEvents: 'none',
            zIndex: 50,
          }}
        >
          {tooltip}
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={isDisabled}
        title={cooldownActive ? 'Zumbido en cooldown' : '¡Envía un zumbido!'}
        className={isShaking ? 'nudge-shake' : ''}
        style={{
          position: 'relative',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
          transition: 'all 0.15s ease',
          padding: 0,
        }}
      >
        <svg
          width="36" height="36" viewBox="0 0 36 36"
          style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
        >
          <circle cx="18" cy="18" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
          {cooldownActive && (
            <circle
              cx="18" cy="18" r={radius} fill="none"
              stroke="rgba(255, 200, 50, 0.7)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.05s linear' }}
            />
          )}
        </svg>

        <span style={{ fontSize: '18px', lineHeight: 1, position: 'relative', zIndex: 1 }} role="img" aria-label="nudge">
          📳
        </span>
      </button>
    </div>
  );
};
