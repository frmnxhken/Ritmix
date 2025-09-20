export default class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.random() * 2 + 2;
    this.speedX = (Math.random() - 0.5) * 4;
    this.speedY = (Math.random() - 0.5) * 4;
    this.life = 1000;
    this.opacity = 1;
  }
  update(deltaTime) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= deltaTime;
    this.opacity = Math.max(0, this.life / 1000);
  }
  draw(ctx) {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  isAlive() {
    return this.life > 0;
  }
}
