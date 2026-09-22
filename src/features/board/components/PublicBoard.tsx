import { useEffect, useState } from 'react';

import { apiClient } from '../../../api/client';
import type { Task } from '../../tasks/types';

interface PublicBoardData {
  id: string;
  title: string;
  columns: PublicBoardColumn[];
}

interface PublicBoardColumn {
  id: string;
  title: string;
  position: number;
  tasks: PublicTask[];
}

interface PublicTask extends Omit<Task, 'subtasks'> {
  subtasks?: PublicTask[];
}

interface PublicBoardProps {
  token: string;
  onTaskOpen: (taskId: string) => void;
}

function PublicTaskCard({
  task,
  onTaskOpen,
}: {
  task: PublicTask;
  onTaskOpen: (taskId: string) => void;
}) {
  const isCompleted = task.status === 'completed';
  const subtasks = task.subtasks ?? [];

  return (
    <article className="rounded-lg bg-white p-4 shadow">
      <button
        type="button"
        onClick={() => onTaskOpen(task.id)}
        className="block w-full text-left"
      >
        <div className="min-w-0">
          <div className="flex min-w-0 items-start gap-2">
            <span
              aria-hidden="true"
              className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                isCompleted
                  ? 'border-green-500 bg-green-500'
                  : 'border-slate-300'
              }`}
            />

            <h3
              className={`min-w-0 break-words font-medium ${
                isCompleted ? 'text-slate-500 line-through' : ''
              }`}
            >
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p
              className={`mt-2 break-words whitespace-pre-wrap text-sm ${
                isCompleted ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
              {task.priority}
            </span>

            <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
              SP: {task.storyPoints}
            </span>

            <span
              className={`rounded px-2 py-1 text-xs ${
                isCompleted
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {isCompleted ? 'completed' : 'pending'}
            </span>
          </div>
        </div>
      </button>

      {subtasks.length > 0 && (
        <div className="mt-4 space-y-2 border-l-2 border-slate-200 pl-3">
          {subtasks.map((subtask) => (
            <PublicTaskCard
              key={subtask.id}
              task={subtask}
              onTaskOpen={onTaskOpen}
            />
          ))}
        </div>
      )}
    </article>
  );
}

function PublicBoard({ token, onTaskOpen }: PublicBoardProps) {
  const [board, setBoard] = useState<PublicBoardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBoard() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiClient<PublicBoardData>(
          `/boards/public/${encodeURIComponent(token)}`,
        );

        if (!isMounted) {
          return;
        }

        setBoard(data);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Failed to load public board',
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadBoard();

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (isLoading) {
    return (
      <section>
        <p className="text-slate-600">Loading board...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </section>
    );
  }

  if (!board) {
    return (
      <section>
        <p className="text-slate-600">Board not found.</p>
      </section>
    );
  }

  const columns = board.columns
    .slice()
    .sort((a, b) => a.position - b.position);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{board.title}</h1>

          <p className="mt-1 text-sm text-slate-500">
            Public read-only board
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {columns.map((column) => {
          const tasks = column.tasks
            .filter((task) => !task.parentTaskId)
            .slice()
            .sort((a, b) => a.position - b.position);

          return (
            <section
              key={column.id}
              className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-semibold text-slate-800">
                  {column.title}
                </h2>

                <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-500">
                  {tasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <PublicTaskCard
                    key={task.id}
                    task={task}
                    onTaskOpen={onTaskOpen}
                  />
                ))}

                {!tasks.length && (
                  <p className="rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-sm text-slate-500">
                    No tasks
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

export default PublicBoard;