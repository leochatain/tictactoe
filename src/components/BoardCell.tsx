import type { Cell } from '../lib/board';

export function BoardCell({ value }: { value: Cell }) {
  return (
    <div className="w-8 h-8 flex items-center justify-center text-sm font-bold border border-base-300">
      {value === 'x' && <span className="text-primary">X</span>}
      {value === 'o' && <span className="text-secondary">O</span>}
    </div>
  );
}
