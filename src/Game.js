export default class Game {
  constructor() {
    this.currentScene = null;
    this.lastTime = 0;
    this.canvas = null;
    this.ctx = null;
  }

  changeScene(scene) {
    if (this.currentScene && this.currentScene.destroy) {
      this.currentScene.destroy();
    }
    this.currentScene = scene;
    this.currentScene.init();
  }

  start() {
    const loop = (timestamp) => {
      const dt = timestamp - this.lastTime;
      this.lastTime = timestamp;

      if (this.currentScene && this.currentScene.update) {
        this.currentScene.update(dt);
      }

      if (this.currentScene && this.currentScene.draw && this.ctx) {
        this.currentScene.draw(this.ctx);
      }

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
