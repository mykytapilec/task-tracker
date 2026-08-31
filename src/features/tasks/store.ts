import { create } from 'zustand';

import { apiClient } from '../../api/client';
import { useBoardStore } from '../board/store';
import type { Task, TaskPriority } from './types';

interface CreateTaskInput {
  title: string;
  description?: string;
  columnId: string;
  priority?: TaskPriority;
  parentTaskId?: string | null;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  columnId?: string;
  priority?: TaskPriority;
  parentTaskId?: string | null;
  status?: 'pending' | 'completed';
}

interface ReorderTaskInput {
  taskId: string;
  columnId: string;
  position: number;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTask: (data: ReorderTaskInput) => Promise<void>;
}

function normalizeTask(task: Task): Task {
  return {
    ...task,
    subtasks: (task.subtasks ?? []).map(normalizeTask),
  };
}

function normalizeTasks(tasks: Task[]): Task[] {
  return tasks.map(normalizeTask);
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    const boardId = useBoardStore.getState().activeBoardId;

    if (!boardId) {
      set({
        tasks: [],
        error: null,
      });
      return;
    }

    set({
      isLoading: true,
      error: null,
    });

    try {
      const tasks = await apiClient<Task[]>('/tasks', {
        params: {
          boardId,
        },
      });

      set({
        tasks: normalizeTasks(tasks),
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
      });
    }
  },

  createTask: async (data) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      await apiClient<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      await useTaskStore.getState().fetchTasks();
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create task',
      });
    }
  },

  updateTask: async (id, data) => {
    try {
      await apiClient<Task>(`/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

      await useTaskStore.getState().fetchTasks();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update task',
      });
    }
  },

  deleteTask: async (id) => {
    try {
      await apiClient<void>(`/tasks/${id}`, {
        method: 'DELETE',
      });

      await useTaskStore.getState().fetchTasks();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete task',
      });
    }
  },

  reorderTask: async ({ taskId, columnId, position }) => {
    try {
      await apiClient<Task>(`/tasks/${taskId}/reorder`, {
        method: 'PATCH',
        body: JSON.stringify({
          columnId,
          position,
        }),
      });

      await useTaskStore.getState().fetchTasks();
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to reorder task',
      });
    }
  },
}));