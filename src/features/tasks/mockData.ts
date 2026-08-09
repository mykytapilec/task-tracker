import type { Task } from './types';

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Create project structure',
    description: 'Initialize React application architecture.',
    status: 'completed',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Implement task management',
    description: 'Add task creation and editing functionality.',
    status: 'in-progress',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
