import { useState, useMemo, useCallback } from 'react';
import type { Board, Cell } from '../../lib/board';
import { TRANSFORMATIONS, applyTransformation, serializeBoard, canonicalize } from '../../lib/board';
import { BoardCell } from '../BoardCell';

const DEFAULT_BOARD: Board = ['o', null, null, 'x', 'x', null, null, null, null];

const ROW_COLORS = ['bg-amber-200/40', 'bg-sky-200/40', 'bg-rose-200/40'];

function ColoredCell({ value, rowColor, size = 'sm' }: { value: Cell; rowColor: string; size?: 'sm' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-12 h-12 text-xl' : 'w-8 h-8 text-sm';
  return (
    <div className={`${sizeClass} flex items-center justify-center font-bold border border-base-content/30 ${rowColor}`}>
      {value === 'x' && <span className="text-primary">X</span>}
      {value === 'o' && <span className="text-secondary">O</span>}
    </div>
  );
}

function ColoredBoard({ board, size = 'sm' }: { board: Board; size?: 'sm' | 'lg' }) {
  return (
    <div className="grid grid-cols-3">
      {board.map((cell, i) => (
        <ColoredCell key={i} value={cell} rowColor={ROW_COLORS[Math.floor(i / 3)]} size={size} />
      ))}
    </div>
  );
}

function ColoredString({ text, size = 'sm' }: { text: string; size?: 'xs' | 'sm' }) {
  return (
    <code className={`font-mono ${size === 'xs' ? 'text-xs' : 'text-sm'}`}>
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
      <div className="card bg-base-100 shadow-sm p-3">
        <ColoredBoard board={currentBoard} size="lg" />
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
      <div className="flex flex-col gap-1.5 w-full">
        {uniqueSorted.map((item, i) => {
          const isCanonical = item.serialized === canonicalString;
          const isCurrent = item.serialized === currentSerialized;
          return (
            <div
              key={item.serialized}
              className={`flex items-center gap-2 p-1.5 rounded-lg transition-all ${
                isCanonical ? 'ring-2 ring-accent' :
                isCurrent ? 'ring-2 ring-base-content/30' : 'bg-base-100'
              }`}
            >
              <span className="text-xs opacity-50 w-4 text-right shrink-0">{i + 1}.</span>
              <div className="grid grid-cols-3 shrink-0">
                {item.board.map((cell, j) => (
                  <BoardCell key={j} value={cell} size="xs" />
                ))}
              </div>
              <span className={isCanonical ? 'font-bold' : 'opacity-70'}>
                <ColoredString text={item.serialized} size="xs" />
              </span>
              {isCanonical && (
                <span className="badge badge-accent badge-xs ml-auto shrink-0">
                  canônico
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
