import type { Grid } from '../core/grid';
import { requireElement } from './dom';

export interface GridActions {
  resize(width: number, height: number): void;
  clear(): void;
  randomize(): void;
}

export const MIN_GRID_SIZE = 3;
export const MAX_GRID_SIZE = 300;

export function parseGridSize(text: string): number | null {
  const value = Number(text);
  if (
    !Number.isInteger(value) ||
    value < MIN_GRID_SIZE ||
    value > MAX_GRID_SIZE
  ) {
    return null;
  }
  return value;
}

export function setupGridControls(
  initialGrid: Grid,
  actions: GridActions,
): void {
  const widthInput = requireElement('#width-input', HTMLInputElement);
  const heightInput = requireElement('#height-input', HTMLInputElement);
  const clearButton = requireElement('#clear-button', HTMLButtonElement);
  const randomButton = requireElement('#random-button', HTMLButtonElement);

  let width = initialGrid.width;
  let height = initialGrid.height;

  const showSize = (): void => {
    widthInput.value = String(width);
    heightInput.value = String(height);
  };

  const applySize = (): void => {
    const newWidth = parseGridSize(widthInput.value);
    const newHeight = parseGridSize(heightInput.value);
    if (newWidth !== null && newHeight !== null) {
      width = newWidth;
      height = newHeight;
      actions.resize(width, height);
    }
    showSize();
  };

  for (const input of [widthInput, heightInput]) {
    input.min = String(MIN_GRID_SIZE);
    input.max = String(MAX_GRID_SIZE);
    input.addEventListener('change', applySize);
  }
  clearButton.addEventListener('click', () => {
    actions.clear();
  });
  randomButton.addEventListener('click', () => {
    actions.randomize();
  });

  showSize();
}
