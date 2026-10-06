import { describe, expect, it } from 'vitest';
import { Simulation } from './simulation';

function aliveCells(simulation: Simulation): string[] {
  const cells: string[] = [];
  for (let y = 0; y < simulation.height; y++) {
    for (let x = 0; x < simulation.width; x++) {
      if (simulation.isAlive(x, y)) {
        cells.push(`${x},${y}`);
      }
    }
  }
  return cells;
}

describe('Simulation', () => {
  it('exposes only the visible size', () => {
    const simulation = new Simulation(5, 4, 3, 'dead');

    expect(simulation.width).toBe(5);
    expect(simulation.height).toBe(4);
    expect(simulation.margin).toBe(3);
  });

  it('uses visible coordinates', () => {
    const simulation = new Simulation(5, 4, 3, 'dead');

    simulation.setAlive(0, 0, true);

    expect(simulation.isAlive(0, 0)).toBe(true);
    expect(simulation.contains(4, 3)).toBe(true);
    expect(simulation.contains(5, 0)).toBe(false);
    expect(() => simulation.isAlive(-1, 0)).toThrow(RangeError);
  });

  it('advances one generation per step', () => {
    const simulation = new Simulation(5, 5, 0, 'dead');
    simulation.setAlive(1, 2, true);
    simulation.setAlive(2, 2, true);
    simulation.setAlive(3, 2, true);

    simulation.step();

    expect(aliveCells(simulation)).toEqual(['2,1', '2,2', '2,3']);
  });

  it('lets cells live in the margin out of sight', () => {
    const simulation = new Simulation(5, 5, 2, 'dead');
    simulation.setAlive(0, 1, true);
    simulation.setAlive(0, 2, true);
    simulation.setAlive(0, 3, true);

    simulation.step();
    expect(aliveCells(simulation)).toEqual(['0,2', '1,2']);

    simulation.step();
    expect(aliveCells(simulation)).toEqual(['0,1', '0,2', '0,3']);
  });

  it('applies the edge mode to the outer border of the margin', () => {
    const simulation = new Simulation(3, 3, 1, 'dead');
    simulation.setAlive(0, 0, true);
    simulation.setAlive(1, 0, true);
    simulation.setAlive(0, 1, true);
    simulation.setAlive(1, 1, true);

    simulation.step();

    expect(aliveCells(simulation)).toEqual(['0,0', '1,0', '0,1', '1,1']);
  });

  it('keeps the visible cells when the margin changes', () => {
    const simulation = new Simulation(4, 4, 0, 'dead');
    simulation.setAlive(3, 3, true);

    simulation.margin = 5;

    expect(simulation.width).toBe(4);
    expect(aliveCells(simulation)).toEqual(['3,3']);
  });

  it.each([-1, 1.5, Number.NaN])('rejects the margin %s', (margin) => {
    expect(() => new Simulation(4, 4, margin, 'dead')).toThrow(RangeError);
  });

  it('keeps the visible cells that still fit after a resize', () => {
    const simulation = new Simulation(4, 4, 2, 'dead');
    simulation.setAlive(1, 1, true);
    simulation.setAlive(3, 3, true);

    simulation.resize(3, 2);

    expect(simulation.width).toBe(3);
    expect(simulation.height).toBe(2);
    expect(aliveCells(simulation)).toEqual(['1,1']);
  });

  it('clears every cell', () => {
    const simulation = new Simulation(4, 4, 1, 'dead');
    simulation.setAlive(2, 2, true);

    simulation.clear();

    expect(aliveCells(simulation)).toEqual([]);
  });

  it('fills only the visible area at random', () => {
    const simulation = new Simulation(2, 1, 1, 'dead');
    const values = [0.1, 0.9];
    let index = 0;

    simulation.randomize(0.5, () => values[index++]);

    expect(aliveCells(simulation)).toEqual(['0,0']);
    expect(index).toBe(2);
  });
});
