import { useTaskStore } from '../store';
import TaskCard from './TaskCard';

interface TaskListProps {
  onTaskOpen: (taskId: string) => void;
}

function TaskList({ onTaskOpen }: TaskListProps) {
  const tasks = useTaskStore((state) => state.tasks);

  return (
    <div className="mt-6 grid gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onTaskOpen={onTaskOpen}
        />
      ))}
    </div>
  );
}

export default TaskList;