import { useEffect, useState } from 'react';

import { apiClient } from '../../../api/client';
import type { Task } from '../../tasks/types';

interface PublicTaskDetailsProps {
  token: string;
  taskId: string;
  onBack: () => void;
  onTaskOpen: (taskId: string) => void;
}

interface PublicTask extends Omit<Task, 'subtasks'> {
  subtasks?: PublicTask[];
}

function PublicTaskDetails({
  token,
  taskId,
  onBack,
  onTaskOpen,
}: PublicTaskDetailsProps) {
  const [task, setTask] = useState<PublicTask | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTask() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiClient<PublicTask>(
          `/boards/public/${encodeURIComponent(token)}/tasks/${encodeURIComponent(taskId)}`,
        );

        if (!isMounted) {
          return;
        }

        setTask(data);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Failed to load task',
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadTask();

    return () => {
      isMounted = false;
    };
  }, [token, taskId]);

  if (isLoading) {
    return (
      <section>
        <button
          type="button"
          onClick={onBack}
          className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to board
        </button>

        <p className="text-slate-600">Loading task...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <button
          type="button"
          onClick={onBack}
          className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to board
        </button>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </section>
    );
  }

  if (!task) {
    return (
      <section>
        <button
          type="button"
          onClick={onBack}
          className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to board
        </button>

        <p className="text-slate-600">Task not found.</p>
      </section>
    );
  }

  const subtasks = task.subtasks ?? [];

  return (
    <section>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← Back to board
      </button>

      <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold text-slate-900">
              {task.title}
            </h1>

            {task.description && (
              <p className="mt-4 whitespace-pre-wrap break-words text-slate-600">
                {task.description}
              </p>
            )}
          </div>

          <span
            className={`rounded px-3 py-1 text-sm ${
              task.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {task.status === 'completed' ? 'completed' : 'pending'}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded bg-slate-100 px-3 py-1 text-sm text-slate-600">
            Priority: {task.priority}
          </span>

          <span className="rounded bg-slate-100 px-3 py-1 text-sm text-slate-600">
            Story points: {task.storyPoints}
          </span>
        </div>

        {subtasks.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Subtasks
            </h2>

            <div className="space-y-3">
              {subtasks.map((subtask) => (
                <button
                  key={subtask.id}
                  type="button"
                  onClick={() => onTaskOpen(subtask.id)}
                  className="block w-full rounded-lg border border-slate-200 p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`min-w-0 break-words font-medium ${
                        subtask.status === 'completed'
                          ? 'text-slate-500 line-through'
                          : 'text-slate-800'
                      }`}
                    >
                      {subtask.title}
                    </span>

                    <span className="shrink-0 text-xs text-slate-500">
                      SP: {subtask.storyPoints}
                    </span>
                  </div>

                  {subtask.description && (
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-500">
                      {subtask.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </article>
    </section>
  );
}

export default PublicTaskDetails;