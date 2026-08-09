import type { Task } from '../tasks/types';

export interface BoardColumn {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  columns: BoardColumn[];
}
