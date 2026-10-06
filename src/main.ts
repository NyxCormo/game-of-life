import { Simulation } from './core/simulation';
import { AnimationLoop } from './render/animation-loop';
import { CanvasRenderer } from './render/canvas-renderer';
import { SimulationView } from './render/simulation-view';
import { setupBorderControls } from './ui/border-controls';
import { requireElement } from './ui/dom';
import { setupGridControls } from './ui/grid-controls';
import { setupPlaybackControls } from './ui/playback-controls';
import { setupPointerDrawing } from './ui/pointer-drawing';
import { setupSpeedControl } from './ui/speed-control';

const canvas = requireElement('#board', HTMLCanvasElement);

const simulation = new Simulation(60, 40, 0, 'wrap');
simulation.setAlive(1, 3, true);
simulation.setAlive(2, 1, true);
simulation.setAlive(2, 3, true);
simulation.setAlive(3, 2, true);
simulation.setAlive(3, 3, true);

const view = new SimulationView(simulation);
const renderer = new CanvasRenderer(canvas, 10);

const draw = (): void => {
  renderer.draw(view.cells, view.frame);
};

const loop = new AnimationLoop(
  10,
  () => {
    simulation.step();
  },
  draw,
);

draw();
loop.start();

setupPlaybackControls(loop, () => {
  simulation.step();
  draw();
});

setupPointerDrawing(canvas, renderer, simulation, view, draw);
setupSpeedControl(loop);
setupBorderControls(simulation, view, draw);
setupGridControls(simulation, draw);
