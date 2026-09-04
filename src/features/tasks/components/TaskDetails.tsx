import { useState, type FormEvent } from 'react';

import { useTaskStore } from '../store';
import {
  TASK_STORY_POINTS,
  type TaskPriority,
  type TaskStoryPoints,
} from '../types';

interface TaskDetailsProps {
  taskId: string;
  onBack: () => void;
  onTaskOpen: (taskId: string) => void;
}

function TaskDetails({
  taskId,
  onBack,
  onTaskOpen,
}: TaskDetailsProps) {
  const task = useTaskStore((state) =>
    state.tasks.find((currentTask) => currentTask.id === taskId),
  );
  const updateTask = useTaskStore((state) => state.updateTask);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [storyPoints, setStoryPoints] = useState<TaskStoryPoints>(1);
  const [isSaving, setIsSaving] = useState(false);

  if (!task) {
    return (
      <section>
        <button
          type="button"
          onClick={onBack}
          className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Back to board
        </button>

        <p className="mt-6 text-slate-600">Task not found.</p>
      </section>
    );
  }

  const currentTask = task;

  const hasChanges =
    title.trim() !== currentTask.title ||
    description.trim() !== currentTask.description ||
    priority !== currentTask.priority ||
    storyPoints !== currentTask.storyPoints;

  function handleEdit() {
    setTitle(currentTask.title);
    setDescription(currentTask.description);
    setPriority(currentTask.priority);
    setStoryPoints(currentTask.storyPoints);
    setIsEditing(true);
  }

  function handleCancel() {
    setTitle(currentTask.title);
    setDescription(currentTask.description);
    setPriority(currentTask.priority);
    setStoryPoints(currentTask.storyPoints);
    setIsEditing(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !hasChanges || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await updateTask(currentTask.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        storyPoints,
      });

      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section>
      <button
        type="button"
        onClick={onBack}
        className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
      >
        ← Back to board
      </button>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Task title"
                  disabled={isSaving}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-lg font-medium"
                />

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Task description"
                  disabled={isSaving}
                  className="mt-4 min-h-32 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                />

                <div className="mt-4 flex flex-wrap gap-3">
                  <select
                    value={priority}
                    onChange={(event) =>
                      setPriority(event.target.value as TaskPriority)
                    }
                    disabled={isSaving}
                    className="rounded border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="low">Low priority</option>
                    <option value="medium">Medium priority</option>
                    <option value="high">High priority</option>
                  </select>

                  <select
                    value={storyPoints}
                    onChange={(event) =>
                      setStoryPoints(
                        Number(event.target.value) as TaskStoryPoints,
                      )
                    }
                    disabled={isSaving}
                    className="rounded border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    {TASK_STORY_POINTS.map((points) => (
                      <option key={points} value={points}>
                        {points} story points
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 flex gap-2">
                  {hasChanges && (
                    <button
                      type="submit"
                      disabled={isSaving || !title.trim()}
                      className="rounded bg-slate-900 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2
                  className={`text-2xl font-bold ${
                    currentTask.status === 'completed'
                      ? 'text-slate-500 line-through'
                      : 'text-slate-900'
                  }`}
                >
                  {currentTask.title}
                </h2>

                <p className="mt-4 whitespace-pre-wrap break-words text-slate-600">
                  {currentTask.description || 'No description.'}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded bg-slate-100 px-3 py-1 text-sm text-slate-600">
                    {currentTask.priority}
                  </span>

                  <span className="rounded bg-slate-100 px-3 py-1 text-sm text-slate-600">
                    SP: {currentTask.storyPoints}
                  </span>

                  <span
                    className={`rounded px-3 py-1 text-sm ${
                      currentTask.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {currentTask.status}
                  </span>
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={handleEdit}
              className="shrink-0 rounded border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Edit
            </button>
          )}
        </div>

        {currentTask.subtasks.length > 0 && (
          <div className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-800">
              Subtasks
            </h3>

            <div className="mt-4 space-y-2">
              {currentTask.subtasks.map((subtask) => (
                <button
                  key={subtask.id}
                  type="button"
                  onClick={() => onTaskOpen(subtask.id)}
                  className="flex w-full items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100"
                >
                  <span
                    className={`min-w-0 break-words font-medium ${
                      subtask.status === 'completed'
                        ? 'text-slate-500 line-through'
                        : 'text-slate-700'
                    }`}
                  >
                    {subtask.title}
                  </span>

                  <span className="flex shrink-0 items-center gap-2">
                    <span className="rounded bg-white px-2 py-1 text-xs text-slate-500">
                      {subtask.priority}
                    </span>

                    <span className="rounded bg-white px-2 py-1 text-xs text-slate-500">
                      SP: {subtask.storyPoints}
                    </span>

                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        subtask.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {subtask.status}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TaskDetails;