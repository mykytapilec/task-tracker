import { useEffect } from 'react';

import AuthPage from './features/auth/components/AuthPage.tsx';
import { useAuthStore } from './features/auth/store.js';
import Board from './features/board/components/Board.tsx';
import { useTaskStore } from './features/tasks/store.js';
import MainLayout from './layouts/MainLayout.tsx';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    void fetchTasks();
  }, [isAuthenticated, fetchTasks]);

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
