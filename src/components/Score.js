export default class Score {
  constructor() {
    this.score = 0;
    this.combo = 0;
  }

  update(newScore, newCombo) {
    this.score += newScore;
    newCombo > 0 ? (this.combo += 1) : (this.combo = 0);
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${this.score}`, 93, 30);
    ctx.fillText(`Combo: ${this.combo}`, 100, 60);
  }
}
