const MAX_FRAME_DURATION = 250;

export class AnimationLoop {
  private currentStepsPerSecond: number;
  private readonly update: () => void;
  private readonly render: () => void;
  private frameId: number | null = null;
  private lastTime = 0;
  private pendingTime = 0;

  constructor(stepsPerSecond: number, update: () => void, render: () => void) {
    this.currentStepsPerSecond = checkStepsPerSecond(stepsPerSecond);
    this.update = update;
    this.render = render;
  }

  get stepsPerSecond(): number {
    return this.currentStepsPerSecond;
  }

  set stepsPerSecond(value: number) {
    this.currentStepsPerSecond = checkStepsPerSecond(value);
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

    const stepDuration = 1000 / this.currentStepsPerSecond;
    while (this.pendingTime >= stepDuration) {
      this.update();
      this.pendingTime -= stepDuration;
    }

    this.render();
    this.frameId = requestAnimationFrame(this.tick);
  };
}

function checkStepsPerSecond(value: number): number {
  if (!(value > 0)) {
    throw new RangeError(
      `Steps per second must be a positive number, got ${value}`,
    );
  }
  return value;
}
