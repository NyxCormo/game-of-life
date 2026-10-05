export class Grid {
  readonly width: number;
  readonly height: number;
  private readonly cells: boolean[][];

  constructor(width: number, height: number) {
    if (!isPositiveInteger(width) || !isPositiveInteger(height)) {
      throw new RangeError(`Invalid grid dimensions: ${width}x${height}`);
    }
    this.width = width;
    this.height = height;
    this.cells = Array.from({ length: height }, () =>
      new Array<boolean>(width).fill(false),
    );
  }

  isAlive(x: number, y: number): boolean {
    this.checkInside(x, y);
    return this.cells[y][x];
  }

  setAlive(x: number, y: number, alive: boolean): void {
    this.checkInside(x, y);
    this.cells[y][x] = alive;
  }

  private checkInside(x: number, y: number): void {
    if (!this.contains(x, y)) {
      throw new RangeError(`Coordinates out of bounds: (${x}, ${y})`);
    }
  }

  private contains(x: number, y: number): boolean {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x >= 0 &&
      x < this.width &&
      y >= 0 &&
      y < this.height
    );
  }
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}
