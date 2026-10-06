import type { CellView } from '../core/grid';
import type { CellPosition } from '../core/line';

const DEAD_COLOR = '#111418';
const ALIVE_COLOR = '#4ade80';
const CELL_GAP = 1;
const FRAME_COLOR = '#f59e0b';
const FRAME_WIDTH = 2;

export interface Frame {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

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

  draw(cells: CellView, frame: Frame | null): void {
    this.fitTo(cells);

    this.context.fillStyle = DEAD_COLOR;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = ALIVE_COLOR;
    for (let y = 0; y < cells.height; y++) {
      for (let x = 0; x < cells.width; x++) {
        if (cells.isAlive(x, y)) {
          this.context.fillRect(
            x * this.cellSize,
            y * this.cellSize,
            this.cellSize - CELL_GAP,
            this.cellSize - CELL_GAP,
          );
        }
      }
    }

    if (frame !== null) {
      this.context.strokeStyle = FRAME_COLOR;
      this.context.lineWidth = FRAME_WIDTH;
      this.context.strokeRect(
        frame.x * this.cellSize,
        frame.y * this.cellSize,
        frame.width * this.cellSize,
        frame.height * this.cellSize,
      );
    }
  }

  cellAt(clientX: number, clientY: number): CellPosition {
    const bounds = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / bounds.width;
    const scaleY = this.canvas.height / bounds.height;
    return {
      x: Math.floor(((clientX - bounds.left) * scaleX) / this.cellSize),
      y: Math.floor(((clientY - bounds.top) * scaleY) / this.cellSize),
    };
  }

  private fitTo(cells: CellView): void {
    const width = cells.width * this.cellSize;
    const height = cells.height * this.cellSize;
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }
}
