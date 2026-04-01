import { useReducer, useMemo } from 'react';
import type { Board } from '../lib/board';
import { canonicalize, checkWinner, findActualCellForChild, generateUniqueBoards } from '../lib/board';
import { CanonicalBoard } from '../components/menace/CanonicalBoard';
import { PlayableBoard } from '../components/menace/PlayableBoard';
import { GameOverSummary, type MoveRecord } from '../components/menace/GameOverSummary';

interface GameState {
  board: Board;
  turn: number;
  phase: 'menace' | 'human' | 'game-over';
  history: MoveRecord[];
  lastMove: number | null;
}

type Action =
  | { type: 'MENACE_MOVE'; canonicalCellIndex: number }
  | { type: 'HUMAN_MOVE'; actualCell: number }
  | { type: 'UNDO' }
  | { type: 'RESET' };

function initialState(): GameState {
  return {
    board: Array(9).fill(null),
    turn: 0,
    phase: 'menace',
    history: [],
    lastMove: null,
  };
}

function checkGameOver(board: Board): boolean {
  return checkWinner(board) !== null || board.every(c => c !== null);
}

function makeReducer(boardLookup: Map<string, Board>) {
  return function reducer(state: GameState, action: Action): GameState {
    switch (action.type) {
      case 'MENACE_MOVE': {
        const currentKey = canonicalize(state.board);
        const currentCanonicalBoard = boardLookup.get(currentKey)!;
        // Derive child key from the cell clicked on the canonical board
        const child = [...currentCanonicalBoard];
        child[action.canonicalCellIndex] = 'x';
        const childKey = canonicalize(child);
        const actualCell = findActualCellForChild(state.board, state.turn, childKey);
        if (actualCell === null) return state;
        const newBoard = [...state.board];
        newBoard[actualCell] = 'x';
        const record: MoveRecord = {
          canonicalBoard: currentCanonicalBoard,
          chosenChildBoard: boardLookup.get(childKey)!,
          beadColorIndex: action.canonicalCellIndex,
        };
        return {
          board: newBoard,
          turn: state.turn + 1,
          phase: checkGameOver(newBoard) ? 'game-over' : 'human',
          history: [...state.history, record],
          lastMove: actualCell,
        };
      }
      case 'HUMAN_MOVE': {
        const newBoard = [...state.board];
        newBoard[action.actualCell] = 'o';
        return {
          board: newBoard,
          turn: state.turn + 1,
          phase: checkGameOver(newBoard) ? 'game-over' : 'menace',
          history: state.history,
          lastMove: action.actualCell,
        };
      }
      case 'UNDO': {
        if (state.turn === 0) return state;
        const newBoard = [...state.board];
        const lastIdx = state.lastMove;
        if (lastIdx === null) return state;
        const wasX = newBoard[lastIdx] === 'x';
        newBoard[lastIdx] = null;
        const newTurn = state.turn - 1;
        return {
          board: newBoard,
          turn: newTurn,
          phase: newTurn % 2 === 0 ? 'menace' : 'human',
          history: wasX ? state.history.slice(0, -1) : state.history,
          lastMove: null,
        };
      }
      case 'RESET':
        return initialState();
    }
  };
}

export function MenacePage() {
  const boardLookup = useMemo(() => {
    const boardsByTurn = generateUniqueBoards();
    const lookup = new Map<string, Board>();
    for (const entries of boardsByTurn.values()) {
      for (const entry of entries) {
        lookup.set(entry.canonicalKey, entry.board);
      }
    }
    return lookup;
  }, []);

  const reducer = useMemo(() => makeReducer(boardLookup), [boardLookup]);
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const { board, turn, phase, history, lastMove } = state;

  const winner = checkWinner(board);
  const currentKey = canonicalize(board);
  const currentCanonicalBoard = boardLookup.get(currentKey)!;

  // For each empty cell on the canonical board, which child canonical key does playing there produce?
  const cellChildKey = useMemo(() => {
    if (phase !== 'menace') return Array(9).fill(null) as (string | null)[];
    const mapping: (string | null)[] = [];
    for (let i = 0; i < 9; i++) {
      if (currentCanonicalBoard[i] !== null) {
        mapping.push(null);
      } else {
        const child = [...currentCanonicalBoard];
        child[i] = 'x';
        mapping.push(canonicalize(child));
      }
    }
    return mapping;
  }, [currentCanonicalBoard, phase]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">MENACE</h1>
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-ghost"
            disabled={turn === 0}
            onClick={() => dispatch({ type: 'UNDO' })}
          >
            Desfazer
          </button>
          <button
            className="btn btn-sm btn-ghost"
            disabled={turn === 0}
            onClick={() => dispatch({ type: 'RESET' })}
          >
            Reiniciar
          </button>
        </div>
      </div>

      <div className="text-center mb-6">
        {phase === 'menace' && (
          <div className="bg-primary text-primary-content rounded-lg px-4 py-2 text-sm inline-block">
            Vez do MENACE — escolha a miçanga sorteada na caixa
          </div>
        )}
        {phase === 'human' && (
          <div className="bg-secondary text-secondary-content rounded-lg px-4 py-2 text-sm inline-block">
            Vez do jogador — clique no tabuleiro
          </div>
        )}
        {phase === 'game-over' && (
          <div className="bg-neutral text-neutral-content rounded-lg px-4 py-2 text-sm inline-block">
            Fim de jogo
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-8 mb-8">
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-semibold text-sm">Caixa de fósforos</h2>
          <CanonicalBoard
            board={currentCanonicalBoard}
            cellChildKey={cellChildKey}
            interactive={phase === 'menace'}
            onCellClick={(cellIndex) =>
              dispatch({ type: 'MENACE_MOVE', canonicalCellIndex: cellIndex })
            }
          />
        </div>

        <div className="hidden sm:flex items-center text-2xl opacity-30 mt-16">→</div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="font-semibold text-sm">Tabuleiro</h2>
          <PlayableBoard
            board={board}
            interactive={phase === 'human'}
            lastMove={lastMove}
            onCellClick={(actualCell) =>
              dispatch({ type: 'HUMAN_MOVE', actualCell })
            }
          />
        </div>
      </div>

      {phase === 'game-over' && (
        <div className="flex justify-center">
          <GameOverSummary
            winner={winner}
            history={history}
            onNewGame={() => dispatch({ type: 'RESET' })}
          />
        </div>
      )}
    </div>
  );
}
