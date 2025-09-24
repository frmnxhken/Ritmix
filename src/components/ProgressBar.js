export default class ProgressBar {
  constructor() {}

  update(currentTimeMs) {}

  draw(ctx) {
    ctx.fillStyle = "#3118beff";
    ctx.fillRect(50, 50, 400, 8);
  }
}
