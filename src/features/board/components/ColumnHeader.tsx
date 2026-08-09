import type { BoardColumn } from '../types';

interface ColumnHeaderProps {
  column: BoardColumn;
}

function ColumnHeader({ column }: ColumnHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">{column.title}</h2>

      <span className="rounded bg-gray-200 px-2 py-1 text-sm">
        {column.tasks.length}
      </span>
    </div>
  );
}

export default ColumnHeader;
