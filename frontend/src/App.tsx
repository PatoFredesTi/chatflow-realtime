// src/App.tsx
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useSocketStore } from './stores/socketStore';
import { connectSocket, disconnectSocket } from './services/socket';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Dashboard } from './components/layout/Dashboard';

function App() {
  const { isAuthenticated, user } = useAuthStore();
  const setSocket = useSocketStore((s) => s.setSocket);

  // Connect socket when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const socket = connectSocket(user.userId);
      setSocket(socket);

      return () => {
        disconnectSocket();
        setSocket(null);
      };
    }
  }, [isAuthenticated, user, setSocket]);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
