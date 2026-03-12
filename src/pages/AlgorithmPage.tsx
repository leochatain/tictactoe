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
        <p className="mb-4">
          Embora existam 8 transformações, nem sempre elas produzem 8 tabuleiros
          distintos. Dependendo da simetria do tabuleiro, algumas transformações
          podem resultar no mesmo estado — por exemplo, girar 4 vezes volta ao
          original, e em alguns casos uma reflexão produz o mesmo resultado que
          uma rotação.
        </p>
        <p className="opacity-70">
          Use os controles ao lado para ver como um tabuleiro se transforma.
          Abaixo, os estados únicos são mostrados — note que nem sempre são 8.
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
          O primeiro passo é transformar o tabuleiro em <strong>texto</strong>: lemos
          as células da esquerda para a direita, de cima para baixo, e escrevemos
          cada uma como uma letra — <code className="bg-base-300 px-1 rounded">x</code>,{' '}
          <code className="bg-base-300 px-1 rounded">o</code>, ou{' '}
          <code className="bg-base-300 px-1 rounded">.</code> para vazio. O resultado
          é uma sequência de 9 caracteres que representa o tabuleiro por
          completo — como um "nome" para aquele estado.
        </p>
        <p className="mb-4">
          Ao lado, as cores mostram como cada linha do tabuleiro corresponde a um
          trecho do texto.
        </p>
        <p className="mb-4">
          Para calcular a forma canônica:
        </p>
        <ol className="list-decimal list-inside mb-4 space-y-2">
          <li>Aplique todas as 8 transformações ao tabuleiro</li>
          <li>Converta cada resultado em texto</li>
          <li>
            Compare os textos em <strong>ordem alfabética</strong> e escolha o
            menor — essa é a forma canônica
          </li>
        </ol>
        <p className="mb-4">
          Tabuleiros equivalentes sempre produzem a mesma forma canônica.
          Isso nos dá uma forma confiável de verificar se dois tabuleiros representam
          o mesmo jogo.
        </p>
        <p className="opacity-70">
          Ao lado, as 8 variantes estão ordenadas por seu texto. A primeira (menor
          em ordem alfabética) é a forma canônica, destacada em verde.
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
          Note como 8 movimentos possíveis resultam em apenas 2 tabuleiros únicos
          — os 4 cantos são equivalentes entre si, e as 4 bordas também.
        </p>
      </div>
    ),
  },
];

import type { ReactNode } from 'react';

const VISUALIZATIONS: Record<string, () => ReactNode> = {
  symmetry: () => <SymmetryViz />,
  canonical: () => <CanonicalFormViz />,
  expansion: () => <ExpansionViz />,
};

export function AlgorithmPage() {
  return (
    <ScrollytellingLayout
      sections={sections}
      visualization={(sectionId) => {
        const Component = VISUALIZATIONS[sectionId];
        return Component ? <Component /> : null;
      }}
    />
  );
}
