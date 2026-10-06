import { Grid, type CellView } from './grid';
import { nextGeneration, type EdgeMode } from './rules';

export class Simulation implements CellView {
  edgeMode: EdgeMode;
  private world: Grid;
  private currentMargin: number;

  constructor(
    width: number,
    height: number,
    margin: number,
    edgeMode: EdgeMode,
  ) {
    this.edgeMode = edgeMode;
    this.currentMargin = checkMargin(margin);
    this.world = surround(new Grid(width, height), this.currentMargin);
  }

  get width(): number {
    return this.world.width - 2 * this.currentMargin;
  }

  get height(): number {
    return this.world.height - 2 * this.currentMargin;
  }

  get margin(): number {
    return this.currentMargin;
  }

  set margin(value: number) {
    const visible = this.visibleCells();
    this.currentMargin = checkMargin(value);
    this.world = surround(visible, this.currentMargin);
  }

  contains(x: number, y: number): boolean {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x >= 0 &&
      x < this.width &&
      y >= 0 &&
      y < this.height
    );
  }

  isAlive(x: number, y: number): boolean {
    this.checkInside(x, y);
    return this.world.isAlive(x + this.currentMargin, y + this.currentMargin);
  }

  setAlive(x: number, y: number, alive: boolean): void {
    this.checkInside(x, y);
    this.world.setAlive(x + this.currentMargin, y + this.currentMargin, alive);
  }

  step(): void {
    this.world = nextGeneration(this.world, this.edgeMode);
  }

  resize(width: number, height: number): void {
    this.world = surround(
      this.visibleCells().resized(width, height),
      this.currentMargin,
    );
  }

  clear(): void {
    this.world = new Grid(this.world.width, this.world.height);
  }

  randomize(density: number, random: () => number = Math.random): void {
    this.world = surround(
      Grid.random(this.width, this.height, density, random),
      this.currentMargin,
    );
  }

  private visibleCells(): Grid {
    const visible = new Grid(this.width, this.height);
    for (let y = 0; y < visible.height; y++) {
      for (let x = 0; x < visible.width; x++) {
        visible.setAlive(x, y, this.isAlive(x, y));
      }
    }
    return visible;
  }

  private checkInside(x: number, y: number): void {
    if (!this.contains(x, y)) {
      throw new RangeError(`Coordinates out of bounds: (${x}, ${y})`);
    }
  }
}

function checkMargin(margin: number): number {
  if (!Number.isInteger(margin) || margin < 0) {
    throw new RangeError(
      `Margin must be a non-negative integer, got ${margin}`,
    );
  }
  return margin;
}

function surround(visible: Grid, margin: number): Grid {
  const world = new Grid(
    visible.width + 2 * margin,
    visible.height + 2 * margin,
  );
  for (let y = 0; y < visible.height; y++) {
    for (let x = 0; x < visible.width; x++) {
      world.setAlive(x + margin, y + margin, visible.isAlive(x, y));
    }
  }
  return world;
}
