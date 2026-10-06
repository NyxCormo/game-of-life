export interface CellPosition {
  readonly x: number;
  readonly y: number;
}

export function cellsBetween(
  from: CellPosition,
  to: CellPosition,
): CellPosition[] {
  const steps = Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y));
  if (steps === 0) {
    return [{ x: from.x, y: from.y }];
  }

  const cells: CellPosition[] = [];
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    cells.push({
      x: Math.round(from.x + (to.x - from.x) * progress),
      y: Math.round(from.y + (to.y - from.y) * progress),
    });
  }
  return cells;
}
