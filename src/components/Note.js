import {
  HIT_LINE_Y,
  NOTE_SIZE,
  NOTE_SPAWN_LEAD_TIME,
} from "../utils/Constants.js";

export default class Note {
  static loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  static variants = {
    left: {
      x: 170,
      color: "#FF17AC",
      image: Note.loadImage("/note/left.png"),
    },
    up: {
      x: 300,
      color: "#14F80D",
      image: Note.loadImage("/note/up.png"),
    },
    down: {
      x: 430,
      color: "#00FFFF",
      image: Note.loadImage("/note/down.png"),
    },
    right: {
      x: 560,
      color: "#FF131E",
      image: Note.loadImage("/note/right.png"),
    },
  };

  constructor(noteData) {
    this.type = noteData.type;
    this.time = noteData.time;
    this.x = Note.variants[this.type].x;
    this.y = -NOTE_SIZE;
    this.color = Note.variants[this.type].color;
    this.image = Note.variants[this.type].image;
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
    ctx.drawImage(
      this.image,
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }
}
