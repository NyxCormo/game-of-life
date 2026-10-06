import { isEdgeMode, type EdgeMode } from '../core/rules';
import { requireElement } from './dom';

export function setupEdgeControl(
  intialMode: EdgeMode,
  onChange: (mode: EdgeMode) => void,
): void {
  const select = requireElement('#edge-select', HTMLSelectElement);

  select.addEventListener('change', () => {
    if (!isEdgeMode(select.value)) {
      throw new Error(`Invalid edge mode: ${select.value}`);
    }
    onChange(select.value);
  });

  select.value = intialMode;
}
