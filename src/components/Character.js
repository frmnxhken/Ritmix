import Sprite from "@/utils/Sprite";

const BASE_ANIMATIONS = {
  idle: { startFrame: 0, endFrame: 2, frameRate: 8, loop: true },
  left: { startFrame: 3, endFrame: 5, frameRate: 8, loop: false },
  right: { startFrame: 6, endFrame: 8, frameRate: 8, loop: false },
  up: { startFrame: 9, endFrame: 11, frameRate: 13, loop: false },
  down: { startFrame: 12, endFrame: 14, frameRate: 13, loop: false },
};

export default class Character {
  constructor(imageSrc) {
    this.sprite = new Sprite({ imageSrc }, BASE_ANIMATIONS);
  }

  setPosition() {}

  update() {}

  play() {}

  draw() {}
}
