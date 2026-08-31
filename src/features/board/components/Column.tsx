import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import TaskCard from '../../tasks/components/TaskCard';

import type { BoardColumn } from '../types';

import ColumnHeader from './ColumnHeader';

interface ColumnProps {
  column: BoardColumn;
}

function Column({ column }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex min-h-96 w-80 flex-col rounded-lg bg-gray-100 p-4">
      <ColumnHeader column={column} />

      <SortableContext
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="mt-4 flex flex-1 flex-col gap-3">
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))}

          <div
            ref={setNodeRef}
            className={`min-h-24 flex-1 rounded border-2 border-dashed transition ${
              isOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-transparent'
            }`}
          />
        </div>
      </SortableContext>
    </div>
  );
}

export default Column;