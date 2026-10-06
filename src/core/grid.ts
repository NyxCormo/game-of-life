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

  static random(
    width: number,
    height: number,
    density: number,
    random: () => number = Math.random,
  ): Grid {
    if (!(density >= 0 && density <= 1)) {
      throw new RangeError(`Density must be between 0 and 1, got ${density}`);
    }
    const grid = new Grid(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        grid.setAlive(x, y, random() < density);
      }
    }
    return grid;
  }

  resized(width: number, height: number): Grid {
    const resized = new Grid(width, height);
    for (let y = 0; y < Math.min(height, this.height); y++) {
      for (let x = 0; x < Math.min(width, this.width); x++) {
        resized.setAlive(x, y, this.isAlive(x, y));
      }
    }
    return resized;
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
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}
