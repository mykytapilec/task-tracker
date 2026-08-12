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
  columnId: string;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  columnId?: string;
}

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  changeTaskStatus: (id: string, columnId: string) => Promise<void>;
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

  async addTask(input) {
    const task = await apiClient<ApiTask>('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: input.title,
        description: input.description,
        priority: input.priority.toUpperCase(),
        columnId: input.columnId,
      }),
    });

    set((state) => ({
      tasks: [...state.tasks, mapApiTask(task)],
    }));
  },

  async updateTask(id, input) {
    const task = await apiClient<ApiTask>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...input,
        ...(input.priority && {
          priority: input.priority.toUpperCase(),
        }),
      }),
    });

    set((state) => ({
      tasks: state.tasks.map((currentTask) =>
        currentTask.id === id ? mapApiTask(task) : currentTask,
      ),
    }));
  },

  async deleteTask(id) {
    await apiClient<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });

    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  async changeTaskStatus(id, columnId) {
    const task = await apiClient<ApiTask>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        columnId,
      }),
    });

    set((state) => ({
      tasks: state.tasks.map((currentTask) =>
        currentTask.id === id ? mapApiTask(task) : currentTask,
      ),
    }));
  },
}));
