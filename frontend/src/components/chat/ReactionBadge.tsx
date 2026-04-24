interface ReactionBadgeProps {
  emoji: string;
  userIds: string[];
  userId: string; // usuario actual
  onToggle: (emoji: string) => void;
}

export const ReactionBadge = ({ emoji, userIds, userId, onToggle }: ReactionBadgeProps) => {
  const hasReacted = userIds.includes(userId);
  const count = userIds.length;

  if (count === 0) return null;

  return (
    <button
      onClick={() => onToggle(emoji)}
      title={`${count} reacción${count > 1 ? 'es' : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        background: hasReacted
          ? 'rgba(0, 119, 255, 0.2)'
          : 'rgba(255, 255, 255, 0.07)',
        border: hasReacted
          ? '1px solid rgba(0, 119, 255, 0.5)'
          : '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '2px 8px',
        cursor: 'pointer',
        fontSize: '13px',
        color: 'white',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hasReacted
          ? 'rgba(0, 119, 255, 0.3)'
          : 'rgba(255,255,255,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = hasReacted
          ? 'rgba(0, 119, 255, 0.2)'
          : 'rgba(255, 255, 255, 0.07)';
      }}
    >
      <span>{emoji}</span>
      <span style={{ fontSize: '11px', fontWeight: 600, opacity: 0.9 }}>{count}</span>
    </button>
  );
};