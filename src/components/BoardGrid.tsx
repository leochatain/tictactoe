import type { Board } from '../lib/board';
import { checkWinner } from '../lib/board';
import { BoardCell } from './BoardCell';

interface BoardGridProps {
  board: Board;
  duplicates: number;
  childCount: number;
  parentCount: number;
  zoom: number;
  dimmed: boolean;
  selected: boolean;
  onClick: () => void;
}

export function BoardGrid({ board, duplicates, childCount, parentCount, zoom, dimmed, selected, onClick }: BoardGridProps) {
  const winner = checkWinner(board);
  const isTerminal = winner !== null || board.every(c => c !== null);

  return (
    <div className="relative group" style={{ zoom }}>
      <div
        onClick={onClick}
        className={`card bg-base-100 shadow-sm p-2 cursor-pointer transition-opacity ${
          winner ? 'ring-2 ' + (winner === 'x' ? 'ring-primary' : 'ring-secondary') : ''
        } ${selected ? 'ring-2 ring-accent' : ''} ${dimmed ? 'opacity-15 grayscale' : 'opacity-100'}`}
      >
        <div className="grid grid-cols-3">
          {board.map((cell, i) => (
            <BoardCell key={i} value={cell} />
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
        <div className="bg-neutral text-neutral-content text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg text-center">
          <div>{duplicates} {duplicates !== 1 ? 'posições equivalentes' : 'posição equivalente'}</div>
          {parentCount > 0 && (
            <div className="opacity-70 mt-0.5">{parentCount} {parentCount !== 1 ? 'pais únicos' : 'pai único'}</div>
          )}
          {isTerminal ? (
            <div className="opacity-70 mt-0.5">{winner ? `${winner.toUpperCase()} vence` : 'Empate'}</div>
          ) : (
            <>
              <div className="opacity-70 mt-0.5">{childCount} {childCount !== 1 ? 'filhos únicos' : 'filho único'}</div>
              <div className="opacity-70 mt-0.5">
                {selected ? 'Clique para desselecionar' : 'Clique para ver pais e filhos'}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
