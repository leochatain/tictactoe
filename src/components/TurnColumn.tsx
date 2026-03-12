import { useMemo } from 'react';
import type { BoardEntry } from '../lib/board';
import { getChildKeys, checkWinner } from '../lib/board';
import { BoardGrid } from './BoardGrid';

interface Selection {
  turn: number;
  canonicalKey: string;
}

interface TurnColumnProps {
  turn: number;
  entries: BoardEntry[];
  selection: Selection | null;
  childKeys: Set<string> | null;
  onBoardClick: (turn: number, canonicalKey: string) => void;
}

export function TurnColumn({ turn, entries, selection, childKeys, onBoardClick }: TurnColumnProps) {
  const player = turn === 0 ? null : turn % 2 === 1 ? 'X' : 'O';
  const label = turn === 0
    ? 'Empty board'
    : `${player} plays`;

  const isSelectedTurn = selection !== null && selection.turn === turn;
  const isChildTurn = childKeys !== null;
  const hasDimming = isSelectedTurn || isChildTurn;

  const childCounts = useMemo(
    () => entries.map(entry => checkWinner(entry.board) ? 0 : getChildKeys(entry.board, turn).size),
    [entries, turn]
  );

  return (
    <section>
      <h2 className="font-bold text-lg mb-2">
        n={turn} <span className="text-sm font-normal opacity-70">— {label}</span>{' '}
        <span className="text-xs font-normal opacity-50">({entries.length} board{entries.length !== 1 ? 's' : ''})</span>
      </h2>
      <div className="flex flex-wrap gap-2">
        {entries.map((entry, i) => {
          let dimmed = false;
          let selected = false;

          if (hasDimming) {
            if (isSelectedTurn) {
              selected = entry.canonicalKey === selection!.canonicalKey;
              dimmed = !selected;
            } else if (isChildTurn) {
              dimmed = !childKeys!.has(entry.canonicalKey);
            }
          }

          return (
            <BoardGrid
              key={entry.canonicalKey}
              board={entry.board}
              duplicates={entry.duplicates}
              childCount={childCounts[i]}
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
