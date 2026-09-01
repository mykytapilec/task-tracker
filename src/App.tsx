import { useEffect, useState } from 'react';

import AuthPage from './features/auth/components/AuthPage';
import { useAuthStore } from './features/auth/store';
import Board from './features/board/components/Board';
import { useBoardStore } from './features/board/store';
import TaskDetails from './features/tasks/components/TaskDetails';
import { useTaskStore } from './features/tasks/store';
import MainLayout from './layouts/MainLayout';

function App() {
  const token = useAuthStore((state) => state.token);

  const boards = useBoardStore((state) => state.boards);
  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const fetchBoards = useBoardStore((state) => state.fetchBoards);

  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTaskBoardId, setSelectedTaskBoardId] = useState<string | null>(
    null,
  );

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

  function handleTaskOpen(taskId: string) {
    if (!activeBoardId) {
      return;
    }

    setSelectedTaskId(taskId);
    setSelectedTaskBoardId(activeBoardId);
  }

  function handleBackToBoard() {
    setSelectedTaskId(null);
    setSelectedTaskBoardId(null);
  }

  const isSelectedTaskOnActiveBoard =
    selectedTaskId !== null &&
    selectedTaskBoardId !== null &&
    selectedTaskBoardId === activeBoardId;

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
      {isSelectedTaskOnActiveBoard ? (
        <TaskDetails
          key={selectedTaskId}
          taskId={selectedTaskId}
          onBack={handleBackToBoard}
          onTaskOpen={handleTaskOpen}
        />
      ) : (
        <Board onTaskOpen={handleTaskOpen} />
      )}
    </MainLayout>
  );
}

export default App;