import type { AnimationLoop } from '../render/animation-loop';
import { requireElement } from './dom';

export function setupPlaybackControls(
  loop: AnimationLoop,
  stepOnce: () => void,
): void {
  const playButton = requireElement('#play-button', HTMLButtonElement);
  const stepButton = requireElement('#step-button', HTMLButtonElement);

  const refresh = (): void => {
    playButton.textContent = loop.isRunning ? 'Pause' : 'Play';
    stepButton.disabled = loop.isRunning;
  };

  playButton.addEventListener('click', () => {
    if (loop.isRunning) {
      loop.stop();
    } else {
      loop.start();
    }
    refresh();
  });

  stepButton.addEventListener('click', stepOnce);

  refresh();
}
