import type { Cell } from '../lib/board';

const SIZES = {
  xs: 'w-5 h-5 text-xs',
  sm: 'w-8 h-8 text-sm',
};

export function BoardCell({ value, size = 'sm' }: { value: Cell; size?: 'xs' | 'sm' }) {
  return (
    <div className={`${SIZES[size]} flex items-center justify-center font-bold border border-base-300`}>
      {value === 'x' && <span className="text-primary">X</span>}
      {value === 'o' && <span className="text-secondary">O</span>}
    </div>
  );
}
