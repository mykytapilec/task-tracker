import AuthPage from './features/auth/components/AuthPage.tsx';
import { useAuthStore } from './features/auth/store.js';
import Board from './features/board/components/Board.tsx';
import MainLayout from './layouts/MainLayout.tsx';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <MainLayout>
      <Board />
    </MainLayout>
  );
}

export default App;
