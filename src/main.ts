import { Grid } from './core/grid';
import { nextGeneration } from './core/rules';
import { AnimationLoop } from './render/animation-loop';
import { CanvasRenderer } from './render/canvas-renderer';
import { requireElement } from './ui/dom';
import { setupPlaybackControls } from './ui/playback-controls';
import { setupPointerDrawing } from './ui/pointer-drawing';

const canvas = requireElement('#board', HTMLCanvasElement);

let grid = new Grid(60, 40);
grid.setAlive(1, 3, true);
grid.setAlive(2, 1, true);
grid.setAlive(2, 3, true);
grid.setAlive(3, 2, true);
grid.setAlive(3, 3, true);

const renderer = new CanvasRenderer(canvas, 10);

const advance = (): void => {
  grid = nextGeneration(grid, 'wrap');
};
const draw = (): void => {
  renderer.draw(grid);
};

const loop = new AnimationLoop(10, advance, draw);

draw();
loop.start();

setupPlaybackControls(loop, () => {
  advance();
  draw();
});

setupPointerDrawing(
  canvas,
  renderer,
  () => grid,
  () => draw,
);
