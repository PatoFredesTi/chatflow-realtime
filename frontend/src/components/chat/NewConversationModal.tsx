import { useState } from 'react';
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
  const { createConversation, selectConversation } = useConversations();

  const handleSearch = async () => {
    if (searchQuery.length < 2) return;

    setIsSearching(true);
    try {
      const response = await userAPI.searchUsers(searchQuery, user?.userId);
      if (response.success) {
        setSearchResults(response.users);
      }
    } catch (error) {
      console.error('Error buscando usuarios:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateConversation = async (selectedUser: SearchedUser) => {
    setIsCreating(true);
    try {
      const conversation = await createConversation([selectedUser.userId], 'individual');
      
      if (conversation) {
        selectConversation(conversation.conversationId);
        onClose();
        setSearchQuery('');
        setSearchResults([]);
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

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Overlay */}
      <div 
        onClick={handleClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)'
        }}
      />
      
      {/* Modal */}
      <div style={{
        position: 'relative',
        background: 'rgba(0, 13, 46, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(0, 80, 208, 0.6) 0%, rgba(26, 140, 255, 0.3) 50%, rgba(0, 51, 153, 0.5) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'white',
            margin: 0
          }}>
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
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div style={{ padding: '24px 28px', maxHeight: 'calc(80vh - 90px)', overflowY: 'auto' }}>
          {/* Búsqueda */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching || searchQuery.length < 2}
                style={{
                  padding: '13px 24px',
                  background: 'linear-gradient(135deg, #0055dd 0%, #0077ff 50%, #1a8cff 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: isSearching || searchQuery.length < 2 ? 'not-allowed' : 'pointer',
                  opacity: isSearching || searchQuery.length < 2 ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
              Escribe al menos 2 caracteres y presiona Enter o click en Buscar
            </p>
          </div>

          {/* Resultados */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {isSearching ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.5)' }}>
                Buscando usuarios...
              </div>
            ) : searchResults.length === 0 && searchQuery.length >= 2 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.5)' }}>
                No se encontraron usuarios
              </div>
            ) : (
              searchResults.map((searchedUser) => (
                <button
                  key={searchedUser.userId}
                  onClick={() => handleCreateConversation(searchedUser)}
                  disabled={isCreating}
                  style={{
                    width: '100%',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    cursor: isCreating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: isCreating ? 0.5 : 1
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
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0066ff, #00aaff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'white',
                    flexShrink: 0,
                    position: 'relative',
                    boxShadow: '0 0 0 2px rgba(255,255,255,0.15)'
                  }}>
                    {searchedUser.username.charAt(0).toUpperCase()}
                    {searchedUser.status === 'online' && (
                      <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        width: '12px',
                        height: '12px',
                        background: 'var(--msn-green)',
                        borderRadius: '50%',
                        border: '2px solid rgba(0, 13, 46, 0.95)'
                      }}></div>
                    )}
                  </div>
                  
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <h3 style={{ 
                      fontWeight: 600, 
                      color: 'white', 
                      fontSize: '15px',
                      marginBottom: '4px'
                    }}>
                      {searchedUser.username}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                      {searchedUser.email}
                    </p>
                  </div>
                  
                  <svg 
                    style={{ width: '20px', height: '20px', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                    />
                  </svg>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};