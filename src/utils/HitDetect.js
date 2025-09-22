import * as C from "@/utils/Constants.js";
import Particle from "@/components/Particle.js";

export function HitDetect(gameplay, type) {
  const currentTimeMs = gameplay.audio.currentTime * 1000;

  const targetNote = gameplay.notes
    .filter((n) => n.type === type && !n.isHit)
    .reduce(
      (closest, n) =>
        Math.abs(n.time - currentTimeMs) <
        Math.abs(closest.time - currentTimeMs)
          ? n
          : closest,
      { time: Infinity }
    );

  const timeDiff = Math.abs(currentTimeMs - targetNote.time);

  if (timeDiff <= C.GOOD_WINDOW_MS + C.OFFSITE_WINDOW) {
    targetNote.isHit = true;
    gameplay.screenShake.trigger(timeDiff <= C.PERFECT_WINDOW_MS ? 4 : 2, 200);
    gameplay.score.update(timeDiff <= C.PERFECT_WINDOW_MS ? 300 : 100, 1);
    for (let j = 0; j < 7; j++) {
      gameplay.particles.push(
        new Particle(targetNote.x, C.HIT_LINE_Y, targetNote.color)
      );
    }
  }
}
