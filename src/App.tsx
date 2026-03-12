import { useMemo } from 'react';
import { generateUniqueBoards } from './lib/board';
import { TurnColumn } from './components/TurnColumn';

function App() {
  const boardsByTurn = useMemo(() => generateUniqueBoards(), []);

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Jogo da Velha — Unique Board States
      </h1>
      <p className="text-center text-sm opacity-70 mb-6">
        All unique tic-tac-toe boards by turn, accounting for rotational and reflective symmetry
      </p>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {Array.from(boardsByTurn.entries())
          .sort(([a], [b]) => a - b)
          .map(([turn, boards]) => (
            <TurnColumn key={turn} turn={turn} boards={boards} />
          ))}
      </div>
    </div>
  );
}

export default App;
