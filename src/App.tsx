import { useEffect, useState } from 'react';
import AuthPage from './features/auth/components/AuthPage';
import { useAuthStore } from './features/auth/store';
import Board from './features/board/components/Board';
import PublicBoard from './features/board/components/PublicBoard';
import PublicTaskDetails from './features/board/components/PublicTaskDetails';
import { useBoardStore } from './features/board/store';
import TaskDetails from './features/tasks/components/TaskDetails';
import { useTaskStore } from './features/tasks/store';
import MainLayout from './layouts/MainLayout';

interface PublicRoute {
  token: string;
  taskId: string | null;
}

function getPublicRoute(pathname: string): PublicRoute | null {
  const taskMatch = pathname.match(
    /^\/public\/([^/]+)\/task\/([^/]+)\/?$/,
  );

  if (taskMatch) {
    return {
      token: decodeURIComponent(taskMatch[1]),
      taskId: decodeURIComponent(taskMatch[2]),
    };
  }

  const boardMatch = pathname.match(
    /^\/public\/([^/]+)\/?$/,
  );

  if (boardMatch) {
    return {
      token: decodeURIComponent(boardMatch[1]),
      taskId: null,
    };
  }

  return null;
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const publicRoute = getPublicRoute(pathname);
  const isPublicBoard = publicRoute !== null;
  const isPublicTask = publicRoute?.taskId !== null;

  const token = useAuthStore((state) => state.token);

  const boards = useBoardStore((state) => state.boards);
  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const fetchBoards = useBoardStore((state) => state.fetchBoards);

  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [selectedTaskBoardId, setSelectedTaskBoardId] =
    useState<string | null>(null);

  useEffect(() => {
    if (isPublicBoard || !token) {
      return;
    }

    void fetchBoards();
  }, [isPublicBoard, token, fetchBoards]);

  useEffect(() => {
    if (isPublicBoard || !token || !activeBoardId) {
      return;
    }

    void fetchTasks();
  }, [isPublicBoard, token, activeBoardId, fetchTasks]);

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

  function handlePublicTaskOpen(taskId: string) {
    if (!publicRoute) {
      return;
    }

    window.history.pushState(
      {},
      '',
      `/public/${encodeURIComponent(publicRoute.token)}/task/${encodeURIComponent(taskId)}`,
    );

    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  function handlePublicBackToBoard() {
    if (!publicRoute) {
      return;
    }

    window.history.pushState(
      {},
      '',
      `/public/${encodeURIComponent(publicRoute.token)}`,
    );

    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  if (isPublicBoard && publicRoute) {
    return (
      <MainLayout>
        {isPublicTask && publicRoute.taskId ? (
          <PublicTaskDetails
            token={publicRoute.token}
            taskId={publicRoute.taskId}
            onBack={handlePublicBackToBoard}
            onTaskOpen={handlePublicTaskOpen}
          />
        ) : (
          <PublicBoard
            token={publicRoute.token}
            onTaskOpen={handlePublicTaskOpen}
          />
        )}
      </MainLayout>
    );
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