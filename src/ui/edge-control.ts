import { isEdgeMode } from '../core/rules';
import type { Simulation } from '../core/simulation';
import { requireElement } from './dom';

export function setupEdgeControl(simulation: Simulation): void {
  const select = requireElement('#edge-select', HTMLSelectElement);

  select.addEventListener('change', () => {
    if (!isEdgeMode(select.value)) {
      throw new Error(`Invalid edge mode: ${select.value}`);
    }
    simulation.edgeMode = select.value;
  });

  select.value = simulation.edgeMode;
}
