import { isEdgeMode } from '../core/rules';
import type { Simulation } from '../core/simulation';
import type { SimulationView } from '../render/simulation-view';
import { requireElement } from './dom';

const MAX_MARGIN = 50;

export function setupBorderControls(
  simulation: Simulation,
  view: SimulationView,
  onChange: () => void,
): void {
  const edgeSelect = requireElement('#edge-select', HTMLSelectElement);
  const marginInput = requireElement('#margin-input', HTMLInputElement);
  const marginOutput = requireElement('#margin-value', HTMLOutputElement);
  const showMarginInput = requireElement(
    '#show-margin-input',
    HTMLInputElement,
  );

  const refresh = (): void => {
    edgeSelect.value = simulation.edgeMode;
    marginInput.value = String(simulation.margin);
    marginOutput.textContent = `${simulation.margin} cells`;
    showMarginInput.checked = view.isMarginShown;
    showMarginInput.disabled = simulation.edgeMode === 'wrap';
  };

  edgeSelect.addEventListener('change', () => {
    if (!isEdgeMode(edgeSelect.value)) {
      throw new Error(`Invalid edge mode: ${edgeSelect.value}`);
    }
    simulation.edgeMode = edgeSelect.value;
    refresh();
    onChange();
  });

  marginInput.addEventListener('input', () => {
    simulation.margin = marginInput.valueAsNumber;
    refresh();
    onChange();
  });

  showMarginInput.addEventListener('change', () => {
    view.showMargin = showMarginInput.checked;
    refresh();
    onChange();
  });

  marginInput.max = String(MAX_MARGIN);
  refresh();
}
