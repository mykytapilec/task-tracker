import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';

import { useBoardStore } from '../store';

import Column from './Column';

function Board() {
  const board = useBoardStore((state) => state.board);
  const moveTask = useBoardStore((state) => state.moveTask);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const sourceColumn = board.columns.find((column) =>
      column.tasks.some((task) => task.id === active.id),
    );

    if (!sourceColumn) {
      return;
    }

    const destinationColumn = board.columns.find(
      (column) =>
        column.id === over.id ||
        column.tasks.some((task) => task.id === over.id),
    );

    if (!destinationColumn) {
      return;
    }

    const destinationIndex = destinationColumn.tasks.findIndex(
      (task) => task.id === over.id,
    );

    const targetIndex =
      destinationIndex === -1
        ? destinationColumn.tasks.length
        : destinationIndex;

    moveTask(
      String(active.id),
      sourceColumn.id,
      destinationColumn.id,
      targetIndex,
    );
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <section>
        <h1 className="text-2xl font-bold">{board.title}</h1>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {board.columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
        </div>
      </section>
    </DndContext>
  );
}

export default Board;
