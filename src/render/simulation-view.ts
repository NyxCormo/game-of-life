import type { CellView } from '../core/grid';
import type { Simulation } from '../core/simulation';
import type { Frame } from './canvas-renderer';

export class SimulationView {
  showMargin = false;
  private readonly simulation: Simulation;

  constructor(simulation: Simulation) {
    this.simulation = simulation;
  }

  get isMarginShown(): boolean {
    return this.showMargin || this.simulation.edgeMode === 'wrap';
  }

  get offset(): number {
    return this.isMarginShown ? this.simulation.margin : 0;
  }

  get cells(): CellView {
    return this.isMarginShown ? this.simulation.worldCells : this.simulation;
  }

  get frame(): Frame | null {
    if (this.offset === 0) {
      return null;
    }
    return {
      x: this.offset,
      y: this.offset,
      width: this.simulation.width,
      height: this.simulation.height,
    };
  }
}
