import { useMemo } from 'react';
import type { Board, Cell } from '../../lib/board';
import { canonicalize, serializeBoard } from '../../lib/board';
import { BoardCell } from '../BoardCell';

// X in center — maximum symmetry, produces dramatic deduplication (8 → 2)
const PARENT_BOARD: Board = [null, null, null, null, 'x', null, null, null, null];
const NEXT_PLAYER: Cell = 'o';
const PARENT_TURN = 1;

const CANONICAL_COLORS = [
  'bg-emerald-200/50',
  'bg-violet-200/50',
  'bg-amber-200/50',
  'bg-sky-200/50',
  'bg-rose-200/50',
  'bg-lime-200/50',
  'bg-fuchsia-200/50',
  'bg-orange-200/50',
];

interface ChildEntry {
  board: Board;
  position: number;
  canonicalKey: string;
  serialized: string;
  isDuplicate: boolean;
}

export function ExpansionViz() {
  const { children, uniqueSet } = useMemo(() => {
    const seen = new Set<string>();
    const children: ChildEntry[] = [];

    for (let i = 0; i < 9; i++) {
      if (PARENT_BOARD[i] !== null) continue;

      const child = [...PARENT_BOARD] as Board;
      child[i] = NEXT_PLAYER;
      const key = canonicalize(child);
      const isDuplicate = seen.has(key);
      if (!isDuplicate) seen.add(key);

      children.push({
        board: child,
        position: i,
        canonicalKey: key,
        serialized: serializeBoard(child),
        isDuplicate,
      });
    }

    return { children, uniqueSet: new Set(seen) };
  }, []);

  const keyColors = useMemo(() => {
    const map = new Map<string, string>();
    let i = 0;
    for (const key of uniqueSet) {
      map.set(key, CANONICAL_COLORS[i % CANONICAL_COLORS.length]);
      i++;
    }
    return map;
  }, [uniqueSet]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Parent board */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-semibold opacity-70">
          n={PARENT_TURN} — Tabuleiro pai
        </span>
        <div className="grid grid-cols-3">
          {PARENT_BOARD.map((cell, i) => (
            <BoardCell key={i} value={cell} />
          ))}
        </div>
        <span className="text-xs opacity-50">
          {9 - PARENT_TURN} células vazias → {9 - PARENT_TURN} movimentos possíveis
        </span>
      </div>

      <div className="text-xl opacity-30">↓</div>

      {/* Children */}
      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-sm font-semibold opacity-70 text-center">
          Filhos (O em cada célula vazia)
        </span>
        {children.map((child, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-1.5 rounded-lg bg-base-100"
          >
            <div className="grid grid-cols-3 shrink-0">
              {child.board.map((cell, j) => (
                <BoardCell key={j} value={cell} size="xs" />
              ))}
            </div>
            <code className="text-xs font-mono opacity-50 shrink-0">
              {child.serialized}
            </code>
            <span className="text-xs opacity-30">→</span>
            <code className={`text-xs font-mono px-1 py-0.5 rounded shrink-0 ${keyColors.get(child.canonicalKey)}`}>
              {child.canonicalKey}
            </code>
            {child.isDuplicate ? (
              <span className="badge badge-ghost badge-xs ml-auto shrink-0">
                duplicado
              </span>
            ) : (
              <span className="badge badge-success badge-xs ml-auto shrink-0">
                novo
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="text-center p-2 bg-base-100 rounded-lg">
        <span className="text-sm">
          {children.length} movimentos → {uniqueSet.size} tabuleiros únicos
        </span>
      </div>
    </div>
  );
}
