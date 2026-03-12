# Jogo da velha (tic-tac-toe)

The goal of this project is to create an educational visualization of the algorithm to generate unique tic-tac-toe (ttt) boards.

## Constraints

For simplicity, we assume the game always starts with x.
`n` is the index of the play, so n=1 is the first play: only one x. n=2 is an x and an o.

## Uniqueness

Two ttt boards are considered to be the same if one can be transformed into the other via the dihedral group D4 (4 rotations: 0°, 90°, 180°, 270° and 4 reflections: horizontal, vertical, and both diagonals — 8 transformations total).

## Visualization

We want to visualize the boards and the unique variations.

The idea is to have them organized by n.

n=0: one board (empty)
n=1: three boards (corner, edge, center)
...

Boards are grouped by n in columns (or rows). Boards where a player has already won are pruned — no further moves are generated from them.

In the future we could add the number of symmetries on hover (or even show the symmetries).

## Algorithm

Two main approaches to generate unique boards:

1. **Canonical form deduplication**: Generate all possible boards for each n, then for each board compute all 8 D4 transformations and pick the lexicographically smallest as the canonical form. Deduplicate by canonical form. Simple to implement, but generates many duplicates before pruning.

2. **Burnside's lemma**: Count the number of distinct boards using the formula |unique| = (1/|G|) Σ |Fix(g)|, where G is D4. This gives counts efficiently but doesn't directly enumerate the boards — useful for validation but not for visualization.

The practical approach is (1): generate boards level by level (n=0, n=1, ...), canonicalize, and deduplicate. At each level, expand each unique board from the previous level by placing the next mark in every empty cell, canonicalize the result, and keep only distinct boards. Skip expanding boards where a player has already won.

## Stack

Let's use vite, typescript, react, and daisyui+tailwind for components/css.

## Visualizing the algorithm

A new page that teaches the algorithm visually, organized into chapters. Each chapter introduces one concept with interactive visuals. No forward references — each builds on the previous.

### Layout

Scrollytelling pattern: the page is split into two panels.

- **Left panel**: Sticky visualization area that stays in view as the user scrolls.
- **Right panel**: Long scrollable text content, broken into sections per chapter.

As the right-side text scrolls past thresholds, the left-side visualization transitions to match. Scroll drives everything — no clicking or stepping required.

Implementation: sticky `div` + `IntersectionObserver` to detect which text section is active + React state to update the left panel. CSS transitions or framer-motion for smooth state changes.

### Chapter 1: Symmetry

What it means for two boards to be "the same." A board can be rotated (0°, 90°, 180°, 270°) and reflected (horizontal, vertical, both diagonals) — 8 transformations total (the dihedral group D4). All 8 results represent the same game state.

**Left panel**: One board displayed prominently. Below it: rotate and flip controls. Beside/around it: all 8 D4 transformations shown as smaller boards, with the current one highlighted. User clicks rotate/flip → the main board transforms, the corresponding variant highlights.

**Right panel**: Text explaining the concept of symmetry in tic-tac-toe.

TODO: Let the user place their own X's and O's on the board, with everything updating live.

### Chapter 2: Canonical Form

A way to compute a unique fingerprint for any board:

1. Apply all 8 D4 transformations
2. Serialize each resulting board to a string (left→right, top→bottom)
3. Pick the lexicographically smallest string — that's the canonical form

Equivalent boards always produce the same canonical form.

**Left panel**: The visualization evolves from Chapter 1 — same board and 8 transformations, but now a serialized string fades in underneath each one. The boards re-sort themselves by string order. The lexicographically smallest one highlights as the canonical form.

**Right panel**: Text explaining serialization, lexicographic ordering, and why this produces a unique fingerprint.

### Chapter 3: Board Expansion

The core algorithm, one turn at a time:

1. Take each board from turn n−1*
2. Find all empty cells (possible moves)
3. Place the next mark in each cell
4. Canonicalize each resulting board
5. Add to the set for turn n — the set naturally rejects duplicates

*\*where the game is still ongoing*

**Left panel**: Scene change. A parent board with empty cells highlighted. Children fan out as the next mark is placed in each cell. Each child gets canonicalized (quick visual callback to Ch. 2). Children that produce an already-seen canonical form fade out / don't enter the set. The set is shown growing on the side.

**Right panel**: Text walking through the algorithm steps.

