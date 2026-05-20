// components/chat/ReactionPicker.tsx

interface Props {
  onReact: (emoji: string) => void;
  isOwn: boolean;
}

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢'];

export const ReactionPicker = ({ onReact, isOwn }: Props) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 4px)',
        ...(isOwn ? { right: 0 } : { left: 0 }),
        display: 'flex',
        gap: '2px',
        padding: '4px 6px',
        background: 'rgba(10, 20, 50, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        zIndex: 10,
        animation: 'reactionPickerIn 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }}
    >
      <style>{`
        @keyframes reactionPickerIn {
          from { opacity: 0; transform: translateY(6px) scale(0.88); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
        .reaction-emoji-btn {
          background: none; border: none; cursor: pointer;
          font-size: 18px; line-height: 1; padding: 4px;
          border-radius: 50%;
          transition: transform 0.12s ease, background 0.12s ease;
          display: flex; align-items: center; justify-content: center;
        }
        .reaction-emoji-btn:hover {
          transform: scale(1.35); background: rgba(255,255,255,0.1);
        }
      `}</style>

      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          className="reaction-emoji-btn"
          onClick={(e) => {
            e.stopPropagation();
            onReact(emoji);
          }}
          title={emoji}
          type="button"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};
