import { create } from 'zustand';

import { apiClient } from '../../api/client.js';
import type { Task, TaskPriority, TaskStatus } from './types.js';

interface ApiTask {
  id: string;
  title: string;
  description: string | null;
  position: number;
  priority: number;
  columnId: string;
  parentTaskId: string | null;
  column: {
    id: string;
    title: string;
    position: number;
  };
  subtasks?: ApiTask[];
  createdAt: string;
  updatedAt: string;
}

interface CreateTaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
  columnId: string;
  parentTaskId?: string | null;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  columnId?: string;
  parentTaskId?: string | null;
}

interface ReorderTasksInput {
  taskId: string;
  columnId: string;
  position: number;
}

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  changeTaskStatus: (id: string, columnId: string) => Promise<void>;
  reorderTasks: (input: ReorderTasksInput) => Promise<void>;
}

const mapPriority = (priority: ApiTask['priority']): TaskPriority => {
  if (priority === 3) {
    return 'high';
  }

  if (priority === 2) {
    return 'medium';
  }

  return 'low';
};

const mapColumnToStatus = (columnTitle: string): TaskStatus => {
  if (columnTitle === 'To Do') {
    return 'todo';
  }

  if (columnTitle === 'In Progress') {
    return 'in-progress';
  }

  return 'completed';
};

const mapApiTask = (task: ApiTask): Task => ({
  id: task.id,
  title: task.title,
  description: task.description ?? '',
  status: mapColumnToStatus(task.column.title),
  priority: mapPriority(task.priority),
  columnId: task.columnId,
  position: task.position,
  parentTaskId: task.parentTaskId,
  subtasks: task.subtasks?.map(mapApiTask) ?? [],
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

const buildTaskTree = (tasks: ApiTask[]): ApiTask[] => {
  const taskMap = new Map<string, ApiTask>();

  for (const task of tasks) {
    taskMap.set(task.id, {
      ...task,
      subtasks: [],
    });
  }

  for (const task of tasks) {
    if (!task.parentTaskId) {
      continue;
    }

    const parentTask = taskMap.get(task.parentTaskId);

    if (!parentTask) {
      continue;
    }

    parentTask.subtasks = [
      ...(parentTask.subtasks ?? []),
      taskMap.get(task.id)!,
    ];
  }

  return tasks
    .filter((task) => !task.parentTaskId)
    .map((task) => taskMap.get(task.id)!)
    .sort((a, b) => a.position - b.position);
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  isLoading: false,

  async fetchTasks() {
    set({ isLoading: true });

    try {
      const response = await apiClient<ApiTask[]>('/tasks');
      const tasks = buildTaskTree(response);

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
    await apiClient<ApiTask>('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: input.title,
        description: input.description,
        priority:
          input.priority === 'high' ? 3 : input.priority === 'medium' ? 2 : 1,
        columnId: input.columnId,
        parentTaskId: input.parentTaskId ?? null,
      }),
    });

    await useTaskStore.getState().fetchTasks();
  },

  async updateTask(id, input) {
    await apiClient<ApiTask>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...input,
        ...(input.priority && {
          priority:
            input.priority === 'high' ? 3 : input.priority === 'medium' ? 2 : 1,
        }),
      }),
    });

    await useTaskStore.getState().fetchTasks();
  },

  async deleteTask(id) {
    await apiClient<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });

    await useTaskStore.getState().fetchTasks();
  },

  async changeTaskStatus(id, columnId) {
    await apiClient<ApiTask>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        columnId,
      }),
    });

    await useTaskStore.getState().fetchTasks();
  },

  async reorderTasks({ taskId, columnId, position }) {
    await apiClient<ApiTask>(`/tasks/${taskId}/reorder`, {
      method: 'PATCH',
      body: JSON.stringify({
        columnId,
        position,
      }),
    });

    await useTaskStore.getState().fetchTasks();
  },
}));
