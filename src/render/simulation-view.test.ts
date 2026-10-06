import { describe, expect, it } from 'vitest';
import { Simulation } from '../core/simulation';
import { SimulationView } from './simulation-view';

describe('SimulationView', () => {
  it('shows only the visible area when the margin is hidden', () => {
    const simulation = new Simulation(6, 4, 2, 'dead');
    const view = new SimulationView(simulation);

    expect(view.isMarginShown).toBe(false);
    expect(view.offset).toBe(0);
    expect(view.cells.width).toBe(6);
    expect(view.frame).toBeNull();
  });

  it('shows the whole world and frames the visible area on request', () => {
    const simulation = new Simulation(6, 4, 2, 'dead');
    const view = new SimulationView(simulation);

    view.showMargin = true;

    expect(view.offset).toBe(2);
    expect(view.cells.width).toBe(10);
    expect(view.cells.height).toBe(8);
    expect(view.frame).toEqual({ x: 2, y: 2, width: 6, height: 4 });
  });

  it('always shows the margin with wrapped edges', () => {
    const simulation = new Simulation(6, 4, 2, 'wrap');
    const view = new SimulationView(simulation);

    expect(view.showMargin).toBe(false);
    expect(view.isMarginShown).toBe(true);
    expect(view.offset).toBe(2);
  });

  it('draws no frame without a margin', () => {
    const simulation = new Simulation(6, 4, 0, 'wrap');
    const view = new SimulationView(simulation);

    expect(view.frame).toBeNull();
    expect(view.cells.width).toBe(6);
  });
});
