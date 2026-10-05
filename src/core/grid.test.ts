import { describe, expect, it } from 'vitest';
import { Grid } from './grid';

describe('Grid', () => {
  it('stores its dimensions', () => {
    const grid = new Grid(5, 3);

    expect(grid.width).toBe(5);
    expect(grid.height).toBe(3);
  });

  it('starts with every cell dead', () => {
    const grid = new Grid(4, 4);

    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        expect(grid.isAlive(x, y)).toBe(false);
      }
    }
  });

  it('brings a cell to life and kills it again', () => {
    const grid = new Grid(3, 3);

    grid.setAlive(1, 2, true);
    expect(grid.isAlive(1, 2)).toBe(true);

    grid.setAlive(1, 2, false);
    expect(grid.isAlive(1, 2)).toBe(false);
  });

  it('changes only the targeted cell', () => {
    const grid = new Grid(3, 2);

    grid.setAlive(2, 0, true);

    expect(grid.isAlive(2, 0)).toBe(true);
    expect(grid.isAlive(0, 1)).toBe(false);
    expect(grid.isAlive(1, 0)).toBe(false);
  });

  it('accepts the cells on the borders', () => {
    const grid = new Grid(4, 3);

    grid.setAlive(0, 0, true);
    grid.setAlive(3, 2, true);

    expect(grid.isAlive(0, 0)).toBe(true);
    expect(grid.isAlive(3, 2)).toBe(true);
  });

  it.each([
    [-1, 0],
    [0, -1],
    [4, 0],
    [0, 3],
    [1.5, 0],
  ])('rejects the cell (%s, %s) outside the grid', (x, y) => {
    const grid = new Grid(4, 3);

    expect(() => grid.isAlive(x, y)).toThrow(RangeError);
    expect(() => grid.setAlive(x, y, true)).toThrow(RangeError);
  });

  it.each([
    [0, 3],
    [3, 0],
    [-2, 3],
    [2.5, 3],
    [Number.NaN, 3],
  ])('rejects the size %s x %s', (width, height) => {
    expect(() => new Grid(width, height)).toThrow(RangeError);
  });
});
