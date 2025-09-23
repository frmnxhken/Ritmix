export default class AudioManager {
  constructor(audioSrc) {
    this.audio = new Audio(audioSrc);
    this.audio.currentTime = 0;
    this.startTime = null;
  }

  play(onEnded) {
    this.audio.currentTime = 0;
    this.audio.onplay = () => {
      this.startTime = performance.now();
    };

    this.audio.onended = onEnded;
    return this.audio.play();
  }

  currentTimeMs() {
    return performance.now() - this.startTime;
  }
}
