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
