import {
  HIT_LINE_Y,
  NOTE_SIZE,
  NOTE_SPAWN_LEAD_TIME,
} from "../utils/Constants.js";

export default class Note {
  static variants = {
    left: { x: 100, color: "red" },
    up: { x: 300, color: "blue" },
    down: { x: 500, color: "green" },
    right: { x: 600, color: "yellow" },
  };

  constructor(noteData, meta) {
    this.type = noteData.type;
    this.time = noteData.time;
    this.x = Note.variants[this.type].x;
    this.y = -NOTE_SIZE;
    this.color = Note.variants[this.type].color;
    this.size = NOTE_SIZE;
    this.isHit = false;

    const distance = HIT_LINE_Y + this.size;
    const travelTime = NOTE_SPAWN_LEAD_TIME / 1000;
    this.speed = distance / travelTime;
  }

  update(deltaTime) {
    this.y += (this.speed * deltaTime) / 1000;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }
}
