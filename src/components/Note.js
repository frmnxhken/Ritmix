import {
  HIT_LINE_Y,
  NOTE_SIZE,
  LEAD_BEAT,
  MISS_WINDOW_MS,
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
    this.endTime = noteData.endTime || null;
    this.isHit = false;
    this.isHolding = false;
    this.holdBroken = false;
    this.tailY = this.y;
  }

  update(deltaTime, currentTimeMs) {
    const timeUntilHit = this.time - currentTimeMs;
    const travelPercentageRemaining = timeUntilHit / this.leadTime;
    const totalDistance = HIT_LINE_Y + this.size / 2;
    this.y = HIT_LINE_Y - totalDistance * travelPercentageRemaining;

    if (this.endTime) {
      const travelTail = (this.endTime - currentTimeMs) / this.leadTime;
      this.tailY = HIT_LINE_Y - totalDistance * travelTail + this.size;
    }
  }

  remove(currentTimeMs, score) {
    const checkTime = this.endTime || this.time;
    if (currentTimeMs > checkTime + MISS_WINDOW_MS && !this.isHit) {
      score.update(0, 0);
      return true;
    }

    if (!this.endTime) {
      if (this.isHit) {
        return true;
      }
    }

    if (this.endTime) {
      if (currentTimeMs > this.endTime + MISS_WINDOW_MS) {
        return true;
      }
    }

    return false;
  }

  draw(ctx) {
    if (this.endTime > this.time) {
      const headY = this.y;
      const tailY = this.tailY;

      if (headY > -this.size) {
        if (
          this.holdBroken ||
          (!this.isHit && headY > HIT_LINE_Y + this.size / 2)
        ) {
          ctx.fillStyle = "#32495080";
        } else if (this.isHolding) {
          ctx.fillStyle = this.color;
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 32;
        } else {
          ctx.fillStyle = `${this.color}80`;
        }

        ctx.fillRect(
          this.x - this.size / 4,
          tailY,
          this.size / 2,
          headY - tailY
        );
      }
    }

    ctx.restore();

    if (this.isHit && this.isHolding) {
      return true;
    }

    ctx.drawImage(
      this.image,
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }
}
