export default class Score {
  constructor() {
    this.score = 0;
    this.combo = "";
    this.comboPopupTime = 0;
    this.popupDuration = 300;
  }

  update(newScore, newCombo) {
    this.score += newScore;
    const newComboText = newCombo > 0 ? "anjay" : "waduh";
    this.comboPopupTime = performance.now();
    this.combo = newComboText;
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.font = "18px FNFFont";
    ctx.fillText(this.score, 380, 490);

    let scale = 1;
    const now = performance.now();
    const elapsed = now - this.comboPopupTime;

    if (elapsed < this.popupDuration) {
      const t = elapsed / this.popupDuration;
      scale = 1 + 0.5 * Math.sin(Math.PI * (1 - t));
    }

    ctx.save();
    ctx.translate(380, 520);
    ctx.scale(scale, scale);
    ctx.font = "36px FNFFont";
    ctx.fillText(this.combo, 0, 0);
    ctx.restore();
  }
}
