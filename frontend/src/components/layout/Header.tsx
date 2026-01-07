import { Avatar } from '../common';
import { useAuthStore } from '../../stores/authStore';

export const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">ChatFlow</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-white font-semibold">{user?.username || 'Usuario'}</p>
            <p className="text-gray-400 text-sm">{user?.email || 'email@example.com'}</p>
          </div>
          <Avatar alt={user?.username || 'Usuario'} online />
          <button
            onClick={logout}
            className="text-gray-400 hover:text-white transition-colors"
            title="Cerrar sesión"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};