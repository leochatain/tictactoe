import { useMemo, useState, useCallback } from 'react';
import { generateUniqueBoards, getChildKeys, getParentKeys } from './lib/board';
import { TurnColumn } from './components/TurnColumn';

interface Selection {
  turn: number;
  canonicalKey: string;
}

function App() {
  const boardsByTurn = useMemo(() => generateUniqueBoards(), []);
  const [selection, setSelection] = useState<Selection | null>(null);

  const highlightedKeys = useMemo(() => {
    if (!selection) return null;
    const entries = boardsByTurn.get(selection.turn);
    const entry = entries?.find(e => e.canonicalKey === selection.canonicalKey);
    if (!entry) return null;

    const map = new Map<number, Set<string>>();
    map.set(selection.turn, new Set([selection.canonicalKey]));

    // Walk ancestors backwards
    for (let t = selection.turn - 1; t >= 0; t--) {
      const nextTurnKeys = map.get(t + 1)!;
      const parentSet = new Set<string>();
      const nextEntries = boardsByTurn.get(t + 1) ?? [];
      for (const e of nextEntries) {
        if (nextTurnKeys.has(e.canonicalKey)) {
          for (const k of getParentKeys(e.board, t + 1)) parentSet.add(k);
        }
      }
      if (parentSet.size === 0) break;
      map.set(t, parentSet);
    }

    // Walk descendants forwards
    for (let t = selection.turn + 1; t <= 9; t++) {
      const prevTurnKeys = map.get(t - 1)!;
      const childSet = new Set<string>();
      const prevEntries = boardsByTurn.get(t - 1) ?? [];
      for (const e of prevEntries) {
        if (prevTurnKeys.has(e.canonicalKey)) {
          for (const k of getChildKeys(e.board, t - 1)) childSet.add(k);
        }
      }
      if (childSet.size === 0) break;
      map.set(t, childSet);
    }

    return map;
  }, [selection, boardsByTurn]);

  const [zoom, setZoom] = useState(1);

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
      <p className="text-center text-sm opacity-70 mb-4">
        All unique tic-tac-toe boards by turn, accounting for rotational and reflective symmetry
      </p>
      <div className="flex items-center justify-center gap-3 mb-6">
        <button className="btn btn-xs btn-ghost" onClick={() => setZoom(z => Math.max(0.25, +(z - 0.25).toFixed(2)))}>-</button>
        <input
          type="range"
          className="range range-xs w-32"
          min={0.25}
          max={2}
          step={0.25}
          value={zoom}
          onChange={e => setZoom(+e.target.value)}
        />
        <button className="btn btn-xs btn-ghost" onClick={() => setZoom(z => Math.min(2, +(z + 0.25).toFixed(2)))}>+</button>
        <span className="text-xs opacity-60 w-12">{Math.round(zoom * 100)}%</span>
      </div>
      <div className="flex flex-col gap-8">
        {Array.from(boardsByTurn.entries())
          .sort(([a], [b]) => a - b)
          .map(([turn, entries]) => (
            <TurnColumn
              key={turn}
              turn={turn}
              entries={entries}
              selection={selection}
              highlightedKeys={selection ? (highlightedKeys?.get(turn) ?? null) : null}
              zoom={zoom}
              onBoardClick={handleBoardClick}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
