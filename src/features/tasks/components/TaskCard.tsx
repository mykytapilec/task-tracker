import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

import { useBoardStore } from '../../board/store';
import { useTaskStore } from '../store';
import type { Task, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
  onTaskOpen: (taskId: string) => void;
}

function TaskCard({ task, onTaskOpen }: TaskCardProps) {
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const currentBoard = useBoardStore((state) => state.board);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      disabled: isDeleting || isUpdatingStatus,
    });

  const { setNodeRef: setSubtaskDropRef, isOver: isSubtaskDropOver } =
    useDroppable({
      id: `subtask:${task.id}`,
      disabled: isDeleting || isUpdatingStatus,
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
  const isCompleted = task.status === 'completed';

  function handleCardOpen() {
    if (isDeleting || isUpdatingStatus) {
      return;
    }

    onTaskOpen(task.id);
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

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-lg bg-white p-4 shadow ${
        isCompleted ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          role="button"
          tabIndex={0}
          onClick={handleCardOpen}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleCardOpen();
            }
          }}
          className="min-w-0 flex-1 cursor-pointer rounded-md"
        >
          <div className="flex min-w-0 items-start gap-2">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => {
                void handleStatusChange();
              }}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              disabled={
                isUpdatingStatus || isDeleting || isInCompletedColumn
              }
              className="mt-1 h-4 w-4 shrink-0"
              aria-label={
                isCompleted ? 'Task completed' : 'Mark task as completed'
              }
            />

            <h3
              className={`min-w-0 break-words font-medium ${
                isCompleted ? 'text-slate-500 line-through' : ''
              }`}
            >
              {task.title}
            </h3>
          </div>

          <p
            className={`mt-2 break-words whitespace-pre-wrap text-sm ${
              isCompleted ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {task.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
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
        </div>

        <div className="flex shrink-0 flex-col gap-1">
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onTaskOpen(task.id);
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

      <div
        ref={setSubtaskDropRef}
        data-no-task-open="true"
        onClick={(event) => event.stopPropagation()}
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
            <TaskCard
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

export default TaskCard;