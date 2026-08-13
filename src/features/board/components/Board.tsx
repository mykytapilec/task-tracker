import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';

import TaskForm from '../../tasks/components/TaskForm';
import { useTaskStore } from '../../tasks/store';
import { useBoardStore } from '../store';

import Column from './Column';

function Board() {
  const currentBoard = useBoardStore((state) => state.board);
  const tasks = useTaskStore((state) => state.tasks);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  if (!currentBoard) {
    return <p>Loading board...</p>;
  }

  const board = currentBoard;

  function handleDragStart(event: DragStartEvent) {
    setActiveTaskId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
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

    const targetColumn = board.columns.find((column) => column.id === overId);

    if (targetColumn) {
      const targetTasks = tasks
        .filter((task) => task.columnId === targetColumn.id)
        .sort((a, b) => a.position - b.position);

      const position = targetTasks.length;

      void reorderTasks({
        taskId,
        columnId: targetColumn.id,
        position,
      });

      return;
    }

    const overTask = tasks.find((task) => task.id === overId);

    if (!overTask) {
      return;
    }

    const targetTasks = tasks
      .filter((task) => task.columnId === overTask.columnId)
      .sort((a, b) => a.position - b.position);

    let position = targetTasks.findIndex((task) => task.id === overTask.id);

    if (position === -1) {
      return;
    }

    const activeRect = active.rect.current.translated;
    const overRect = over.rect;

    if (activeRect && overRect) {
      const activeCenterY = activeRect.top + activeRect.height / 2;
      const overCenterY = overRect.top + overRect.height / 2;

      if (activeCenterY > overCenterY) {
        position += 1;
      }
    }

    if (
      draggedTask.columnId === overTask.columnId &&
      draggedTask.position < overTask.position
    ) {
      position -= 1;
    }

    reorderTasks({
      taskId,
      columnId: overTask.columnId,
      position: Math.max(0, position),
    });
  }

  const columnsWithTasks = board.columns.map((column) => ({
    ...column,
    tasks: tasks
      .filter((task) => task.columnId === column.id)
      .sort((a, b) => a.position - b.position),
  }));

  const activeTask = activeTaskId
    ? tasks.find((task) => task.id === activeTaskId)
    : null;

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTaskId(null)}
    >
      <section>
        <h1 className="text-2xl font-bold">{board.title}</h1>

        {columnsWithTasks[0] && (
          <div className="mt-6">
            <TaskForm columnId={columnsWithTasks[0].id} />
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {columnsWithTasks.map((column) => (
            <Column key={column.id} column={column} />
          ))}
        </div>
      </section>

      <DragOverlay>
        {activeTask ? (
          <article className="rounded-lg bg-white p-4 shadow-lg">
            <h3 className="font-medium">{activeTask.title}</h3>

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
