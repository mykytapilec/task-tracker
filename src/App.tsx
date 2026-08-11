import { useEffect } from 'react';

import AuthPage from './features/auth/components/AuthPage.tsx';
import { useAuthStore } from './features/auth/store.js';
import Board from './features/board/components/Board.tsx';
import { useBoardStore } from './features/board/store.js';
import { useTaskStore } from './features/tasks/store.js';
import MainLayout from './layouts/MainLayout.tsx';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchBoard = useBoardStore((state) => state.fetchBoard);
  const board = useBoardStore((state) => state.board);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    void Promise.all([fetchBoard(), fetchTasks()]);
  }, [isAuthenticated, fetchBoard, fetchTasks]);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  if (!board) {
    return <div>Loading board...</div>;
  }

  return (
    <MainLayout>
      <Board />
    </MainLayout>
  );
}

export default App;
