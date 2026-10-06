import type { Simulation } from '../core/simulation';
import { requireElement } from './dom';

const RANDOM_DENSITY = 0.25;

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
  simulation: Simulation,
  onChange: () => void,
): void {
  const widthInput = requireElement('#width-input', HTMLInputElement);
  const heightInput = requireElement('#height-input', HTMLInputElement);
  const clearButton = requireElement('#clear-button', HTMLButtonElement);
  const randomButton = requireElement('#random-button', HTMLButtonElement);

  const showSize = (): void => {
    widthInput.value = String(simulation.width);
    heightInput.value = String(simulation.height);
  };

  const applySize = (): void => {
    const newWidth = parseGridSize(widthInput.value);
    const newHeight = parseGridSize(heightInput.value);
    if (newWidth !== null && newHeight !== null) {
      simulation.resize(newWidth, newHeight);
      onChange();
    }
    showSize();
  };

  for (const input of [widthInput, heightInput]) {
    input.min = String(MIN_GRID_SIZE);
    input.max = String(MAX_GRID_SIZE);
    input.addEventListener('change', applySize);
  }
  clearButton.addEventListener('click', () => {
    simulation.clear();
    onChange();
  });
  randomButton.addEventListener('click', () => {
    simulation.randomize(RANDOM_DENSITY);
    onChange();
  });

  showSize();
}
