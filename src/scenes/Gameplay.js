import Note from "@/components/Note.js";
import Score from "@/components/Score.js";
import * as C from "@/utils/Constants.js";
import { ArrowBox } from "@/components/ArrowBox.js";
import ScreenShake from "@/utils/ScreenShake.js";
import { initInput } from "@/systems/Input.js";
import { HitDetect } from "@/utils/HitDetect.js";
import Sprite from "@/utils/Sprite";
import GameOver from "@/scenes/GameOver";
import AudioManager from "@/systems/AudioManager";

export default class Gameplay {
  constructor(game, data) {
    this.game = game;
    this.audioSrc = data.music;
    this.beatmapUrl = data.beat;
    this.character = new Sprite(
      {
        imageSrc: "bf.png",
        frameWidth: 675,
        frameHeight: 675,
        columns: 3,
        rows: 5,
      },
      {
        idle: {
          startFrame: 0,
          endFrame: 2,
          frameRate: 8,
          loop: true,
        },
        left: {
          startFrame: 3,
          endFrame: 5,
          frameRate: 8,
          loop: false,
        },
        right: {
          startFrame: 6,
          endFrame: 8,
          frameRate: 8,
          loop: false,
        },
        up: {
          startFrame: 9,
          endFrame: 11,
          frameRate: 8,
          loop: false,
        },
        down: {
          startFrame: 12,
          endFrame: 14,
          frameRate: 8,
          loop: false,
        },
      }
    );

    this.notes = [];
    this.particles = [];
    this.lastTime = 0;
    this.nextNoteIndex = 0;

    this.score = new Score();
    this.arrowBox = new ArrowBox();
    this.screenShake = new ScreenShake();

    this.bgImage = new Image();
    this.bgImage.src = "bg.jpg";

    this.audio = new AudioManager(this.audioSrc);
    this.beatmap = [];
  }

  async init() {
    const root = document.getElementById("root");
    root.innerHTML = `<canvas width="${C.CANVAS_WIDTH}" height="${C.CANVAS_HEIGHT}"></canvas>`;
    this.game.canvas = document.querySelector("canvas");
    this.game.ctx = this.game.canvas.getContext("2d");

    await this.loadBeatmap();
    initInput(this);
    await this.audio.play(() => {
      this.destroy();
      this.game.changeScene(new GameOver(this.game));
    });
    this.character.play("idle");
  }

  async loadBeatmap() {
    const res = await fetch(this.beatmapUrl);
    const data = await res.json();
    this.meta = data.meta;
    const beatDuration = 60000 / this.meta.bpm;

    this.beatmap = data.notes
      .map((note) => {
        if ("beat" in note) {
          return {
            ...note,
            time: note.beat * beatDuration,
          };
        }
        return note;
      })
      .sort((a, b) => a.time - b.time);
  }

  handleHit(type) {
    HitDetect(this, type);
  }

  update(deltaTime) {
    if (!this.audio.startTime) return;
    const currentTimeMs = this.audio.currentTimeMs();
    const msPerBeat = (60 / this.meta.bpm) * 1000;
    this.leadTime = msPerBeat * C.LEAD_BEAT;
    this.character.update(deltaTime);

    if (
      !this.character.isPlaying &&
      this.character.currentAnimName !== "idle"
    ) {
      this.character.play("idle");
    }

    while (
      this.nextNoteIndex < this.beatmap.length &&
      currentTimeMs >= this.beatmap[this.nextNoteIndex].time - this.leadTime
    ) {
      const noteData = this.beatmap[this.nextNoteIndex];
      this.notes.push(new Note(noteData, this.meta));
      this.nextNoteIndex++;
    }
    this.notes.forEach((note) => note.update(deltaTime, currentTimeMs));
    this.notes = this.notes.filter((note) => {
      if (note.isHit) return false;
      if (currentTimeMs > note.time + C.MISS_WINDOW_MS) {
        this.score.update(0, 0);
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
    this.character.draw(ctx, C.CANVAS_WIDTH / 2, C.CANVAS_HEIGHT - 300, 200);
    this.arrowBox.draw(ctx);
    this.notes.forEach((note) => note.draw(ctx));
    this.particles.forEach((p) => p.draw(ctx));
    this.score.draw(ctx);
    ctx.restore();
  }

  destroy() {
    this.audio.audio.pause();
    window.removeEventListener("keydown", this.onKeyDown);
  }
}
