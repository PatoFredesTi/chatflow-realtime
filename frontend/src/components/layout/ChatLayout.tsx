import { useCallback } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ChatWindow } from '../chat';
import { useConversations, useNotifications } from '../../hooks';

export const ChatLayout = () => {
  const { currentConversation, conversations, selectConversation } = useConversations();

  const handleNotificationClick = useCallback(
    (conversationId: string) => selectConversation(conversationId),
    [selectConversation]
  );

  useNotifications(conversations, handleNotificationClick);

  const getCurrentConversation = () => {
    if (!currentConversation) return null;
    return conversations.find((c) => c.conversationId === currentConversation);
  };

  const currentConv = getCurrentConversation();
  const conversationName = currentConv?.name || 'Usuario';

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'  // ← IMPORTANTE: Evitar scroll en el contenedor principal
    }}>
      <Header />
      
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        overflow: 'hidden',  // ← IMPORTANTE: Los hijos manejan su propio scroll
        minHeight: 0  // ← IMPORTANTE: Permite que flex-children se contraigan
      }}>
        <Sidebar />
        
        {currentConversation ? (
          <ChatWindow 
            conversationId={currentConversation}
            conversationName={conversationName}
            isOnline={true}
          />
        ) : (
          <main style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(0, 13, 46, 0.4)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }}>💬</div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 600,
                color: 'white',
                marginBottom: '8px'
              }}>
                Selecciona una conversación
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                Elige un chat de la lista o inicia una nueva conversación
              </p>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};