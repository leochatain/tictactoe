import { useState, useMemo, useCallback } from 'react';
import type { Board } from '../../lib/board';
import { TRANSFORMATIONS, applyTransformation, serializeBoard } from '../../lib/board';
import { BoardCell } from '../BoardCell';

const DEFAULT_BOARD: Board = ['o', null, null, 'x', 'x', null, null, null, null];

function MiniBoard({ board, highlighted }: { board: Board; highlighted?: boolean }) {
  return (
    <div className={`p-2 rounded-lg transition-all ${
      highlighted ? 'bg-accent/20 ring-2 ring-accent' : 'bg-base-100'
    }`}>
      <div className="grid grid-cols-3">
        {board.map((cell, i) => (
          <BoardCell key={i} value={cell} />
        ))}
      </div>
    </div>
  );
}

export function SymmetryViz() {
  const [currentBoard, setCurrentBoard] = useState<Board>(DEFAULT_BOARD);

  const rotateCW = useCallback(() => {
    setCurrentBoard(b => applyTransformation(b, TRANSFORMATIONS[1]));
  }, []);

  const rotateCCW = useCallback(() => {
    setCurrentBoard(b => applyTransformation(b, TRANSFORMATIONS[3]));
  }, []);

  const flip = useCallback(() => {
    setCurrentBoard(b => applyTransformation(b, TRANSFORMATIONS[4]));
  }, []);

  const reset = useCallback(() => {
    setCurrentBoard(DEFAULT_BOARD);
  }, []);

  // Deduplicated unique boards from all 8 transformations
  const uniqueBoards = useMemo(() => {
    const seen = new Set<string>();
    const boards: Board[] = [];
    for (const perm of TRANSFORMATIONS) {
      const board = applyTransformation(DEFAULT_BOARD, perm);
      const key = serializeBoard(board);
      if (!seen.has(key)) {
        seen.add(key);
        boards.push(board);
      }
    }
    return boards;
  }, []);

  const uniqueSerialized = useMemo(() =>
    uniqueBoards.map(b => serializeBoard(b)),
    [uniqueBoards]
  );

  const currentSerialized = serializeBoard(currentBoard);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Main board */}
      <div className="flex flex-col items-center gap-2">
        <div className="grid grid-cols-3 scale-150 my-4">
          {currentBoard.map((cell, i) => (
            <BoardCell key={i} value={cell} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 items-center">
        <button className="btn btn-sm btn-outline" onClick={rotateCCW} title="Rotação anti-horária">
          ↻
        </button>
        <button className="btn btn-sm btn-outline" onClick={rotateCW} title="Rotação horária">
          ↺
        </button>
        <button className="btn btn-sm btn-outline" onClick={flip} title="Reflexão horizontal">
          ↔
        </button>
      </div>

      {/* Unique game states */}
      <div>
        <span className="text-xs opacity-50 block text-center mb-2">
          {uniqueBoards.length} estados únicos
        </span>
        <div className="flex gap-3 flex-wrap justify-center">
          {uniqueBoards.map((board, i) => (
            <MiniBoard
              key={uniqueSerialized[i]}
              board={board}
              highlighted={currentSerialized === uniqueSerialized[i]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
