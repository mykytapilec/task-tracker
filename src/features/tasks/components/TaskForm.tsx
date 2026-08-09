import { useState } from 'react';

import { useTaskStore } from '../store';

function TaskForm() {
  const addTask = useTaskStore((state) => state.addTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    addTask({
      title,
      description,
      priority: 'medium',
    });

    setTitle('');
    setDescription('');
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
        className="mt-4 w-full rounded border border-slate-300 px-3 py-2"
      />

      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Task description"
        className="mt-3 w-full rounded border border-slate-300 px-3 py-2"
      />

      <button
        type="submit"
        className="mt-4 rounded bg-slate-900 px-4 py-2 text-white"
      >
        Add task
      </button>
    </form>
  );
}

export default TaskForm;
