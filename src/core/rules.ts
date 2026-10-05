import { Grid } from './grid';

export type EdgeMode = 'wrap' | 'dead';

export function nextGeneration(grid: Grid, edgeMode: EdgeMode): Grid {
  const next = new Grid(grid.width, grid.height);

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const neighbors = countAliveNeighbors(grid, x, y, edgeMode);
      next.setAlive(x, y, willBeAlive(grid.isAlive(x, y), neighbors));
    }
  }

  return next;
}

function willBeAlive(isAlive: boolean, neighbors: number): boolean {
  if (isAlive) {
    return neighbors === 2 || neighbors === 3;
  }
  return neighbors === 3;
}

function countAliveNeighbors(
  grid: Grid,
  x: number,
  y: number,
  edgeMode: EdgeMode,
): number {
  let count = 0;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) {
        continue;
      }
      if (isNeighborAlive(grid, x + dx, y + dy, edgeMode)) {
        count++;
      }
    }
  }

  return count;
}

function isNeighborAlive(
  grid: Grid,
  x: number,
  y: number,
  edgeMode: EdgeMode,
): boolean {
  if (edgeMode === 'wrap') {
    return grid.isAlive(wrap(x, grid.width), wrap(y, grid.height));
  }
  return grid.contains(x, y) && grid.isAlive(x, y);
}

function wrap(value: number, size: number): number {
  return (value + size) % size;
}
