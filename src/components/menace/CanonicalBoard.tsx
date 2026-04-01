import type { Board } from "../../lib/board";
import { BEAD_COLORS } from "./beadColors";

interface CanonicalBoardProps {
  board: Board;
  cellChildKey: (string | null)[];
  interactive: boolean;
  onCellClick: (cellIndex: number) => void;
}

export function CanonicalBoard({
  board,
  cellChildKey,
  interactive,
  onCellClick,
}: CanonicalBoardProps) {
  // Only show a bead for the first cell of each unique child (one bead per unique move)
  const seenChildKeys = new Set<string>();
  const isRepresentative: boolean[] = cellChildKey.map((key) => {
    if (key === null || seenChildKeys.has(key)) return false;
    seenChildKeys.add(key);
    return true;
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid grid-cols-3 border-2 border-base-300 rounded-lg overflow-hidden">
        {board.map((cell, i) => {
          const clickable = interactive && isRepresentative[i];
          return (
            <button
              key={i}
              disabled={!clickable}
              onClick={() => clickable && onCellClick(i)}
              className={`w-16 h-16 flex items-center justify-center text-2xl font-bold border border-base-300 transition-all
                ${clickable ? `${BEAD_COLORS[i]} cursor-pointer hover:brightness-110 hover:scale-105` : ""}
                ${!clickable && cell === null ? "bg-base-200" : ""}
                ${cell !== null ? "bg-base-100" : ""}
              `}
            >
              {cell === "x" && <span className="text-primary">X</span>}
              {cell === "o" && <span className="text-secondary">O</span>}
              {clickable && (
                <span
                  className={`w-6 h-6 rounded-full border-2 shadow-inner ${i === 1 ? "border-base-300" : "border-white/50"}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
