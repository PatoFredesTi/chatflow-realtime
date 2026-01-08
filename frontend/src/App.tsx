import { AuthPage } from './components/auth';
import { ChatLayout } from './components/layout';
import { useAuth } from './hooks';

function App() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <ChatLayout /> : <AuthPage />;
}

export default App;