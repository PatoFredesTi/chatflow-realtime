// components/common/Avatar.tsx

interface AvatarProps {
  alt: string;
  src?: string;
  online?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: 32,
  md: 40,
  lg: 56,
};

const COLORS = [
  ['#3b82f6', '#1e40af'],
  ['#8b5cf6', '#5b21b6'],
  ['#ec4899', '#9d174d'],
  ['#10b981', '#065f46'],
  ['#f59e0b', '#92400e'],
  ['#ef4444', '#7f1d1d'],
  ['#06b6d4', '#155e75'],
];

function getColorFromName(name: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length] as [string, string];
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

export const Avatar = ({ alt, src, online, size = 'md' }: AvatarProps) => {
  const dim = SIZES[size];
  const [color1, color2] = getColorFromName(alt || '?');
  const initials = getInitials(alt || '?') || '?';

  return (
    <div
      style={{
        position: 'relative',
        width: dim,
        height: dim,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: dim,
          height: dim,
          borderRadius: '50%',
          background: src
            ? `url(${src}) center/cover`
            : `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 600,
          fontSize: dim * 0.4,
          border: '2px solid rgba(255,255,255,0.15)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          userSelect: 'none',
        }}
      >
        {!src && initials}
      </div>

      {online !== undefined && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: dim * 0.3,
            height: dim * 0.3,
            borderRadius: '50%',
            background: online ? 'var(--msn-green)' : '#9ca3af',
            border: '2px solid rgba(0, 13, 46, 0.95)',
            boxShadow: online ? '0 0 6px var(--msn-green-glow)' : 'none',
          }}
        />
      )}
    </div>
  );
};
