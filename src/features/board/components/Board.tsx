import { DndContext } from '@dnd-kit/core';

import { useBoardStore } from '../store.js';

import Column from './Column.js';

function Board() {
  const board = useBoardStore((state) => state.board);
  const isLoading = useBoardStore((state) => state.isLoading);

  const handleDragEnd = () => {
    return;
  };

  if (isLoading) {
    return <p>Loading board...</p>;
  }

  if (!board) {
    return <p>Board not found.</p>;
  }

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
