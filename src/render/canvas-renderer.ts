import type { Grid } from '../core/grid';

const DEAD_COLOR = '#111418';
const ALIVE_COLOR = '#4ade80';
const CELL_GAP = 1;

export class CanvasRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly cellSize: number;

  constructor(canvas: HTMLCanvasElement, cellSize: number) {
    const context = canvas.getContext('2d');
    if (context === null) {
      throw new Error('Canvas 2D is not supported');
    }
    if (!Number.isInteger(cellSize) || cellSize <= CELL_GAP) {
      throw new RangeError(
        `Cell size must be an integer greater than ${CELL_GAP}`,
      );
    }
    this.canvas = canvas;
    this.context = context;
    this.cellSize = cellSize;
  }

  draw(grid: Grid): void {
    this.fitTo(grid);

    this.context.fillStyle = DEAD_COLOR;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = ALIVE_COLOR;
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (grid.isAlive(x, y)) {
          this.context.fillRect(
            x * this.cellSize,
            y * this.cellSize,
            this.cellSize - CELL_GAP,
            this.cellSize - CELL_GAP,
          );
        }
      }
    }
  }

  private fitTo(grid: Grid): void {
    const width = grid.width * this.cellSize;
    const height = grid.height * this.cellSize;
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }
}
