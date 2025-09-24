import * as C from "../utils/Constants";
import Store from "@/utils/Store";

export default class Score {
  constructor(id) {
    this.id = id;
    this.score = 0;
    this.combo = "";
    this.comboPopupTime = 0;
    this.popupDuration = 300;
  }

  maxScore() {
    const store = new Store("ritmix");
    const prevScore = store.getBy("id", this.id)[0].highscore;
    const highscore = this.score > prevScore ? this.score : prevScore;
    store.update("id", this.id, { highscore: highscore });
    return highscore;
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
    const scoreText = this.score.toString();
    const scoreMetrics = ctx.measureText(scoreText);
    const scoreX = (C.CANVAS_WIDTH - scoreMetrics.width) / 2;
    ctx.fillText(scoreText, scoreX, 490);

    let scale = 1;
    const now = performance.now();
    const elapsed = now - this.comboPopupTime;

    if (elapsed < this.popupDuration) {
      const t = elapsed / this.popupDuration;
      scale = 1 + 0.5 * Math.sin(Math.PI * (1 - t));
    }

    ctx.save();
    ctx.font = "36px FNFFont";
    const comboText = this.combo.toString();
    const comboMetrics = ctx.measureText(comboText);
    const centerX = C.CANVAS_WIDTH / 2;
    const comboX = -comboMetrics.width / 2;

    ctx.translate(centerX, 520);
    ctx.scale(scale, scale);
    ctx.fillText(comboText, comboX, 0);
    ctx.restore();
  }
}
