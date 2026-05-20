// components/chat/ReactionBadge.tsx

interface Props {
  emoji: string;
  userIds: string[];
  currentUserId: string;
  onClick: () => void;
}

export const ReactionBadge = ({ emoji, userIds, currentUserId, onClick }: Props) => {
  const count = userIds.length;
  const iReacted = userIds.includes(currentUserId);

  if (count === 0) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      type="button"
      title={iReacted ? 'Quitar reacción' : 'Reaccionar'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        padding: '2px 7px',
        borderRadius: '12px',
        border: iReacted
          ? '1px solid rgba(56, 189, 248, 0.5)'
          : '1px solid rgba(255,255,255,0.12)',
        background: iReacted
          ? 'rgba(56, 189, 248, 0.12)'
          : 'rgba(255,255,255,0.07)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        fontSize: '13px',
        lineHeight: 1,
      }}
    >
      <span style={{ fontSize: '13px', lineHeight: 1 }}>{emoji}</span>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 500,
          color: iReacted ? 'rgba(56, 189, 248, 0.9)' : 'rgba(255,255,255,0.6)',
          minWidth: '8px',
        }}
      >
        {count}
      </span>
    </button>
  );
};
