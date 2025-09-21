import * as C from "./Constants.js";

export default class ScreenShake {
  constructor() {
    this.shakeDuration = 0;
    this.shakeElapsed = 0;
    this.shakeIntensity = 0;
  }

  trigger(intensity = 2, duration = 150) {
    this.shakeDuration = duration;
    this.shakeElapsed = 0;
    this.shakeIntensity = intensity;
  }

  update(deltaTime) {
    if (this.shakeDuration > 0) {
      this.shakeElapsed += deltaTime;
      if (this.shakeElapsed >= this.shakeDuration) {
        this.shakeDuration = 0;
        this.shakeElapsed = 0;
      }
    }
  }

  shake(ctx) {
    if (this.shakeDuration > 0) {
      const progress = this.shakeElapsed / this.shakeDuration;
      const angle = Math.sin(progress * Math.PI * 2);
      const dx = angle * this.shakeIntensity;
      const dy = (Math.random() - 0.3) * 2;
      ctx.translate(dx, dy);
      const zoom = 1 + 0.01 * (0.3 - progress);
      ctx.translate(C.CANVAS_WIDTH / 2, C.CANVAS_HEIGHT / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-C.CANVAS_WIDTH / 2 + dx, -C.CANVAS_HEIGHT / 2 + dy);
    }
  }
}
