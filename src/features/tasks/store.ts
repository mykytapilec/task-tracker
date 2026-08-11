import { create } from 'zustand';

import { apiClient } from '../../api/client.js';
import type { Task, TaskPriority, TaskStatus } from './types.js';

interface ApiTask {
  id: string;
  title: string;
  description: string | null;
  position: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  columnId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateTaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
}

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (input: CreateTaskInput) => void;
  updateTask: (id: string, input: UpdateTaskInput) => void;
  deleteTask: (id: string) => void;
  changeTaskStatus: (id: string, status: TaskStatus) => void;
}

const mapPriority = (priority: ApiTask['priority']): TaskPriority => {
  return priority.toLowerCase() as TaskPriority;
};

const mapColumnToStatus = (columnId: string): TaskStatus => {
  if (columnId === 'todo') {
    return 'todo';
  }

  if (columnId === 'in-progress') {
    return 'in-progress';
  }

  return 'completed';
};

const mapApiTask = (task: ApiTask): Task => ({
  id: task.id,
  title: task.title,
  description: task.description ?? '',
  status: mapColumnToStatus(task.columnId),
  priority: mapPriority(task.priority),
  columnId: task.columnId,
  position: task.position,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  isLoading: false,

  async fetchTasks() {
    set({ isLoading: true });

    try {
      const tasks = await apiClient<ApiTask[]>('/tasks');

      set({
        tasks: tasks.map(mapApiTask),
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addTask: () => {
    throw new Error('Task creation is not implemented yet');
  },

  updateTask: () => {
    throw new Error('Task update is not implemented yet');
  },

  deleteTask: () => {
    throw new Error('Task deletion is not implemented yet');
  },

  changeTaskStatus: () => {
    throw new Error('Task status update is not implemented yet');
  },
}));
