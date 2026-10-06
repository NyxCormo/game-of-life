import type { Simulation } from '../core/simulation';
import { requireElement } from './dom';

const RANDOM_DENSITY = 0.25;

const MIN_GRID_SIZE = 3;
const MAX_GRID_SIZE = 300;

export function parseIntegerInRange(
  text: string,
  min: number,
  max: number,
): number | null {
  const value = Number(text);
  if (!Number.isInteger(value) || value < min || value > max) {
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
    const newWidth = parseIntegerInRange(
      widthInput.value,
      MIN_GRID_SIZE,
      MAX_GRID_SIZE,
    );
    const newHeight = parseIntegerInRange(
      heightInput.value,
      MIN_GRID_SIZE,
      MAX_GRID_SIZE,
    );
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
