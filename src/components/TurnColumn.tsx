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
    <section>
      <h2 className="font-bold text-lg mb-2">
        n={turn} <span className="text-sm font-normal opacity-70">— {label}</span>{' '}
        <span className="text-xs font-normal opacity-50">({boards.length} board{boards.length !== 1 ? 's' : ''})</span>
      </h2>
      <div className="flex flex-wrap gap-2">
        {boards.map((board, i) => (
          <BoardGrid key={i} board={board} />
        ))}
      </div>
    </section>
  );
}
