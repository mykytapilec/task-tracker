import { create } from 'zustand';

import { initialTasks } from './mockData';
import type { Task, TaskStatus } from './types';

interface CreateTaskInput {
  title: string;
  description: string;
  priority: Task['priority'];
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: Task['priority'];
}

interface TaskStore {
  tasks: Task[];
  addTask: (input: CreateTaskInput) => void;
  updateTask: (id: string, input: UpdateTaskInput) => void;
  deleteTask: (id: string) => void;
  changeTaskStatus: (id: string, status: TaskStatus) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: initialTasks,

  addTask: (input) => {
    const now = new Date().toISOString();

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      status: 'todo',
      priority: input.priority,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));
  },

  updateTask: (id, input) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...input,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  changeTaskStatus: (id, status) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    }));
  },
}));
