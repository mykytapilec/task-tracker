import type { Task, TaskStatus } from '../tasks/types';

export interface BoardColumn {
  id: string;
  title: string;
  position: number;
  status: TaskStatus;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  columns: BoardColumn[];
}
