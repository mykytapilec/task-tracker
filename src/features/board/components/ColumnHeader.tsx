interface ColumnHeaderProps {
  title: string;
  count: number;
}

function ColumnHeader({ title, count }: ColumnHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-semibold">{title}</h2>

      <span className="rounded-full bg-slate-200 px-2 py-1 text-xs">
        {count}
      </span>
    </div>
  );
}

export default ColumnHeader;
