// components/chat/MessageInput.tsx
import { useState, useCallback, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { NudgeButton } from './NudgeButton';
import { useTyping } from '../../hooks';

interface Props {
  onSendMessage: (text: string) => void;
  conversationId: string;
}

export const MessageInput = ({ onSendMessage, conversationId }: Props) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { notifyTyping } = useTyping(conversationId);

  const handleSend = useCallback(() => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  }, [message, onSendMessage]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) notifyTyping();
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div
      style={{
        padding: '16px 24px',
        background: 'rgba(0, 13, 46, 0.6)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
        {/* Emoji button */}
        <button
          title="Emojis"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '8px',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            height: '44px',
            width: '44px',
            fontSize: '18px',
          }}
        >
          😊
        </button>

        {/* NudgeButton */}
        <div style={{ flexShrink: 0, height: '44px', display: 'flex', alignItems: 'center' }}>
          <NudgeButton conversationId={conversationId} />
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          rows={1}
          style={{
            flex: 1,
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            outline: 'none',
            resize: 'none',
            maxHeight: '120px',
            minHeight: '44px',
            transition: 'background 0.2s ease, border-color 0.2s ease',
            overflowY: 'auto',
          }}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          title="Enviar"
          style={{
            padding: '10px 20px',
            height: '44px',
            background: message.trim()
              ? 'linear-gradient(135deg, #0055dd 0%, #0077ff 100%)'
              : 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: '8px',
            color: message.trim() ? 'white' : 'rgba(255,255,255,0.3)',
            cursor: message.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            boxShadow: message.trim() ? '0 4px 12px rgba(0, 119, 255, 0.3)' : 'none',
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      <p
        style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.4)',
          marginTop: '8px',
          marginLeft: '4px',
          marginBottom: 0,
        }}
      >
        Enter para enviar · Shift+Enter para nueva línea · 📳 para zumbar
      </p>
    </div>
  );
};
