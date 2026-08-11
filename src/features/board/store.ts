import { create } from 'zustand';

import type { Board } from './types.js';

interface BoardStore {
  board: Board;
}

const initialBoard: Board = {
  id: 'board-1',
  title: 'Task Tracker Board',
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      tasks: [],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [],
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: [],
    },
  ],
};

export const useBoardStore = create<BoardStore>(() => ({
  board: initialBoard,
}));
