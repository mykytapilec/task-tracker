import { useState } from 'react';

import { useTaskStore } from '../store';
import type { TaskPriority } from '../types';

interface TaskFormProps {
  columnId: string;
}

function TaskForm({ columnId }: TaskFormProps) {
  const createTask = useTaskStore((state) => state.createTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        columnId,
      });

      setTitle('');
      setDescription('');
      setPriority('medium');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold">Create task</h2>

      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Task title"
        disabled={isSubmitting}
        className="mt-4 w-full rounded border border-slate-300 px-3 py-2"
      />

      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Task description"
        disabled={isSubmitting}
        className="mt-3 w-full rounded border border-slate-300 px-3 py-2"
      />

      <select
        value={priority}
        onChange={(event) => setPriority(event.target.value as TaskPriority)}
        disabled={isSubmitting}
        className="mt-3 w-full rounded border border-slate-300 px-3 py-2"
      >
        <option value="low">Low priority</option>
        <option value="medium">Medium priority</option>
        <option value="high">High priority</option>
      </select>

      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="mt-4 rounded bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Add task'}
      </button>
    </form>
  );
}

export default TaskForm;
