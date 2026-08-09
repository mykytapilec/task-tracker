import { initialTasks } from '../tasks/mockData';
import type { Board } from './types';

export const initialBoard: Board = {
  id: 'default-board',
  title: 'Project Board',
  columns: [
    {
      id: 'todo',
      title: 'Todo',
      tasks: initialTasks.filter((task) => task.status === 'todo'),
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: initialTasks.filter((task) => task.status === 'in-progress'),
    },
    {
      id: 'completed',
      title: 'Done',
      tasks: initialTasks.filter((task) => task.status === 'completed'),
    },
  ],
};
