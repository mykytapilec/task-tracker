import { useTaskStore } from '../store';
import TaskCard from './TaskCard';

function TaskList() {
  const tasks = useTaskStore((state) => state.tasks);

  return (
    <div className="mt-6 grid gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;
