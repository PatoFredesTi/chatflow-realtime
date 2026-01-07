import { useState } from 'react';
import { Avatar } from '../common';

interface SidebarProps {
  onSelectChat?: (chatId: string) => void;
}

// Datos de ejemplo (después vendrán del store)
const mockConversations = [
  {
    id: '1',
    name: 'Juan Pérez',
    lastMessage: 'Hola, ¿cómo estás?',
    timestamp: Date.now() - 1000 * 60 * 5,
    unreadCount: 2,
    online: true,
  },
  {
    id: '2',
    name: 'María García',
    lastMessage: 'Nos vemos mañana 👍',
    timestamp: Date.now() - 1000 * 60 * 30,
    unreadCount: 0,
    online: true,
  },
  {
    id: '3',
    name: 'Equipo Desarrollo',
    lastMessage: 'Carlos: Subí los cambios al repo',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    unreadCount: 5,
    online: false,
  },
];

export const Sidebar = ({ onSelectChat }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const filteredConversations = mockConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
    onSelectChat?.(chatId);
  };

  return (
    <aside className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Header con botón nuevo chat */}
      <div className="p-4 border-b border-gray-700">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Nueva Conversación
        </button>
      </div>

      {/* Búsqueda */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-2.5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => handleSelectChat(conv.id)}
            className={`w-full p-4 flex items-center gap-3 hover:bg-gray-700 transition-colors border-l-4 ${
              selectedChat === conv.id
                ? 'bg-gray-700 border-blue-600'
                : 'border-transparent'
            }`}
          >
            <Avatar alt={conv.name} online={conv.online} />
            
            <div className="flex-1 text-left overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-white truncate">{conv.name}</h3>
                <span className="text-xs text-gray-400">
                  {formatTime(conv.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
            </div>

            {conv.unreadCount > 0 && (
              <div className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {conv.unreadCount}
              </div>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
};