import type { Board } from '../../lib/board';
import { checkWinner } from '../../lib/board';

interface PlayableBoardProps {
  board: Board;
  interactive: boolean;
  lastMove: number | null;
  onCellClick: (cellIndex: number) => void;
}

export function PlayableBoard({ board, interactive, lastMove, onCellClick }: PlayableBoardProps) {
  const winner = checkWinner(board);
  const isDraw = !winner && board.every(c => c !== null);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`grid grid-cols-3 border-2 rounded-lg overflow-hidden ${
        winner === 'x' ? 'border-primary' : winner === 'o' ? 'border-secondary' : 'border-base-300'
      }`}>
        {board.map((cell, i) => {
          const isEmpty = cell === null;
          const clickable = interactive && isEmpty;
          const isLastMove = lastMove === i;
          return (
            <button
              key={i}
              disabled={!clickable}
              onClick={() => clickable && onCellClick(i)}
              className={`w-16 h-16 flex items-center justify-center text-2xl font-bold border border-base-300 transition-all
                ${clickable ? 'cursor-pointer hover:bg-base-200' : ''}
                ${isLastMove ? 'bg-base-200' : 'bg-base-100'}
              `}
            >
              {cell === 'x' && <span className={`text-primary ${isLastMove ? 'font-black' : ''}`}>X</span>}
              {cell === 'o' && <span className={`text-secondary ${isLastMove ? 'font-black' : ''}`}>O</span>}
            </button>
          );
        })}
      </div>
      <div className="text-sm opacity-70">
        {winner ? `${winner.toUpperCase()} venceu!` : isDraw ? 'Empate!' : '\u00A0'}
      </div>
    </div>
  );
}
