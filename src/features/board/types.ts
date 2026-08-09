import type { Task, TaskStatus } from '../tasks/types';

export interface BoardColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  columns: BoardColumn[];
}
