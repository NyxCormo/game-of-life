import type { Grid } from '../core/grid';
import { cellsBetween, type CellPosition } from '../core/line';
import type { CanvasRenderer } from '../render/canvas-renderer';

export function setupPointerDrawing(
  canvas: HTMLCanvasElement,
  renderer: CanvasRenderer,
  currentGrid: () => Grid,
  onChange: () => void,
): void {
  let paintAlive = true;
  let lastCell: CellPosition | null = null;

  const paintTo = (cell: CellPosition): void => {
    const grid = currentGrid();
    for (const { x, y } of cellsBetween(lastCell ?? cell, cell)) {
      if (grid.contains(x, y)) {
        grid.setAlive(x, y, paintAlive);
      }
    }
    lastCell = cell;
    onChange();
  };

  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) {
      return;
    }
    const cell = renderer.cellAt(event.clientX, event.clientY);
    const grid = currentGrid();
    if (!grid.contains(cell.x, cell.y)) {
      return;
    }
    paintAlive = !grid.isAlive(cell.x, cell.y);
    canvas.setPointerCapture(event.pointerId);
    paintTo(cell);
  });

  canvas.addEventListener('pointermove', (event) => {
    if (lastCell === null) {
      return;
    }
    paintTo(renderer.cellAt(event.clientX, event.clientY));
  });

  const stopPainting = (): void => {
    lastCell = null;
  };

  canvas.addEventListener('pointerup', stopPainting);
  canvas.addEventListener('pointercancel', stopPainting);
}
