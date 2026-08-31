import { useEffect } from 'react';

import AuthPage from './features/auth/components/AuthPage';
import { useAuthStore } from './features/auth/store';
import Board from './features/board/components/Board';
import { useBoardStore } from './features/board/store';
import { useTaskStore } from './features/tasks/store';
import MainLayout from './layouts/MainLayout';

function App() {
  const token = useAuthStore((state) => state.token);

  const boards = useBoardStore((state) => state.boards);
  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const fetchBoards = useBoardStore((state) => state.fetchBoards);

  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  useEffect(() => {
    if (!token) {
      return;
    }

    void fetchBoards();
  }, [token, fetchBoards]);

  useEffect(() => {
    if (!token || !activeBoardId) {
      return;
    }

    void fetchTasks();
  }, [token, activeBoardId, fetchTasks]);

  if (!token) {
    return <AuthPage />;
  }

  if (!boards.length) {
    return (
      <MainLayout>
        <div>No boards available.</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Board />
    </MainLayout>
  );
}

export default App;
