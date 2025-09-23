import Particle from "@/components/Particle";

export default class ParticleManager {
  constructor() {
    this.particles = [];
  }

  spawn(x, y, color) {
    this.particles.push(new Particle(x, y, color));
  }

  update(deltaTime) {
    this.particles.forEach((particle) => particle.update(deltaTime));
    this.particles = this.particles.filter((particle) => particle.isAlive());
  }

  draw(ctx) {
    this.particles.forEach((particle) => particle.draw(ctx));
  }
}
