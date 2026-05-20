// components/chat/NewConversationModal.tsx
import { useState, useEffect } from 'react';
import { Avatar } from '../common';
import { authAPI } from '../../services/api';
import type { User } from '../../types/chat.types';

interface Props {
  onClose: () => void;
  onCreate: (participantIds: string[], type: 'individual' | 'group', name?: string) => Promise<void>;
}

export const NewConversationModal = ({ onClose, onCreate }: Props) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [selected, setSelected] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await authAPI.searchUsers(query);
        if (response.success) {
          setResults(response.users);
        }
      } catch (err) {
        console.error('[NewConversationModal] Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const toggleSelect = (user: User) => {
    setSelected((prev) =>
      prev.find((u) => u.userId === user.userId)
        ? prev.filter((u) => u.userId !== user.userId)
        : [...prev, user]
    );
  };

  const isGroup = selected.length > 1;

  const handleCreate = async () => {
    if (selected.length === 0) return;
    const type = isGroup ? 'group' : 'individual';
    await onCreate(
      selected.map((u) => u.userId),
      type,
      isGroup ? groupName.trim() || `Grupo de ${selected.length}` : undefined
    );
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(0, 13, 46, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'white' }}>
            Nueva conversación
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '4px',
              display: 'flex',
            }}
          >
            ✕
          </button>
        </div>

        {/* Search input */}
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar usuarios por nombre o email..."
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            outline: 'none',
            marginBottom: '16px',
          }}
        />

        {/* Selected users */}
        {selected.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {selected.map((u) => (
              <button
                key={u.userId}
                onClick={() => toggleSelect(u)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  background: 'rgba(26,140,255,0.2)',
                  border: '1px solid rgba(26,140,255,0.4)',
                  borderRadius: '99px',
                  color: 'white',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {u.username}
                <span style={{ opacity: 0.6 }}>✕</span>
              </button>
            ))}
          </div>
        )}

        {/* Group name input */}
        {isGroup && (
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder={`Nombre del grupo (${selected.length} miembros)`}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '13px',
              outline: 'none',
              marginBottom: '16px',
            }}
          />
        )}

        {/* Results */}
        <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '16px' }}>
          {isSearching && (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '8px 0' }}>Buscando...</p>
          )}

          {!isSearching && query && results.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '8px 0' }}>
              No se encontraron usuarios
            </p>
          )}

          {results.map((user) => {
            const isSelected = selected.some((u) => u.userId === user.userId);
            return (
              <button
                key={user.userId}
                onClick={() => toggleSelect(user)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px',
                  width: '100%',
                  background: isSelected ? 'rgba(26,140,255,0.15)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: 'white',
                  textAlign: 'left',
                  marginBottom: '4px',
                }}
              >
                <Avatar alt={user.username} online={user.status === 'online'} size="sm" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{user.username}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{user.email}</div>
                </div>
                {isSelected && <span style={{ color: 'var(--msn-blue-bright)' }}>✓</span>}
              </button>
            );
          })}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 18px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={selected.length === 0}
            style={{
              padding: '10px 18px',
              background: selected.length > 0
                ? 'linear-gradient(135deg, #0055dd 0%, #0077ff 100%)'
                : 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '8px',
              color: selected.length > 0 ? 'white' : 'rgba(255,255,255,0.3)',
              cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: selected.length > 0 ? '0 4px 12px rgba(0, 119, 255, 0.3)' : 'none',
            }}
          >
            {isGroup ? 'Crear grupo' : 'Iniciar chat'}
          </button>
        </div>
      </div>
    </div>
  );
};
