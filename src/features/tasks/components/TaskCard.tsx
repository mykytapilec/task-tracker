import { useState, type FormEvent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useTaskStore } from '../store';
import type { Task, TaskPriority } from '../types';

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      disabled: isEditing || isDeleting,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleEdit() {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setIsEditing(true);
  }

  function handleCancel() {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setIsEditing(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
      });

      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteTask(task.id);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isEditing) {
    return (
      <article
        ref={setNodeRef}
        style={style}
        className="rounded-lg bg-white p-4 shadow"
      >
        <form onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title"
            disabled={isSaving}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Task description"
            disabled={isSaving}
            className="mt-3 min-h-20 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />

          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TaskPriority)
            }
            disabled={isSaving}
            className="mt-3 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={isSaving || !title.trim()}
              className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab rounded-lg bg-white p-4 shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium">{task.title}</h3>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              handleEdit();
            }}
            disabled={isDeleting}
            className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Edit
          </button>

          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              void handleDelete();
            }}
            disabled={isDeleting}
            className="rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <p className="mt-2 text-sm text-slate-600">{task.description}</p>

      <div className="mt-3">
        <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
          {task.priority}
        </span>
      </div>
    </article>
  );
}

export default TaskCard;
