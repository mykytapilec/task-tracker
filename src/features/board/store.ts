import { create } from 'zustand';

import { initialBoard } from './mockData';
import type { Board } from './types';

interface BoardStore {
  board: Board;
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
  ) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: initialBoard,

  moveTask: (taskId, sourceColumnId, destinationColumnId) =>
    set((state) => {
      const columns = state.board.columns.map((column) => ({
        ...column,
        tasks: [...column.tasks],
      }));

      const sourceColumn = columns.find(
        (column) => column.id === sourceColumnId,
      );

      const destinationColumn = columns.find(
        (column) => column.id === destinationColumnId,
      );

      if (!sourceColumn || !destinationColumn) {
        return state;
      }

      const taskIndex = sourceColumn.tasks.findIndex(
        (task) => task.id === taskId,
      );

      if (taskIndex === -1) {
        return state;
      }

      const [task] = sourceColumn.tasks.splice(taskIndex, 1);

      destinationColumn.tasks.push({
        ...task,
        status: destinationColumn.id,
      });

      return {
        board: {
          ...state.board,
          columns,
        },
      };
    }),
}));
