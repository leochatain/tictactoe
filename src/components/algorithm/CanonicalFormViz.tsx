import { useState, useMemo, useCallback } from 'react';
import type { Board, Cell } from '../../lib/board';
import { TRANSFORMATIONS, applyTransformation, serializeBoard, canonicalize } from '../../lib/board';
import { BoardCell } from '../BoardCell';

const DEFAULT_BOARD: Board = ['o', null, null, 'x', 'x', null, null, null, null];

const ROW_COLORS = ['bg-primary/10', 'bg-secondary/10', 'bg-accent/10'];

function ColoredCell({ value, rowColor }: { value: Cell; rowColor: string }) {
  return (
    <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold border border-base-300 ${rowColor}`}>
      {value === 'x' && <span className="text-primary">X</span>}
      {value === 'o' && <span className="text-secondary">O</span>}
    </div>
  );
}

function ColoredBoard({ board }: { board: Board }) {
  return (
    <div className="grid grid-cols-3">
      {board.map((cell, i) => (
        <ColoredCell key={i} value={cell} rowColor={ROW_COLORS[Math.floor(i / 3)]} />
      ))}
    </div>
  );
}

function ColoredString({ text }: { text: string }) {
  return (
    <code className="font-mono text-sm">
      {[0, 1, 2].map((row) => (
        <span key={row} className={`${ROW_COLORS[row]} px-0.5 rounded-sm`}>
          {text.slice(row * 3, row * 3 + 3)}
        </span>
      ))}
    </code>
  );
}

export function CanonicalFormViz() {
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

  // Unique boards sorted by serialized string
  const uniqueSorted = useMemo(() => {
    const seen = new Set<string>();
    const boards: { board: Board; serialized: string }[] = [];
    for (const perm of TRANSFORMATIONS) {
      const board = applyTransformation(DEFAULT_BOARD, perm);
      const key = serializeBoard(board);
      if (!seen.has(key)) {
        seen.add(key);
        boards.push({ board, serialized: key });
      }
    }
    boards.sort((a, b) => a.serialized.localeCompare(b.serialized));
    return boards;
  }, []);

  const canonicalString = canonicalize(DEFAULT_BOARD);
  const currentSerialized = serializeBoard(currentBoard);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Main board with row colors */}
      <div className="flex flex-col items-center gap-2">
        <div className="scale-150 my-4">
          <ColoredBoard board={currentBoard} />
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

      {/* Current board serialized with row colors */}
      <ColoredString text={currentSerialized} />

      {/* Unique boards with strings, sorted */}
      <div className="flex flex-col gap-2 w-full max-w-md">
        {uniqueSorted.map((item) => {
          const isCanonical = item.serialized === canonicalString;
          const isCurrent = item.serialized === currentSerialized;
          return (
            <div
              key={item.serialized}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                isCanonical ? 'ring-2 ring-accent' :
                isCurrent ? 'bg-base-300' : 'bg-base-100'
              }`}
            >
              <div className="grid grid-cols-3 shrink-0">
                {item.board.map((cell, j) => (
                  <BoardCell key={j} value={cell} />
                ))}
              </div>
              <code className={`text-sm font-mono ${isCanonical ? 'text-accent font-bold' : 'opacity-70'}`}>
                {item.serialized}
              </code>
              {isCanonical && (
                <span className="badge badge-accent badge-sm ml-auto shrink-0">
                  canônico
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center p-3 bg-base-100 rounded-lg">
        <span className="text-sm opacity-70">Forma canônica: </span>
        <code className="text-accent font-bold font-mono">{canonicalString}</code>
      </div>
    </div>
  );
}
