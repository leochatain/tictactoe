export type Cell = 'x' | 'o' | null;
export type Board = Cell[];

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diags
];

export function checkWinner(board: Board): Cell {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// D4 group: 4 rotations × 2 (with/without reflection) = 8 transformations
// Each is an index permutation of the 3×3 grid
const TRANSFORMATIONS: number[][] = (() => {
  // Identity mapping: row,col → index
  const idx = (r: number, c: number) => r * 3 + c;

  const transforms: ((r: number, c: number) => [number, number])[] = [
    (r, c) => [r, c],           // identity
    (r, c) => [c, 2 - r],      // 90° CW
    (r, c) => [2 - r, 2 - c],  // 180°
    (r, c) => [2 - c, r],      // 270° CW
    (r, c) => [r, 2 - c],      // reflect horizontal
    (r, c) => [2 - r, c],      // reflect vertical
    (r, c) => [c, r],          // reflect main diagonal
    (r, c) => [2 - c, 2 - r],  // reflect anti-diagonal
  ];

  return transforms.map(fn => {
    const perm: number[] = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const [nr, nc] = fn(r, c);
        perm.push(idx(nr, nc));
      }
    }
    return perm;
  });
})();

function applyTransformation(board: Board, perm: number[]): Board {
  return perm.map(i => board[i]);
}

function serializeBoard(board: Board): string {
  return board.map(c => c ?? '.').join('');
}

export function canonicalize(board: Board): string {
  let min = serializeBoard(board);
  for (const perm of TRANSFORMATIONS) {
    const transformed = serializeBoard(applyTransformation(board, perm));
    if (transformed < min) min = transformed;
  }
  return min;
}

export function orbitSize(board: Board): number {
  const distinct = new Set(
    TRANSFORMATIONS.map(perm => serializeBoard(applyTransformation(board, perm)))
  );
  return distinct.size;
}

export interface BoardEntry {
  board: Board;
  duplicates: number;
  canonicalKey: string;
}

export function getChildKeys(board: Board, turn: number): Set<string> {
  if (checkWinner(board)) return new Set();
  const player: Cell = (turn + 1) % 2 === 1 ? 'x' : 'o';
  const keys = new Set<string>();
  for (let i = 0; i < 9; i++) {
    if (board[i] !== null) continue;
    const child = [...board];
    child[i] = player;
    keys.add(canonicalize(child));
  }
  return keys;
}

export function generateUniqueBoards(): Map<number, BoardEntry[]> {
  const result = new Map<number, BoardEntry[]>();
  const emptyBoard: Board = Array(9).fill(null);

  result.set(0, [{ board: emptyBoard, duplicates: orbitSize(emptyBoard), canonicalKey: canonicalize(emptyBoard) }]);
  const seen = new Set<string>();
  seen.add(canonicalize(emptyBoard));

  let currentBoards = [emptyBoard];

  for (let n = 1; n <= 9; n++) {
    const player: Cell = n % 2 === 1 ? 'x' : 'o';
    const nextEntries: BoardEntry[] = [];
    const nextBoards: Board[] = [];

    for (const board of currentBoards) {
      if (checkWinner(board)) continue;

      for (let i = 0; i < 9; i++) {
        if (board[i] !== null) continue;

        const newBoard = [...board];
        newBoard[i] = player;
        const canon = canonicalize(newBoard);

        if (!seen.has(canon)) {
          seen.add(canon);
          nextBoards.push(newBoard);
          nextEntries.push({ board: newBoard, duplicates: orbitSize(newBoard), canonicalKey: canon });
        }
      }
    }

    if (nextEntries.length > 0) {
      result.set(n, nextEntries);
    }
    currentBoards = nextBoards;
  }

  return result;
}
