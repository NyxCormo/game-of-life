import { describe, expect, it } from 'vitest';
import { cellsBetween } from './line';

describe('cellsBetween', () => {
  it('returns a single cell when both ends are the same', () => {
    expect(cellsBetween({ x: 2, y: 3 }, { x: 2, y: 3 })).toEqual([
      { x: 2, y: 3 },
    ]);
  });

  it('follows a horizontal line', () => {
    expect(cellsBetween({ x: 1, y: 0 }, { x: 4, y: 0 })).toEqual([
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
    ]);
  });

  it('follows a diagonal backwards', () => {
    expect(cellsBetween({ x: 3, y: 3 }, { x: 1, y: 1 })).toEqual([
      { x: 3, y: 3 },
      { x: 2, y: 2 },
      { x: 1, y: 1 },
    ]);
  });

  it('leaves no gap on a steep line', () => {
    const cells = cellsBetween({ x: 0, y: 0 }, { x: 3, y: 10 });

    expect(cells[0]).toEqual({ x: 0, y: 0 });
    expect(cells[cells.length - 1]).toEqual({ x: 3, y: 10 });
    for (let i = 1; i < cells.length; i++) {
      expect(Math.abs(cells[i].x - cells[i - 1].x)).toBeLessThanOrEqual(1);
      expect(Math.abs(cells[i].y - cells[i - 1].y)).toBe(1);
    }
  });
});
