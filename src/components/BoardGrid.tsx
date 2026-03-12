import type { Board } from '../lib/board';
import { checkWinner } from '../lib/board';
import { BoardCell } from './BoardCell';

export function BoardGrid({ board }: { board: Board }) {
  const winner = checkWinner(board);
  return (
    <div className={`card bg-base-100 shadow-sm p-2 ${winner ? 'ring-2 ' + (winner === 'x' ? 'ring-primary' : 'ring-secondary') : ''}`}>
      <div className="grid grid-cols-3">
        {board.map((cell, i) => (
          <BoardCell key={i} value={cell} />
        ))}
      </div>
    </div>
  );
}
