import Note from "./Note.js";
import Particle from "./Particle.js";
import Score from "./Score.js";
import * as C from "../utils/Constants.js";
import { ArrowBox } from "./ArrowBox.js";

export default class Game {
  constructor(canvas, ctx, audioSrc, beatmapUrl) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.audio = new Audio(audioSrc);
    this.beatmapUrl = beatmapUrl;
    this.notes = [];
    this.particles = [];
    this.lastTime = 0;
    this.beatmap = [];
    this.score = new Score();
    this.arrowBox = new ArrowBox();
    this.nextNoteIndex = 0;
    this.bgImage = new Image();
    this.bgImage.src = "bg.jpg";
    this.shakeDuration = 0;
    this.shakeElapsed = 0;
    this.shakeIntensity = 0;
  }

  async loadBeatmap() {
    const res = await fetch(this.beatmapUrl);
    const data = await res.json();
    this.beatmap = data.notes.sort((a, b) => a.time - b.time);
    this.meta = data.meta;
  }

  triggerShake(intensity = 2, duration = 150) {
    this.shakeDuration = duration;
    this.shakeElapsed = 0;
    this.shakeIntensity = intensity;
  }

  start() {
    this.audio.currentTime = 0;
    this.audio.play();
    requestAnimationFrame((t) => this.loop(t));
  }

  handleHit(type) {
    const currentTimeMs = this.audio.currentTime * 1000;
    const targetNote = this.notes
      .filter((n) => n.type === type && !n.isHit)
      .reduce(
        (closest, n) => {
          return Math.abs(n.time - currentTimeMs) <
            Math.abs(closest.time - currentTimeMs)
            ? n
            : closest;
        },
        { time: Infinity }
      );
    const timeDiff = Math.abs(currentTimeMs - targetNote.time);

    if (timeDiff <= C.GOOD_WINDOW_MS + C.OFFSITE_WINDOW) {
      targetNote.isHit = true;
      this.triggerShake(timeDiff <= C.PERFECT_WINDOW_MS ? 4 : 2, 200);
      this.score.update(timeDiff <= C.PERFECT_WINDOW_MS ? 300 : 100, 1);
      for (let j = 0; j < 7; j++) {
        this.particles.push(
          new Particle(targetNote.x, C.HIT_LINE_Y, targetNote.color)
        );
      }
    }
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

    if (this.shakeDuration > 0) {
      this.shakeElapsed += deltaTime;
      if (this.shakeElapsed >= this.shakeDuration) {
        this.shakeDuration = 0;
        this.shakeElapsed = 0;
      }
    }
  }

  draw() {
    this.ctx.save();

    if (this.shakeDuration > 0) {
      const progress = this.shakeElapsed / this.shakeDuration;
      const angle = Math.sin(progress * Math.PI * 2);
      const dx = angle * this.shakeIntensity;
      const dy = (Math.random() - 0.3) * 2;
      this.ctx.translate(dx, dy);
      const zoom = 1 + 0.01 * (0.3 - progress);
      this.ctx.translate(C.CANVAS_WIDTH / 2, C.CANVAS_HEIGHT / 2);
      this.ctx.scale(zoom, zoom);
      this.ctx.translate(-C.CANVAS_WIDTH / 2 + dx, -C.CANVAS_HEIGHT / 2 + dy);
    }

    this.ctx.clearRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
    this.ctx.drawImage(this.bgImage, 0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
    this.arrowBox.draw(this.ctx);
    this.ctx.fillStyle = "#333";
    this.ctx.fillRect(0, C.HIT_LINE_Y - 50, C.CANVAS_WIDTH, 1);
    this.notes.forEach((note) => note.draw(this.ctx));
    this.particles.forEach((p) => p.draw(this.ctx));
    this.score.draw(this.ctx);

    this.ctx.restore();
  }

  loop(timestamp = 0) {
    if (!this.lastTime) this.lastTime = timestamp;
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.update(deltaTime);
    this.draw();
    requestAnimationFrame((t) => this.loop(t));
  }
}
