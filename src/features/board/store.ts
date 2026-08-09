import { create } from 'zustand';

import { initialBoard } from './mockData';
import type { Board } from './types';

interface BoardStore {
  board: Board;
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    destinationIndex: number,
  ) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: initialBoard,

  moveTask: (taskId, sourceColumnId, destinationColumnId, destinationIndex) =>
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

      const sourceTaskIndex = sourceColumn.tasks.findIndex(
        (task) => task.id === taskId,
      );

      if (sourceTaskIndex === -1) {
        return state;
      }

      const [task] = sourceColumn.tasks.splice(sourceTaskIndex, 1);

      const updatedTask = {
        ...task,
        status: destinationColumn.id,
      };

      destinationColumn.tasks.splice(destinationIndex, 0, updatedTask);

      return {
        board: {
          ...state.board,
          columns,
        },
      };
    }),
}));
