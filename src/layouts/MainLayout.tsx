import { useState } from 'react';
import type { ReactNode } from 'react';

import { useBoardStore } from '../features/board/store';

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const boards = useBoardStore((state) => state.boards);
  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const selectBoard = useBoardStore((state) => state.selectBoard);
  const createBoard = useBoardStore((state) => state.createBoard);
  const isLoading = useBoardStore((state) => state.isLoading);

  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  async function handleBoardChange(boardId: string) {
    await selectBoard(boardId);
  }

  async function handleCreateBoard() {
    const title = newBoardTitle.trim();

    if (!title || isCreatingBoard) {
      return;
    }

    setIsCreatingBoard(true);

    try {
      await createBoard(title);
      setNewBoardTitle('');
    } finally {
      setIsCreatingBoard(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight">Task Tracker</h1>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={activeBoardId ?? ''}
              onChange={(event) => {
                void handleBoardChange(event.target.value);
              }}
              disabled={isLoading || !boards.length}
              className="rounded border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.title}
                </option>
              ))}
            </select>

            <input
              value={newBoardTitle}
              onChange={(event) => setNewBoardTitle(event.target.value)}
              placeholder="New board title"
              className="rounded border border-slate-300 px-3 py-2 text-sm"
              disabled={isCreatingBoard}
            />

            <button
              type="button"
              onClick={() => {
                void handleCreateBoard();
              }}
              disabled={isCreatingBoard || !newBoardTitle.trim()}
              className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreatingBoard ? 'Creating...' : 'Add board'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}

export default MainLayout;
