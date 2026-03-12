import { useState, useMemo } from 'react';
import type { Board } from '../../lib/board';
import { TRANSFORMATIONS, TRANSFORMATION_LABELS, applyTransformation } from '../../lib/board';
import { BoardCell } from '../BoardCell';

const DEFAULT_BOARD: Board = ['o', null, null, null, 'x', null, null, null, null];

function MiniBoard({ board, highlighted, label }: { board: Board; highlighted?: boolean; label: string }) {
  return (
    <div className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
      highlighted ? 'bg-accent/20 ring-2 ring-accent' : 'bg-base-100'
    }`}>
      <div className="grid grid-cols-3">
        {board.map((cell, i) => (
          <BoardCell key={i} value={cell} />
        ))}
      </div>
      <span className="text-xs opacity-70 text-center">{label}</span>
    </div>
  );
}

export function SymmetryViz() {
  const [activeTransform, setActiveTransform] = useState(0);

  const allTransformed = useMemo(() =>
    TRANSFORMATIONS.map((perm) => applyTransformation(DEFAULT_BOARD, perm)),
    []
  );

  const mainBoard = allTransformed[activeTransform];

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Main board */}
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-semibold opacity-70">
          {TRANSFORMATION_LABELS[activeTransform]}
        </h3>
        <div className="grid grid-cols-3 scale-150 my-4">
          {mainBoard.map((cell, i) => (
            <BoardCell key={i} value={cell} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap justify-center">
        <div className="flex gap-1">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setActiveTransform(1)}
            title="Rotação 90°"
          >
            ↻ 90°
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setActiveTransform(2)}
            title="Rotação 180°"
          >
            ↻ 180°
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setActiveTransform(3)}
            title="Rotação 270°"
          >
            ↻ 270°
          </button>
        </div>
        <div className="flex gap-1">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setActiveTransform(4)}
            title="Reflexão horizontal"
          >
            ↔
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setActiveTransform(5)}
            title="Reflexão vertical"
          >
            ↕
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setActiveTransform(6)}
            title="Reflexão diagonal principal"
          >
            ⟍
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setActiveTransform(7)}
            title="Reflexão anti-diagonal"
          >
            ⟋
          </button>
        </div>
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => setActiveTransform(0)}
        >
          Reset
        </button>
      </div>

      {/* All 8 transformations grid */}
      <div className="grid grid-cols-4 gap-3">
        {allTransformed.map((board, i) => (
          <MiniBoard
            key={i}
            board={board}
            highlighted={i === activeTransform}
            label={TRANSFORMATION_LABELS[i]}
          />
        ))}
      </div>
    </div>
  );
}
