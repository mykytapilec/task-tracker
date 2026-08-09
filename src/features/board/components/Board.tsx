import { initialBoard } from '../mockData';
import Column from './Column';

function Board() {
  return (
    <section>
      <h1 className="text-2xl font-bold">{initialBoard.title}</h1>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {initialBoard.columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </section>
  );
}

export default Board;
