import { useMemo } from 'react';
import type { BoardEntry } from '../lib/board';
import { getChildKeys, getParentKeys, checkWinner } from '../lib/board';

import { BoardGrid } from './BoardGrid';

interface Selection {
  turn: number;
  canonicalKey: string;
}

interface TurnColumnProps {
  turn: number;
  entries: BoardEntry[];
  selection: Selection | null;
  highlightedKeys: Set<string> | null;
  zoom: number;
  onBoardClick: (turn: number, canonicalKey: string) => void;
}

export function TurnColumn({
  turn,
  entries,
  selection,
  highlightedKeys,
  zoom,
  onBoardClick,
}: TurnColumnProps) {
  const player = turn % 2 === 0 ? 'X' : 'O';
  const label = `Turno: ${player}`;

  const isSelectedTurn = selection !== null && selection.turn === turn;
  const hasDimming = isSelectedTurn || highlightedKeys !== null;

  const nonTerminalCount = useMemo(
    () => entries.filter((entry) => !checkWinner(entry.board)).length,
    [entries],
  );

  const childCounts = useMemo(
    () =>
      entries.map((entry) =>
        checkWinner(entry.board) ? 0 : getChildKeys(entry.board, turn).size,
      ),
    [entries, turn],
  );

  const parentCounts = useMemo(
    () =>
      turn === 0
        ? entries.map(() => 0)
        : entries.map((entry) => getParentKeys(entry.board, turn).size),
    [entries, turn],
  );

  return (
    <section>
      <h2 className="font-bold text-lg mb-2">
        n={turn}{' '}
        <span className="text-sm font-normal opacity-70">— {label}</span>{' '}
        <span className="text-xs font-normal opacity-50">
          ({entries.length} tabuleiro{entries.length !== 1 ? 's' : ''}
          {nonTerminalCount < entries.length
            ? `, ${nonTerminalCount} não-finai${nonTerminalCount !== 1 ? 's' : ''}`
            : ''}
          )
        </span>
      </h2>
      <div className="flex flex-wrap gap-2">
        {entries.map((entry, i) => {
          let dimmed = false;
          let selected = false;

          if (hasDimming) {
            if (isSelectedTurn) {
              selected = entry.canonicalKey === selection!.canonicalKey;
              dimmed = !selected;
            } else {
              dimmed = !highlightedKeys!.has(entry.canonicalKey);
            }
          }

          return (
            <BoardGrid
              key={entry.canonicalKey}
              board={entry.board}
              duplicates={entry.duplicates}
              childCount={childCounts[i]}
              parentCount={parentCounts[i]}
              zoom={zoom}
              dimmed={dimmed}
              selected={selected}
              onClick={() => onBoardClick(turn, entry.canonicalKey)}
            />
          );
        })}
      </div>
    </section>
  );
}
