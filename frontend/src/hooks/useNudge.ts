// hooks/useNudge.ts
import { useCallback, useRef } from 'react';
import { useSocketStore } from '../stores/socketStore';
import { useAuthStore } from '../stores/authStore';

interface NudgeState {
  lastSentAt: number;
  cooldownMs: number;
}

// Generate the classic MSN Messenger "nudge" buzz using Web Audio API
function playNudgeSound(): void {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext })
        .webkitAudioContext;
    const ctx = new AudioContextClass();

    const playBuzz = (start: number, duration: number, freq: number, gainValue: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, start + duration);

      gain.gain.setValueAtTime(gainValue, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.start(start);
      osc.stop(start + duration);
    };

    const now = ctx.currentTime;
    playBuzz(now, 0.08, 220, 0.4);
    playBuzz(now + 0.10, 0.08, 200, 0.35);
    playBuzz(now + 0.20, 0.12, 180, 0.3);

    setTimeout(() => ctx.close(), 600);
  } catch (err) {
    console.warn('[Nudge] Web Audio API not available:', err);
  }
}

export function useNudge(conversationId: string) {
  const socket = useSocketStore((s) => s.socket);
  const { user } = useAuthStore();
  const nudgeState = useRef<NudgeState>({ lastSentAt: 0, cooldownMs: 10_000 });

  const sendNudge = useCallback(() => {
    const now = Date.now();
    const { lastSentAt, cooldownMs } = nudgeState.current;

    if (now - lastSentAt < cooldownMs) return false;

    nudgeState.current.lastSentAt = now;
    playNudgeSound();

    socket?.emit('nudge:send', {
      conversationId,
      senderId: user?.userId,
      senderName: user?.username,
      timestamp: now,
    });

    return true;
  }, [socket, conversationId, user]);

  const triggerNudgeEffect = useCallback(() => {
    playNudgeSound();
  }, []);

  return {
    sendNudge,
    triggerNudgeEffect,
    cooldownMs: nudgeState.current.cooldownMs,
  };
}
