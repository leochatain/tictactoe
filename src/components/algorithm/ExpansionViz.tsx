import { useMemo } from 'react';
import type { Board, Cell } from '../../lib/board';
import { canonicalize, serializeBoard } from '../../lib/board';
import { BoardCell } from '../BoardCell';

// n=1 board: X in center. We'll expand by placing O in each empty cell.
const PARENT_BOARD: Board = [null, null, null, null, 'x', null, null, null, null];
const NEXT_PLAYER: Cell = 'o';
const PARENT_TURN = 1;

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

  // Assign colors to canonical keys for grouping
  const keyColors = useMemo(() => {
    const colors = ['bg-primary/15', 'bg-secondary/15', 'bg-accent/15'];
    const map = new Map<string, string>();
    let colorIdx = 0;
    for (const key of uniqueSet) {
      map.set(key, colors[colorIdx % colors.length]);
      colorIdx++;
    }
    return map;
  }, [uniqueSet]);

  const posLabel = (pos: number) => {
    const row = Math.floor(pos / 3);
    const col = pos % 3;
    const rows = ['topo', 'meio', 'fundo'];
    const cols = ['esquerda', 'centro', 'direita'];
    return `${rows[row]}-${cols[col]}`;
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Parent board */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-semibold opacity-70">
          n={PARENT_TURN} — Tabuleiro pai
        </span>
        <div className="grid grid-cols-3 scale-125 my-2">
          {PARENT_BOARD.map((cell, i) => (
            <BoardCell key={i} value={cell} />
          ))}
        </div>
        <span className="text-xs opacity-50">
          {9 - PARENT_TURN} células vazias → {9 - PARENT_TURN} movimentos possíveis
        </span>
      </div>

      {/* Arrow */}
      <div className="text-2xl opacity-30">↓</div>

      {/* Children */}
      <div className="flex flex-col gap-2 w-full max-w-lg">
        <span className="text-sm font-semibold opacity-70 text-center">
          Filhos (O em cada célula vazia)
        </span>
        {children.map((child, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
              child.isDuplicate
                ? 'opacity-35 grayscale'
                : keyColors.get(child.canonicalKey) ?? 'bg-base-100'
            }`}
          >
            <div className="grid grid-cols-3 flex-shrink-0">
              {child.board.map((cell, j) => (
                <BoardCell key={j} value={cell} />
              ))}
            </div>
            <div className="flex flex-col min-w-0">
              <code className="text-xs font-mono opacity-70">
                {child.canonicalKey}
              </code>
              <span className="text-xs opacity-50">
                O em {posLabel(child.position)}
              </span>
            </div>
            {child.isDuplicate ? (
              <span className="badge badge-ghost badge-sm ml-auto flex-shrink-0">
                duplicado
              </span>
            ) : (
              <span className="badge badge-success badge-sm ml-auto flex-shrink-0">
                novo
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="text-center p-3 bg-base-100 rounded-lg">
        <span className="text-sm">
          {children.length} movimentos → {uniqueSet.size} tabuleiros únicos
        </span>
      </div>
    </div>
  );
}
