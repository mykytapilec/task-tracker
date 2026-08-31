import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  pointerWithin,
} from '@dnd-kit/core';
import { useState } from 'react';

import TaskForm from '../../tasks/components/TaskForm';
import { useTaskStore } from '../../tasks/store';
import type { Task, TaskPriority } from '../../tasks/types';

import { useBoardStore } from '../store';

import Column from './Column';

type TaskSortMode = 'manual' | 'priority-high' | 'priority-low';

const priorityOrder: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

function containsTask(task: Task, taskId: string): boolean {
  return task.subtasks.some(
    (subtask) =>
      subtask.id === taskId || containsTask(subtask, taskId),
  );
}

function collisionDetectionStrategy(args: Parameters<typeof pointerWithin>[0]) {
  const pointerCollisions = pointerWithin(args);

  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  return closestCenter(args);
}

function Board() {
  const currentBoard = useBoardStore((state) => state.board);
  const tasks = useTaskStore((state) => state.tasks);
  const reorderTask = useTaskStore((state) => state.reorderTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<TaskSortMode>('manual');

  if (!currentBoard) {
    return <p>Loading board...</p>;
  }

  const board = currentBoard;

  function handleDragStart(event: DragStartEvent) {
    setActiveTaskId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTaskId(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = String(active.id);
    const overId = String(over.id);

    const draggedTask = tasks.find((task) => task.id === taskId);

    if (!draggedTask) {
      return;
    }

    if (overId.startsWith('subtask:')) {
      const parentTaskId = overId.replace('subtask:', '');

      if (parentTaskId === taskId) {
        return;
      }

      const parentTask = tasks.find(
        (task) => task.id === parentTaskId,
      );

      if (!parentTask) {
        return;
      }

      if (containsTask(draggedTask, parentTaskId)) {
        return;
      }

      if (draggedTask.parentTaskId === parentTaskId) {
        return;
      }

      await updateTask(taskId, {
        parentTaskId,
      });

      return;
    }

    const overTask = tasks.find((task) => task.id === overId);

    if (overTask && !overTask.parentTaskId) {
      const targetTasks = tasks
        .filter(
          (task) =>
            task.columnId === overTask.columnId &&
            !task.parentTaskId &&
            task.id !== taskId,
        )
        .sort((a, b) => a.position - b.position);

      let position = targetTasks.findIndex(
        (task) => task.id === overTask.id,
      );

      if (position === -1) {
        return;
      }

      const activeRect = active.rect.current.translated;
      const overRect = over.rect;

      if (activeRect && overRect) {
        const activeCenterY =
          activeRect.top + activeRect.height / 2;
        const overCenterY =
          overRect.top + overRect.height / 2;

        if (activeCenterY > overCenterY) {
          position += 1;
        }
      }

      await reorderTask({
        taskId,
        columnId: overTask.columnId,
        position,
      });

      return;
    }

    const targetColumn = board.columns.find(
      (column) => column.id === overId,
    );

    if (targetColumn) {
      const targetTasks = tasks
        .filter(
          (task) =>
            task.columnId === targetColumn.id &&
            !task.parentTaskId &&
            task.id !== taskId,
        )
        .sort((a, b) => a.position - b.position);

      await reorderTask({
        taskId,
        columnId: targetColumn.id,
        position: targetTasks.length,
      });
    }
  }

  const columnsWithTasks = board.columns.map((column) => {
    const columnTasks = tasks
      .filter(
        (task) =>
          task.columnId === column.id &&
          !task.parentTaskId,
      )
      .sort((a, b) => {
        if (sortMode === 'manual') {
          return a.position - b.position;
        }

        const priorityDifference =
          priorityOrder[b.priority] -
          priorityOrder[a.priority];

        if (sortMode === 'priority-high') {
          return (
            priorityDifference ||
            a.position - b.position
          );
        }

        return (
          -priorityDifference ||
          a.position - b.position
        );
      });

    return {
      ...column,
      tasks: columnTasks,
    };
  });

  const activeTask = activeTaskId
    ? tasks.find((task) => task.id === activeTaskId)
    : null;

  return (
    <DndContext
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragEnd={(event) => {
        void handleDragEnd(event);
      }}
      onDragCancel={() => setActiveTaskId(null)}
    >
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">
            {board.title}
          </h1>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <span>Sort:</span>

            <select
              value={sortMode}
              onChange={(event) =>
                setSortMode(
                  event.target.value as TaskSortMode,
                )
              }
              className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option value="manual">Manual</option>
              <option value="priority-high">
                Priority: High → Low
              </option>
              <option value="priority-low">
                Priority: Low → High
              </option>
            </select>
          </label>
        </div>

        {columnsWithTasks[0] && (
          <div className="mt-6">
            <TaskForm columnId={columnsWithTasks[0].id} />
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {columnsWithTasks.map((column) => (
            <Column
              key={column.id}
              column={column}
            />
          ))}
        </div>
      </section>

      <DragOverlay>
        {activeTask ? (
          <article className="rounded-lg bg-white p-4 shadow-lg">
            <h3 className="font-medium">
              {activeTask.title}
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              {activeTask.description}
            </p>
          </article>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Board;