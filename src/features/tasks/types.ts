export type TaskStatus = 'pending' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  columnId: string;
  position: number;
  parentTaskId: string | null;
  subtasks: Task[];
  createdAt: string;
  updatedAt: string;
}