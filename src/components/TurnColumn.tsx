import type { Board } from '../lib/board';
import { BoardGrid } from './BoardGrid';

interface TurnColumnProps {
  turn: number;
  boards: Board[];
}

export function TurnColumn({ turn, boards }: TurnColumnProps) {
  const player = turn === 0 ? null : turn % 2 === 1 ? 'X' : 'O';
  const label = turn === 0
    ? 'Empty board'
    : `${player} plays`;

  return (
    <div className="flex flex-col items-center gap-2 min-w-fit">
      <div className="text-center sticky top-0 bg-base-200 z-10 py-2 px-4 rounded-lg">
        <div className="font-bold text-lg">n={turn}</div>
        <div className="text-sm opacity-70">{label}</div>
        <div className="text-xs opacity-50">{boards.length} board{boards.length !== 1 ? 's' : ''}</div>
      </div>
      <div className="flex flex-col gap-2 pb-4">
        {boards.map((board, i) => (
          <BoardGrid key={i} board={board} />
        ))}
      </div>
    </div>
  );
}
