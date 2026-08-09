import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold">{task.title}</h3>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs capitalize">
          {task.status}
        </span>
      </div>

      <p className="mt-2 text-sm text-slate-600">{task.description}</p>

      <p className="mt-4 text-sm font-medium capitalize text-slate-700">
        Priority: {task.priority}
      </p>
    </article>
  );
}

export default TaskCard;
