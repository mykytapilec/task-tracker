import { create } from 'zustand';

import { apiClient } from '../../api/client.js';
import type { Board, BoardColumn } from './types.js';

interface ApiColumn {
  id: string;
  title: string;
  position: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiBoard {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  columns: ApiColumn[];
}

interface BoardStore {
  board: Board | null;
  isLoading: boolean;
  fetchBoard: () => Promise<void>;
}

const mapApiColumn = (column: ApiColumn): BoardColumn => ({
  id: column.id,
  title: column.title,
  position: column.position,
  status:
    column.position === 0
      ? 'todo'
      : column.position === 1
        ? 'in-progress'
        : 'completed',
  tasks: [],
});

const mapApiBoard = (board: ApiBoard): Board => ({
  id: board.id,
  title: board.title,
  columns: board.columns.map(mapApiColumn),
});

export const useBoardStore = create<BoardStore>((set) => ({
  board: null,
  isLoading: false,

  async fetchBoard() {
    set({ isLoading: true });

    try {
      const board = await apiClient<ApiBoard>('/board');

      set({
        board: mapApiBoard(board),
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
