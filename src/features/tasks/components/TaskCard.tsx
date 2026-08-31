import { useDroppable } from '@dnd-kit/core';
import { useState, type FormEvent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useBoardStore } from '../../board/store';
import { useTaskStore } from '../store';
import type { Task, TaskPriority, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const currentBoard = useBoardStore((state) => state.board);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      disabled: isEditing || isDeleting || isUpdatingStatus,
    });

  const { setNodeRef: setSubtaskDropRef, isOver: isSubtaskDropOver } =
    useDroppable({
      id: `subtask:${task.id}`,
      disabled: isEditing || isDeleting || isUpdatingStatus,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const completedColumnId =
    currentBoard?.columns
      .slice()
      .sort((a, b) => a.position - b.position)
      .at(-1)?.id ?? null;

  const isInCompletedColumn = task.columnId === completedColumnId;

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

  async function handleStatusChange() {
    if (
      isUpdatingStatus ||
      isDeleting ||
      isInCompletedColumn ||
      !completedColumnId
    ) {
      return;
    }

    const nextStatus: TaskStatus =
      task.status === 'completed' ? 'pending' : 'completed';

    setIsUpdatingStatus(true);

    try {
      await updateTask(task.id, {
        status: nextStatus,
        columnId: completedColumnId,
      });
    } finally {
      setIsUpdatingStatus(false);
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

  const isCompleted = task.status === 'completed';

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab rounded-lg bg-white p-4 shadow ${
        isCompleted ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => {
              void handleStatusChange();
            }}
            onPointerDown={(event) => event.stopPropagation()}
            disabled={
              isUpdatingStatus || isDeleting || isInCompletedColumn
            }
            className="mt-1 h-4 w-4 shrink-0"
            aria-label={
              isCompleted ? 'Task completed' : 'Mark task as completed'
            }
          />

          <h3
            className={`font-medium ${
              isCompleted ? 'text-slate-500 line-through' : ''
            }`}
          >
            {task.title}
          </h3>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              handleEdit();
            }}
            disabled={isDeleting || isUpdatingStatus}
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
            disabled={isDeleting || isUpdatingStatus}
            className="rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <p
        className={`mt-2 text-sm ${
          isCompleted ? 'text-slate-400' : 'text-slate-600'
        }`}
      >
        {task.description}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
          {task.priority}
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

      <div
        ref={setSubtaskDropRef}
        className={`mt-4 rounded border border-dashed px-3 py-2 text-xs transition ${
          isSubtaskDropOver
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-slate-300 text-slate-500'
        }`}
      >
        Drop here to make subtask
      </div>

      {task.subtasks.length > 0 && (
        <div className="mt-3 space-y-2 border-l-2 border-slate-200 pl-3">
          {task.subtasks.map((subtask) => (
            <TaskCard key={subtask.id} task={subtask} />
          ))}
        </div>
      )}
    </article>
  );
}

export default TaskCard;