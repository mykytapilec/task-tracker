import { useDroppable } from '@dnd-kit/core';

import type { BoardColumn } from '../types';
import TaskCard from '../../tasks/components/TaskCard';
import type { Task } from '../../tasks/types';

interface ColumnProps {
  column: BoardColumn & {
    tasks: Task[];
  };
  onTaskOpen: (taskId: string) => void;
}

function Column({ column, onTaskOpen }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <section
      ref={setNodeRef}
      className={`min-w-0 rounded-xl border p-4 transition ${
        isOver
          ? 'border-blue-400 bg-blue-50'
          : 'border-slate-200 bg-slate-50'
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-800">{column.title}</h2>

        <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-500">
          {column.tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onTaskOpen={onTaskOpen}
          />
        ))}

        {!column.tasks.length && (
          <p className="rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-sm text-slate-500">
            No tasks
          </p>
        )}
      </div>
    </section>
  );
}

export default Column;