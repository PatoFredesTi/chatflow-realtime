import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { userAPI } from '../../services/api';
import { useConversations } from '../../hooks';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchedUser {
  userId: string;
  email: string;
  username: string;
  avatar?: string;
  status: 'online' | 'offline';
}

export const NewConversationModal = ({ isOpen, onClose }: NewConversationModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuthStore();
  const { conversations, createConversation, selectConversation } = useConversations();

  // Live search con debounce de 300ms
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await userAPI.searchUsers(searchQuery, user?.userId);
        if (response.success) setSearchResults(response.users);
      } catch (error) {
        console.error('Error buscando usuarios:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, user?.userId]);

  const handleStartConversation = async (selectedUser: SearchedUser) => {
    if (isCreating) return;

    // Buscar conversación existente primero (deduplicación frontend)
    const existing = conversations.find(
      (c) => c.type === 'individual' && c.participants.includes(selectedUser.userId)
    );

    if (existing) {
      selectConversation(existing.conversationId);
      handleClose();
      return;
    }

    setIsCreating(true);
    try {
      const conversation = await createConversation([selectedUser.userId], 'individual');
      if (conversation) {
        selectConversation(conversation.conversationId);
        handleClose();
      }
    } catch (error) {
      console.error('Error creando conversación:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  const showEmpty = searchQuery.length >= 2 && !isSearching && searchResults.length === 0;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Overlay */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'relative',
        background: 'rgba(0,13,46,0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '480px',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(0,80,208,0.6) 0%, rgba(26,140,255,0.3) 50%, rgba(0,51,153,0.5) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', margin: 0 }}>
            Nueva Conversación
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px', maxHeight: 'calc(80vh - 90px)', overflowY: 'auto' }}>
          {/* Search input */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <svg
              style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                width: '16px', height: '16px', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none',
              }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              autoFocus
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && handleClose()}
              style={{
                width: '100%',
                padding: '13px 16px 13px 40px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(0,119,255,0.6)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
            />
            {isSearching && (
              <div style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.2)',
                borderTopColor: 'white', borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
              }} />
            )}
          </div>

          {/* Hint */}
          {searchQuery.length < 2 && (
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '24px 0' }}>
              Escribe al menos 2 caracteres para buscar
            </p>
          )}

          {/* No results */}
          {showEmpty && (
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '24px 0' }}>
              No se encontraron usuarios con "{searchQuery}"
            </p>
          )}

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {searchResults.map((result) => {
              const alreadyExists = conversations.some(
                (c) => c.type === 'individual' && c.participants.includes(result.userId)
              );

              return (
                <button
                  key={result.userId}
                  onClick={() => handleStartConversation(result)}
                  disabled={isCreating}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    cursor: isCreating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease',
                    opacity: isCreating ? 0.6 : 1,
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (!isCreating) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #0066ff, #00aaff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', fontWeight: 700, color: 'white',
                    position: 'relative', boxShadow: '0 0 0 2px rgba(255,255,255,0.15)',
                  }}>
                    {result.username.charAt(0).toUpperCase()}
                    {result.status === 'online' && (
                      <div style={{
                        position: 'absolute', bottom: '1px', right: '1px',
                        width: '11px', height: '11px', background: 'var(--msn-green)',
                        borderRadius: '50%', border: '2px solid rgba(0,13,46,0.95)',
                      }} />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ fontWeight: 600, color: 'white', fontSize: '14px', marginBottom: '2px' }}>
                      {result.username}
                    </p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {result.email}
                    </p>
                  </div>

                  {/* Action label */}
                  <span style={{
                    fontSize: '11px', fontWeight: 600, flexShrink: 0,
                    color: alreadyExists ? 'rgba(255,255,255,0.4)' : 'rgba(26,140,255,0.9)',
                    background: alreadyExists ? 'rgba(255,255,255,0.06)' : 'rgba(0,119,255,0.15)',
                    border: `1px solid ${alreadyExists ? 'rgba(255,255,255,0.1)' : 'rgba(0,119,255,0.3)'}`,
                    borderRadius: '6px', padding: '4px 8px',
                  }}>
                    {alreadyExists ? 'Abrir chat' : 'Iniciar chat'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  );
};
