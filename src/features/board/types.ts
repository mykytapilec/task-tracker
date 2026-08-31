export interface Column {
  id: string;
  title: string;
  position: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardColumn extends Column {
  tasks: import('../tasks/types').Task[];
}

export interface Board {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  columns: Column[];
}
