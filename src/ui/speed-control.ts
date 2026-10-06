import type { AnimationLoop } from '../render/animation-loop';
import { requireElement } from './dom';

export function setupSpeedControl(loop: AnimationLoop): void {
  const input = requireElement('#speed-input', HTMLInputElement);
  const output = requireElement('#speed-value', HTMLOutputElement);

  const showSpeed = (): void => {
    output.textContent = `${loop.stepsPerSecond} gen/s`;
  };

  input.addEventListener('input', () => {
    loop.stepsPerSecond = Number(input.value);
    showSpeed();
  });

  input.value = String(loop.stepsPerSecond);
  showSpeed();
}
