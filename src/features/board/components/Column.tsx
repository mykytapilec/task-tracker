import type { BoardColumn } from '../types';
import TaskCard from '../../tasks/components/TaskCard';
import ColumnHeader from './ColumnHeader';

interface ColumnProps {
  column: BoardColumn;
}

function Column({ column }: ColumnProps) {
  return (
    <section className="min-h-96 rounded-lg bg-slate-100 p-4">
      <ColumnHeader title={column.title} count={column.tasks.length} />

      <div className="mt-4 space-y-3">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}

export default Column;
