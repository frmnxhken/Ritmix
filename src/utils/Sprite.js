export default class Sprite {
  constructor(
    { imageSrc, frameWidth, frameHeight, columns, rows },
    animations
  ) {
    this.image = new Image();
    this.image.src = imageSrc;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.columns = columns;
    this.rows = rows;
    this.totalFrames = this.columns * this.rows;
    this.animations = animations;
    this.currentAnim = null;
    this.currentAnimName = null;
    this.currentFrame = 0;
    this.elapsedTime = 0;
    this.isPlaying = false;
  }

  play(name) {
    if (!this.animations[name] || this.currentAnimName === name) return;
    this.currentAnim = this.animations[name];
    this.currentAnimName = name;
    this.currentFrame = this.currentAnim.startFrame;
    this.elapsedTime = 0;
    this.isPlaying = true;
  }

  stop() {
    this.isPlaying = false;
  }

  update(deltaTime) {
    if (!this.isPlaying || !this.currentAnim) return;

    this.elapsedTime += deltaTime;
    const frameDuration = 1000 / this.currentAnim.frameRate;

    while (this.elapsedTime >= frameDuration) {
      this.elapsedTime -= frameDuration;
      this.currentFrame++;

      if (this.currentFrame > this.currentAnim.endFrame) {
        console.log(this.currentAnim.loop);

        if (this.currentAnim.loop) {
          this.currentFrame = this.currentAnim.startFrame;
        } else {
          this.currentFrame = this.currentAnim.endFrame;
          this.isPlaying = false;
        }
      }
    }
  }

  draw(ctx, x, y, size = this.frameWidth) {
    const col = this.currentFrame % this.columns;
    const row = Math.floor(this.currentFrame / this.columns);

    const sx = col * this.frameWidth;
    const sy = row * this.frameHeight;

    ctx.drawImage(
      this.image,
      sx,
      sy,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      size,
      size
    );
  }
}
