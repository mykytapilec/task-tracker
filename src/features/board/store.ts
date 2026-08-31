import { create } from 'zustand';

import { apiClient } from '../../api/client';
import type { Board } from './types';

interface BoardState {
  boards: Board[];
  board: Board | null;
  activeBoardId: string | null;
  isLoading: boolean;
  error: string | null;

  fetchBoards: () => Promise<void>;
  selectBoard: (boardId: string) => Promise<void>;
  createBoard: (title: string) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  board: null,
  activeBoardId: null,
  isLoading: false,
  error: null,

  fetchBoards: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const boards = await apiClient<Board[]>('/boards');

      const currentActiveBoardId = get().activeBoardId;

      const activeBoard =
        boards.find((board) => board.id === currentActiveBoardId) ??
        boards[0] ??
        null;

      set({
        boards,
        board: activeBoard,
        activeBoardId: activeBoard?.id ?? null,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch boards',
      });
    }
  },

  selectBoard: async (boardId: string) => {
    const existingBoard = get().boards.find((board) => board.id === boardId);

    if (existingBoard) {
      set({
        board: existingBoard,
        activeBoardId: boardId,
        error: null,
      });
      return;
    }

    set({
      isLoading: true,
      error: null,
    });

    try {
      const board = await apiClient<Board>(`/boards/${boardId}`);

      set({
        board,
        activeBoardId: boardId,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch board',
      });
    }
  },

  createBoard: async (title: string) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const newBoard = await apiClient<Board>('/boards', {
        method: 'POST',
        body: JSON.stringify({ title }),
      });

      set((state) => ({
        boards: [...state.boards, newBoard],
        board: newBoard,
        activeBoardId: newBoard.id,
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to create board',
      });
    }
  },
}));
