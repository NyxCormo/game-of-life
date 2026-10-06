import { Grid } from './core/grid';
import { CanvasRenderer } from './render/canvas-renderer';

const canvas = document.querySelector<HTMLCanvasElement>('#board');
if (canvas === null) {
  throw new Error('Missing #board canvas');
}

const grid = new Grid(60, 40);
grid.setAlive(1, 3, true);
grid.setAlive(2, 1, true);
grid.setAlive(2, 3, true);
grid.setAlive(3, 2, true);
grid.setAlive(3, 3, true);

const renderer = new CanvasRenderer(canvas, 10);
renderer.draw(grid);
