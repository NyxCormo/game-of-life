import { describe, expect, it } from 'vitest';
import { Grid } from './grid';
import { isEdgeMode, nextGeneration } from './rules';

function gridFrom(rows: string[]): Grid {
  const grid = new Grid(rows[0].length, rows.length);
  rows.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      grid.setAlive(x, y, cell === '#');
    });
  });
  return grid;
}

function rowsOf(grid: Grid): string[] {
  const rows: string[] = [];
  for (let y = 0; y < grid.height; y++) {
    let row = '';
    for (let x = 0; x < grid.width; x++) {
      row += grid.isAlive(x, y) ? '#' : '.';
    }
    rows.push(row);
  }
  return rows;
}

describe('isEdgeMode', () => {
  it.each(['wrap', 'dead'])('accepts %s', (value) => {
    expect(isEdgeMode(value)).toBe(true);
  });

  it.each(['', 'Wrap', 'torus'])('rejects "%s"', (value) => {
    expect(isEdgeMode(value)).toBe(false);
  });
});

describe('nextGeneration', () => {
  it('keeps an empty grid empty', () => {
    const grid = gridFrom(['....', '....', '....']);

    expect(rowsOf(nextGeneration(grid, 'dead'))).toEqual([
      '....',
      '....',
      '....',
    ]);
  });

  it('kills a cell with fewer than two neighbors', () => {
    const grid = gridFrom(['.....', '.##..', '.....', '.....']);

    expect(rowsOf(nextGeneration(grid, 'dead'))).toEqual([
      '.....',
      '.....',
      '.....',
      '.....',
    ]);
  });

  it('keeps a block unchanged', () => {
    const block = ['....', '.##.', '.##.', '....'];

    expect(rowsOf(nextGeneration(gridFrom(block), 'dead'))).toEqual(block);
  });

  it('kills a cell with more than three neighbors', () => {
    const grid = gridFrom(['.....', '..#..', '.###.', '..#..', '.....']);

    expect(rowsOf(nextGeneration(grid, 'dead'))).toEqual([
      '.....',
      '.###.',
      '.#.#.',
      '.###.',
      '.....',
    ]);
  });

  it('turns a horizontal blinker into a vertical one and back', () => {
    const horizontal = ['.....', '.....', '.###.', '.....', '.....'];
    const vertical = ['.....', '..#..', '..#..', '..#..', '.....'];

    const once = nextGeneration(gridFrom(horizontal), 'dead');
    const twice = nextGeneration(once, 'dead');

    expect(rowsOf(once)).toEqual(vertical);
    expect(rowsOf(twice)).toEqual(horizontal);
  });

  it('moves a glider one cell diagonally every four generations', () => {
    let grid = gridFrom([
      '.#....',
      '..#...',
      '###...',
      '......',
      '......',
      '......',
    ]);

    for (let i = 0; i < 4; i++) {
      grid = nextGeneration(grid, 'dead');
    }

    expect(rowsOf(grid)).toEqual([
      '......',
      '..#...',
      '...#..',
      '.###..',
      '......',
      '......',
    ]);
  });

  it('leaves the original grid untouched', () => {
    const rows = ['.....', '.....', '.###.', '.....', '.....'];
    const grid = gridFrom(rows);

    nextGeneration(grid, 'dead');

    expect(rowsOf(grid)).toEqual(rows);
  });

  describe('with wrapped edges', () => {
    it('connects the left and right edges', () => {
      const grid = gridFrom(['.....', '#....', '#....', '#....', '.....']);

      expect(rowsOf(nextGeneration(grid, 'wrap'))).toEqual([
        '.....',
        '.....',
        '##..#',
        '.....',
        '.....',
      ]);
    });

    it('connects the top and bottom edges', () => {
      const grid = gridFrom(['.....', '.....', '.....', '.....', '.###.']);

      expect(rowsOf(nextGeneration(grid, 'wrap'))).toEqual([
        '..#..',
        '.....',
        '.....',
        '..#..',
        '..#..',
      ]);
    });
  });

  describe('with dead edges', () => {
    it('treats cells beyond the left edge as dead', () => {
      const grid = gridFrom(['.....', '#....', '#....', '#....', '.....']);

      expect(rowsOf(nextGeneration(grid, 'dead'))).toEqual([
        '.....',
        '.....',
        '##...',
        '.....',
        '.....',
      ]);
    });

    it('treats cells beyond the bottom edge as dead', () => {
      const grid = gridFrom(['.....', '.....', '.....', '.....', '.###.']);

      expect(rowsOf(nextGeneration(grid, 'dead'))).toEqual([
        '.....',
        '.....',
        '.....',
        '..#..',
        '..#..',
      ]);
    });
  });
});
