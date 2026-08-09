import type { Board } from './types';

const now = new Date().toISOString();

export const initialBoard: Board = {
  id: 'board-1',
  title: 'Task Tracker Board',
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        {
          id: 'task-1',
          title: 'Create project structure',
          description: 'Initialize frontend architecture',
          status: 'todo',
          priority: 'high',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'task-2',
          title: 'Setup routing',
          description: 'Add application routes',
          status: 'todo',
          priority: 'medium',
          createdAt: now,
          updatedAt: now,
        },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [
        {
          id: 'task-3',
          title: 'Build Kanban board',
          description: 'Implement board components',
          status: 'in-progress',
          priority: 'high',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'task-4',
          title: 'Add drag and drop',
          description: 'Integrate dnd-kit interactions',
          status: 'in-progress',
          priority: 'medium',
          createdAt: now,
          updatedAt: now,
        },
      ],
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: [
        {
          id: 'task-5',
          title: 'Check application flow',
          description: 'Review current implementation',
          status: 'completed',
          priority: 'low',
          createdAt: now,
          updatedAt: now,
        },
      ],
    },
  ],
};
