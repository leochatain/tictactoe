import { useMemo } from 'react';
import type { Board } from '../../lib/board';
import { TRANSFORMATIONS, TRANSFORMATION_LABELS, applyTransformation, serializeBoard } from '../../lib/board';
import { BoardCell } from '../BoardCell';

const DEFAULT_BOARD: Board = ['o', null, null, null, 'x', null, null, null, null];

export function CanonicalFormViz() {
  const transformedWithStrings = useMemo(() => {
    const items = TRANSFORMATIONS.map((perm, i) => {
      const board = applyTransformation(DEFAULT_BOARD, perm);
      return {
        board,
        label: TRANSFORMATION_LABELS[i],
        serialized: serializeBoard(board),
        originalIndex: i,
      };
    });
    // Sort by serialized string (lexicographic)
    items.sort((a, b) => a.serialized.localeCompare(b.serialized));
    return items;
  }, []);

  const canonicalString = transformedWithStrings[0].serialized;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex flex-col gap-2 w-full max-w-md">
        {transformedWithStrings.map((item, i) => {
          const isCanonical = i === 0;
          return (
            <div
              key={item.originalIndex}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                isCanonical ? 'bg-accent/20 ring-2 ring-accent' : 'bg-base-100'
              }`}
            >
              <div className="grid grid-cols-3 flex-shrink-0">
                {item.board.map((cell, j) => (
                  <BoardCell key={j} value={cell} />
                ))}
              </div>
              <div className="flex flex-col min-w-0">
                <code className={`text-sm font-mono ${isCanonical ? 'text-accent font-bold' : 'opacity-70'}`}>
                  {item.serialized}
                </code>
                <span className="text-xs opacity-50">{item.label}</span>
              </div>
              {isCanonical && (
                <span className="badge badge-accent badge-sm ml-auto flex-shrink-0">
                  canônico
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-2 p-3 bg-base-100 rounded-lg">
        <span className="text-sm opacity-70">Forma canônica: </span>
        <code className="text-accent font-bold font-mono">{canonicalString}</code>
      </div>
    </div>
  );
}
