import { useState } from 'react';
import type { KeyboardEvent } from 'react';  

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      padding: '16px 24px',
      background: 'rgba(0, 13, 46, 0.6)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-end'
      }}>
        {/* Botón de emojis */}
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
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
          }}
        >
          😊
        </button>

        {/* Textarea */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
            fontFamily: 'inherit',
            outline: 'none',
            resize: 'none',
            maxHeight: '120px',
            minHeight: '44px',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.12)';
            e.target.style.borderColor = 'var(--msn-blue-bright)';
            e.target.style.boxShadow = '0 0 0 2px rgba(26, 140, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.08)';
            e.target.style.borderColor = 'rgba(255,255,255,0.12)';
            e.target.style.boxShadow = 'none';
          }}
        />

        {/* Botón enviar */}
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          title="Enviar mensaje"
          style={{
            padding: '10px 20px',
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
            fontSize: '14px',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            if (message.trim()) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 119, 255, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = message.trim() ? '0 4px 12px rgba(0, 119, 255, 0.3)' : 'none';
          }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      <p style={{
        fontSize: '11px',
        color: 'rgba(255,255,255,0.4)',
        marginTop: '8px',
        marginLeft: '4px'
      }}>
        Presiona Enter para enviar, Shift + Enter para nueva línea
      </p>
    </div>
  );
};