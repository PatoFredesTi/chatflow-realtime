import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ChatWindow } from '../chat';

export const ChatLayout = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  // Mapeo simple de IDs a nombres (después vendrá del store)
  const chatNames: { [key: string]: string } = {
    '1': 'Juan Pérez',
    '2': 'María García',
    '3': 'Equipo Desarrollo',
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onSelectChat={setSelectedChat} />
        
        {/* Área principal del chat */}
        {selectedChat ? (
          <ChatWindow 
            conversationId={selectedChat}
            conversationName={chatNames[selectedChat] || 'Usuario'}
            isOnline={true}
          />
        ) : (
          <main className="flex-1 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Selecciona una conversación
              </h2>
              <p className="text-gray-400">
                Elige un chat de la lista o inicia una nueva conversación
              </p>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};