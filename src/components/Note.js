import {
  HIT_LINE_Y,
  NOTE_SIZE,
  LEAD_BEAT,
  MISS_WINDOW_MS,
  CANVAS_HEIGHT,
} from "@/utils/Constants.js";

export default class Note {
  static loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  static variants = {
    left: {
      x: 150,
      color: "#FF17AC",
      image: Note.loadImage("/note/left.png"),
    },
    up: {
      x: 280,
      color: "#14F80D",
      image: Note.loadImage("/note/up.png"),
    },
    down: {
      x: 680,
      color: "#00FFFF",
      image: Note.loadImage("/note/down.png"),
    },
    right: {
      x: 810,
      color: "#FF131E",
      image: Note.loadImage("/note/right.png"),
    },
  };

  constructor(noteData, meta) {
    this.type = noteData.type;
    this.x = Note.variants[this.type].x;
    this.y = -NOTE_SIZE;
    this.color = Note.variants[this.type].color;
    this.image = Note.variants[this.type].image;
    this.size = NOTE_SIZE;
    this.isHit = false;
    this.time = noteData.time;
    const msPerBeat = (60 / meta.bpm) * 1000;
    this.leadTime = msPerBeat * LEAD_BEAT;
  }

  update(deltaTime, currentTimeMs) {
    const timeUntilHit = this.time - currentTimeMs;
    // if (timeUntilHit < -200) {
    //   return;
    // }

    const travelPercentageRemaining = timeUntilHit / this.leadTime;
    const totalDistance = HIT_LINE_Y + this.size / 2;
    this.y = HIT_LINE_Y - totalDistance * travelPercentageRemaining;
  }

  remove(currentTimeMs, score) {
    if (this.isHit) return true;
    if (currentTimeMs > this.time + MISS_WINDOW_MS) {
      score.update(0, 0);
      return true;
    }

    if (this.y > CANVAS_HEIGHT + NOTE_SIZE) {
      return true;
    }

    return false;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }
}
