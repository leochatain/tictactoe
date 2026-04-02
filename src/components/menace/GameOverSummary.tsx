import type { Board, Cell } from '../../lib/board';
import { BEAD_COLORS } from './beadColors';

export interface MoveRecord {
  canonicalBoard: Board;
  chosenChildBoard: Board;
  beadColorIndex: number;
}

interface GameOverSummaryProps {
  winner: Cell;
  history: MoveRecord[];
  onNewGame: () => void;
}

export function GameOverSummary({
  winner,
  history,
  onNewGame,
}: GameOverSummaryProps) {
  const menaceWon = winner === 'x';
  const menaceLost = winner === 'o';
  const isDraw = !winner;

  let updateLabel: string;
  let updateClass: string;
  if (menaceWon) {
    updateLabel = '+3 miçangas da cor sorteada';
    updateClass = 'badge-success';
  } else if (isDraw) {
    updateLabel = '+1 miçanga da cor sorteada';
    updateClass = 'badge-warning';
  } else {
    updateLabel = 'Remover a miçanga sorteada';
    updateClass = 'badge-error';
  }

  return (
    <div className="card bg-base-100 shadow-md p-4 w-full max-w-lg">
      <h3 className="text-lg font-bold mb-3">
        {menaceWon && 'MENACE venceu!'}
        {menaceLost && 'MENACE perdeu!'}
        {isDraw && 'Empate!'}
      </h3>

      <p className="text-sm mb-3">
        Atualize as caixas de fósforos visitadas:
        <span className={`badge ${updateClass} ml-2`}>{updateLabel}</span>
      </p>

      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Jogada</th>
              <th>Caixa</th>
              <th>Miçanga</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record, moveIdx) => (
              <tr key={moveIdx}>
                <td className="font-mono">{moveIdx * 2 + 1}</td>
                <td>
                  <SummaryBoard board={record.canonicalBoard} />
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full ${BEAD_COLORS[record.beadColorIndex]} border border-white/30 shrink-0`}
                    />
                    <SummaryBoard
                      board={record.chosenChildBoard}
                      highlightCell={record.chosenChildBoard.findIndex(
                        (c, i) => c !== record.canonicalBoard[i],
                      )}
                      highlightColor={BEAD_COLORS[record.beadColorIndex]}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary btn-sm mt-4" onClick={onNewGame}>
        Novo jogo
      </button>
    </div>
  );
}

function SummaryBoard({
  board,
  highlightCell = -1,
  highlightColor,
}: {
  board: Board;
  highlightCell?: number;
  highlightColor?: string;
}) {
  return (
    <div className="grid grid-cols-3 w-24 h-24 border border-base-300 rounded shrink-0">
      {board.map((cell, i) => (
        <div
          key={i}
          className={`w-8 h-8 flex items-center justify-center text-xs font-bold border border-base-300/50 ${i === highlightCell && highlightColor ? highlightColor : ''}`}
        >
          {cell === 'x' && (
            <span
              className={i === highlightCell ? 'text-white' : 'text-primary'}
            >
              X
            </span>
          )}
          {cell === 'o' && <span className="text-secondary">O</span>}
        </div>
      ))}
    </div>
  );
}
