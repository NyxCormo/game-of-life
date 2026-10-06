import { cellsBetween, type CellPosition } from '../core/line';
import type { Simulation } from '../core/simulation';
import type { CanvasRenderer } from '../render/canvas-renderer';
import type { SimulationView } from '../render/simulation-view';

export function setupPointerDrawing(
  canvas: HTMLCanvasElement,
  renderer: CanvasRenderer,
  simulation: Simulation,
  view: SimulationView,
  onChange: () => void,
): void {
  let paintAlive = true;
  let lastCell: CellPosition | null = null;

  const visibleCellAt = (event: PointerEvent): CellPosition => {
    const cell = renderer.cellAt(event.clientX, event.clientY);
    return { x: cell.x - view.offset, y: cell.y - view.offset };
  };

  const paintTo = (cell: CellPosition): void => {
    for (const { x, y } of cellsBetween(lastCell ?? cell, cell)) {
      if (simulation.contains(x, y)) {
        simulation.setAlive(x, y, paintAlive);
      }
    }
    lastCell = cell;
    onChange();
  };

  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) {
      return;
    }
    const cell = visibleCellAt(event);
    if (!simulation.contains(cell.x, cell.y)) {
      return;
    }
    paintAlive = !simulation.isAlive(cell.x, cell.y);
    canvas.setPointerCapture(event.pointerId);
    paintTo(cell);
  });

  canvas.addEventListener('pointermove', (event) => {
    if (lastCell === null) {
      return;
    }
    paintTo(visibleCellAt(event));
  });

  const stopPainting = (): void => {
    lastCell = null;
  };

  canvas.addEventListener('pointerup', stopPainting);
  canvas.addEventListener('pointercancel', stopPainting);
}
