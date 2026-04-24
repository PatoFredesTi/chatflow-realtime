export const TypingIndicator = ({ username }: { username: string }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 24px',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
  }}>
    <span>{username} está escribiendo</span>
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {[0, 150, 300].map((delay) => (
        <div
          key={delay}
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.5)',
            animation: 'typingBounce 1s infinite ease-in-out',
            animationDelay: `${delay}ms`,
          }}
        />
      ))}
    </div>
    <style>{`
      @keyframes typingBounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-4px); }
      }
    `}</style>
  </div>
);
