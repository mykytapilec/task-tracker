import { create } from 'zustand';

import { apiClient } from '../../api/client.js';
import type { Board } from './types.js';

interface ApiColumn {
  id: string;
  title: string;
  position: number;
}

interface ApiBoard {
  id: string;
  title: string;
  columns: ApiColumn[];
}

interface BoardStore {
  board: Board | null;
  isLoading: boolean;
  fetchBoard: () => Promise<void>;
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: null,
  isLoading: false,

  async fetchBoard() {
    set({ isLoading: true });

    try {
      const board = await apiClient<ApiBoard>('/board');

      set({
        board: {
          id: board.id,
          title: board.title,
          columns: board.columns.map((column) => ({
            ...column,
            tasks: [],
          })),
        },
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
