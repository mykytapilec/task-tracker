import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import ColumnHeader from './ColumnHeader';
import TaskCard from '../../tasks/components/TaskCard';

import type { BoardColumn } from '../types';

interface ColumnProps {
  column: BoardColumn;
}

function Column({ column }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-96 w-80 flex-col rounded-lg p-4 ${
        isOver ? 'bg-blue-50' : 'bg-gray-100'
      }`}
    >
      <ColumnHeader column={column} />

      <SortableContext
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="mt-4 flex flex-1 flex-col gap-3">
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default Column;
