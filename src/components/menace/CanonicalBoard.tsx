import type { Board } from '../../lib/board';

export const BEAD_COLORS = [
  'bg-red-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-yellow-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-orange-400',
  'bg-teal-400',
  'bg-cyan-400',
  'bg-lime-400',
  'bg-amber-400',
  'bg-rose-400',
];

// cellChildKey: for each cell index, the canonical key of the child if you play there (null if occupied)
// childKeyOrder: ordered list of unique child keys (determines color assignment)
interface CanonicalBoardProps {
  board: Board;
  cellChildKey: (string | null)[];
  childKeyOrder: string[];
  interactive: boolean;
  onChildClick: (childKey: string) => void;
}

export function CanonicalBoard({ board, cellChildKey, childKeyOrder, interactive, onChildClick }: CanonicalBoardProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid grid-cols-3 border-2 border-base-300 rounded-lg overflow-hidden">
        {board.map((cell, i) => {
          const childKey = cellChildKey[i];
          const colorIdx = childKey ? childKeyOrder.indexOf(childKey) : -1;
          const clickable = interactive && childKey !== null;
          return (
            <button
              key={i}
              disabled={!clickable}
              onClick={() => clickable && onChildClick(childKey!)}
              className={`w-16 h-16 flex items-center justify-center text-2xl font-bold border border-base-300 transition-all
                ${clickable ? `${BEAD_COLORS[colorIdx]} cursor-pointer hover:brightness-110 hover:scale-105` : ''}
                ${!clickable && cell === null ? 'bg-base-200' : ''}
                ${cell !== null ? 'bg-base-100' : ''}
              `}
            >
              {cell === 'x' && <span className="text-primary">X</span>}
              {cell === 'o' && <span className="text-secondary">O</span>}
              {clickable && (
                <span className="w-6 h-6 rounded-full border-2 border-white/50 shadow-inner" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
