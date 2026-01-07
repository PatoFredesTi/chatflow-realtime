import { AuthPage } from './components/auth';
import { ChatLayout } from './components/layout';
import { useState } from 'react';

function App() {
  // Cambia esto a true para ver el layout del chat
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return isAuthenticated ? <ChatLayout /> : <AuthPage />;
}

export default App;