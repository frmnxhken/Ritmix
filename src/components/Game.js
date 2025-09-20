import Note from "./Note.js";
import Particle from "./Particle.js";
import * as C from "../utils/Constants.js";

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
    this.score = 0;
    this.combo = 0;
    this.nextNoteIndex = 0;
  }

  async loadBeatmap() {
    const res = await fetch(this.beatmapUrl);
    const data = await res.json();
    this.beatmap = data.notes.sort((a, b) => a.time - b.time);
    this.meta = data.meta;
  }

  start() {
    this.audio.currentTime = 0;
    this.audio.play();
    requestAnimationFrame((t) => this.loop(t));
  }

  handleHit(type) {
    const currentTimeMs = this.audio.currentTime * 1000;
    const targetNoteIndex = this.notes.findIndex(
      (note) => note.type === type && !note.isHit
    );
    if (targetNoteIndex === -1) return;
    const targetNote = this.notes[targetNoteIndex];
    const timeDiff = Math.abs(currentTimeMs - targetNote.time);

    if (timeDiff <= C.GOOD_WINDOW_MS) {
      targetNote.isHit = true;
      this.score += timeDiff <= C.PERFECT_WINDOW_MS ? 300 : 100;
      this.combo++;
      for (let j = 0; j < 15; j++) {
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
        this.combo = 0;
        return false;
      }
      return note.y < C.CANVAS_HEIGHT + C.NOTE_SIZE;
    });

    this.particles.forEach((p) => p.update(deltaTime));
    this.particles = this.particles.filter((p) => p.isAlive());
  }

  draw() {
    this.ctx.clearRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, C.HIT_LINE_Y, C.CANVAS_WIDTH, 5);
    this.notes.forEach((note) => note.draw(this.ctx));
    this.particles.forEach((p) => p.draw(this.ctx));
    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    this.ctx.fillText(`Combo: ${this.combo}`, 10, 60);
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
