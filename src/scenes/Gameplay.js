import Note from "../components/Note.js";
import Score from "../components/Score.js";
import * as C from "../utils/Constants.js";
import { ArrowBox } from "../components/ArrowBox.js";
import ScreenShake from "../utils/ScreenShake.js";
import { initInput } from "../utils/Input.js";
import { HitDetect } from "../utils/HitDetect.js";

export default class Gameplay {
  constructor(game, data) {
    this.game = game;
    this.audioSrc = data.music;
    this.beatmapUrl = data.beat;

    this.notes = [];
    this.particles = [];
    this.lastTime = 0;
    this.nextNoteIndex = 0;

    this.score = new Score();
    this.arrowBox = new ArrowBox();
    this.screenShake = new ScreenShake();

    this.bgImage = new Image();
    this.bgImage.src = "bg.jpg";

    this.audio = new Audio(this.audioSrc);
    this.beatmap = [];
  }

  async init() {
    const root = document.getElementById("root");
    root.innerHTML = `<canvas width="${C.CANVAS_WIDTH}" height="${C.CANVAS_HEIGHT}"></canvas>`;
    this.game.canvas = document.querySelector("canvas");
    this.game.ctx = this.game.canvas.getContext("2d");

    await this.loadBeatmap();
    initInput(this);
    this.audio.currentTime = 0;
    this.audio.play();
  }

  async loadBeatmap() {
    const res = await fetch(this.beatmapUrl);
    const data = await res.json();
    this.beatmap = data.notes.sort((a, b) => a.time - b.time);
    this.meta = data.meta;
  }

  handleHit(type) {
    HitDetect(this, type);
  }

  update(deltaTime) {
    const currentTimeMs = this.audio.currentTime * 1000;

    while (
      this.nextNoteIndex < this.beatmap.length &&
      currentTimeMs >=
        this.beatmap[this.nextNoteIndex].time - C.NOTE_SPAWN_LEAD_TIME
    ) {
      const noteData = this.beatmap[this.nextNoteIndex];
      this.notes.push(new Note(noteData, this.meta));
      this.nextNoteIndex++;
    }

    this.notes.forEach((note) => note.update(deltaTime));
    this.notes = this.notes.filter((note) => {
      if (note.isHit) return false;
      if (currentTimeMs > note.time + C.MISS_WINDOW_MS) {
        this.score.update(0, 0);
        return false;
      }
      return note.y < C.CANVAS_HEIGHT + C.NOTE_SIZE;
    });

    this.particles.forEach((p) => p.update(deltaTime));
    this.particles = this.particles.filter((p) => p.isAlive());
    this.screenShake.update(deltaTime);
  }

  draw(ctx) {
    ctx.save();
    this.screenShake.shake(ctx);
    ctx.clearRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
    ctx.drawImage(this.bgImage, 0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
    this.arrowBox.draw(ctx);
    this.ctxFillLine(ctx);
    this.notes.forEach((note) => note.draw(ctx));
    this.particles.forEach((p) => p.draw(ctx));
    this.score.draw(ctx);
    ctx.restore();
  }

  ctxFillLine(ctx) {
    ctx.fillStyle = "#333";
    ctx.fillRect(0, C.HIT_LINE_Y - 50, C.CANVAS_WIDTH, 1);
  }

  destroy() {
    this.audio.pause();
    window.removeEventListener("keydown", this.onKeyDown);
  }
}
