const MAX_FRAME_DURATION = 250;

export class AnimationLoop {
  private readonly stepDuration: number;
  private readonly update: () => void;
  private readonly render: () => void;
  private frameId: number | null = null;
  private lastTime = 0;
  private pendingTime = 0;

  constructor(stepsPerSecond: number, update: () => void, render: () => void) {
    if (!(stepsPerSecond > 0)) {
      throw new RangeError(
        `Steps per second must be positive, got ${stepsPerSecond}`,
      );
    }
    this.stepDuration = 1000 / stepsPerSecond;
    this.update = update;
    this.render = render;
  }

  get isRunning(): boolean {
    return this.frameId !== null;
  }

  start(): void {
    if (this.frameId !== null) {
      return;
    }
    this.lastTime = performance.now();
    this.pendingTime = 0;
    this.frameId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    if (this.frameId === null) {
      return;
    }
    cancelAnimationFrame(this.frameId);
    this.frameId = null;
  }

  private readonly tick = (time: number): void => {
    this.pendingTime += Math.min(time - this.lastTime, MAX_FRAME_DURATION);
    this.lastTime = time;

    while (this.pendingTime >= this.stepDuration) {
      this.update();
      this.pendingTime -= this.stepDuration;
    }

    this.render();
    this.frameId = requestAnimationFrame(this.tick);
  };
}
