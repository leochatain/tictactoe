import { ScrollytellingLayout, type Section } from '../components/ScrollytellingLayout';
import { SymmetryViz } from '../components/algorithm/SymmetryViz';
import { CanonicalFormViz } from '../components/algorithm/CanonicalFormViz';
import { ExpansionViz } from '../components/algorithm/ExpansionViz';

const sections: Section[] = [
  {
    id: 'symmetry',
    content: (
      <div>
        <h2 className="text-2xl font-bold mb-4">1. Simetria</h2>
        <p className="mb-4">
          Dois tabuleiros de jogo da velha são considerados <strong>iguais</strong> se
          um pode ser transformado no outro por rotação ou reflexão.
        </p>
        <p className="mb-4">
          Existem 8 transformações possíveis — 4 rotações (0°, 90°, 180°, 270°) e
          4 reflexões (horizontal, vertical, e ambas diagonais). Juntas, elas formam
          o <em>grupo diedral D4</em>.
        </p>
        <p className="mb-4">
          Isso significa que se você pegar um tabuleiro e girá-lo 90° para a direita,
          o resultado representa o <strong>mesmo estado de jogo</strong>. Da mesma forma
          para qualquer combinação de rotação e reflexão.
        </p>
        <p className="opacity-70">
          Use os controles ao lado para ver como um tabuleiro se transforma.
          Todas as 8 variantes representam o mesmo jogo.
        </p>
      </div>
    ),
  },
  {
    id: 'canonical',
    content: (
      <div>
        <h2 className="text-2xl font-bold mb-4">2. Forma Canônica</h2>
        <p className="mb-4">
          Se dois tabuleiros são "o mesmo", precisamos de uma forma de identificá-los
          com uma <strong>impressão digital única</strong>. Essa é a <em>forma canônica</em>.
        </p>
        <p className="mb-4">
          Para calcular a forma canônica:
        </p>
        <ol className="list-decimal list-inside mb-4 space-y-2">
          <li>Aplique todas as 8 transformações D4 ao tabuleiro</li>
          <li>
            <strong>Serialize</strong> cada resultado em uma string, lendo da esquerda
            para a direita, de cima para baixo (ex: <code className="bg-base-300 px-1 rounded">o...x....</code>)
          </li>
          <li>
            Escolha a <strong>menor string</strong> na ordem lexicográfica — essa é a
            forma canônica
          </li>
        </ol>
        <p className="mb-4">
          Tabuleiros equivalentes sempre produzem a mesma forma canônica.
          Isso nos dá uma forma confiável de verificar se dois tabuleiros representam
          o mesmo jogo.
        </p>
        <p className="opacity-70">
          Ao lado, as 8 variantes estão ordenadas por sua string. A primeira (menor)
          é a forma canônica.
        </p>
      </div>
    ),
  },
  {
    id: 'expansion',
    content: (
      <div>
        <h2 className="text-2xl font-bold mb-4">3. Expansão de Tabuleiros</h2>
        <p className="mb-4">
          Agora que sabemos identificar tabuleiros únicos, podemos gerar todos os
          estados possíveis do jogo, jogada por jogada.
        </p>
        <p className="mb-4">
          O algoritmo para cada turno:
        </p>
        <ol className="list-decimal list-inside mb-4 space-y-2">
          <li>Pegue cada tabuleiro do turno n−1*</li>
          <li>Encontre todas as células vazias (movimentos possíveis)</li>
          <li>Coloque a próxima marca em cada célula</li>
          <li>Calcule a <strong>forma canônica</strong> de cada resultado</li>
          <li>Adicione ao conjunto do turno n — duplicatas são rejeitadas automaticamente</li>
        </ol>
        <p className="text-sm opacity-50 mb-4">
          *onde o jogo ainda não terminou
        </p>
        <p className="mb-4">
          Ao lado, veja um exemplo: começando com X no centro (n=1), geramos
          todos os filhos possíveis colocando O em cada célula vazia. Alguns
          filhos produzem a mesma forma canônica — são duplicatas que o
          conjunto rejeita automaticamente.
        </p>
        <p className="opacity-70">
          Note como 8 movimentos possíveis resultam em apenas 3 tabuleiros únicos
          — a maioria é equivalente por simetria.
        </p>
      </div>
    ),
  },
];

function VisualizationPanel({ activeSection }: { activeSection: string }) {
  switch (activeSection) {
    case 'symmetry':
      return <SymmetryViz />;
    case 'canonical':
      return <CanonicalFormViz />;
    case 'expansion':
      return <ExpansionViz />;
    default:
      return <SymmetryViz />;
  }
}

export function AlgorithmPage() {
  return (
    <ScrollytellingLayout
      sections={sections}
      visualization={(activeSection) => <VisualizationPanel activeSection={activeSection} />}
    />
  );
}
