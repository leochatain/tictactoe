import { useMemo, useState, useCallback } from 'react';
import { generateUniqueBoards, getChildKeys } from './lib/board';
import { TurnColumn } from './components/TurnColumn';

interface Selection {
  turn: number;
  canonicalKey: string;
}

function App() {
  const boardsByTurn = useMemo(() => generateUniqueBoards(), []);
  const [selection, setSelection] = useState<Selection | null>(null);

  const childKeys = useMemo(() => {
    if (!selection) return null;
    const entries = boardsByTurn.get(selection.turn);
    const entry = entries?.find(e => e.canonicalKey === selection.canonicalKey);
    if (!entry) return null;
    return getChildKeys(entry.board, selection.turn);
  }, [selection, boardsByTurn]);

  const handleBoardClick = useCallback((turn: number, canonicalKey: string) => {
    setSelection(prev =>
      prev && prev.turn === turn && prev.canonicalKey === canonicalKey
        ? null
        : { turn, canonicalKey }
    );
  }, []);

  return (
    <div className="min-h-screen bg-base-200 p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        Jogo da Velha — Unique Board States
      </h1>
      <p className="text-center text-sm opacity-70 mb-6">
        All unique tic-tac-toe boards by turn, accounting for rotational and reflective symmetry
      </p>
      <div className="flex flex-col gap-8">
        {Array.from(boardsByTurn.entries())
          .sort(([a], [b]) => a - b)
          .map(([turn, entries]) => (
            <TurnColumn
              key={turn}
              turn={turn}
              entries={entries}
              selection={selection}
              childKeys={turn === (selection?.turn ?? -1) + 1 ? childKeys : null}
              onBoardClick={handleBoardClick}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
