import type { Task } from '../tasks/types';

export interface BoardColumn {
  id: string;
  title: string;
  position: number;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  columns: BoardColumn[];
}
