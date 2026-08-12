import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';

import { useBoardStore } from '../store';
import { useTaskStore } from '../../tasks/store';
import TaskForm from '../../tasks/components/TaskForm';

import Column from './Column';

function Board() {
  const board = useBoardStore((state) => state.board);
  const tasks = useTaskStore((state) => state.tasks);
  const changeTaskStatus = useTaskStore((state) => state.changeTaskStatus);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  if (!board) {
    return <p>Loading board...</p>;
  }

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
    const targetColumnId = String(over.id);

    const task = tasks.find((currentTask) => currentTask.id === taskId);

    if (!task || task.columnId === targetColumnId) {
      return;
    }

    const targetColumn = board?.columns.find(
      (column) => column.id === targetColumnId,
    );

    if (!targetColumn) {
      return;
    }

    await changeTaskStatus(taskId, targetColumnId);
  }

  const columnsWithTasks = board.columns.map((column) => ({
    ...column,
    tasks: tasks.filter((task) => task.columnId === column.id),
  }));

  const activeTask = activeTaskId
    ? tasks.find((task) => task.id === activeTaskId)
    : null;

  return (
    <DndContext
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
