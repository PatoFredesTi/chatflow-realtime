// components/chat/TypingIndicator.tsx

interface Props {
  username: string;
}

export const TypingIndicator = ({ username }: Props) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 24px 8px',
        background: 'rgba(0, 13, 46, 0.4)',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.5)',
      }}
    >
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>

      <div style={{ display: 'flex', gap: '3px' }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.6)',
              animation: `typing-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>

      <span>{username} está escribiendo...</span>
    </div>
  );
};
