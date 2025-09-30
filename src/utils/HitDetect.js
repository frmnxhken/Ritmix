import * as C from "@/utils/Constants.js";

function findClosestNote(gameplay, type) {
  const currentTimeMs = gameplay.audio.currentTimeMs();
  return gameplay.notes.notes
    .filter((n) => n.type === type && !n.isHit)
    .reduce(
      (closest, n) =>
        Math.abs(n.time - currentTimeMs) <
        Math.abs(closest.time - currentTimeMs)
          ? n
          : closest,
      { time: Infinity }
    );
}

export const HitDetect = {
  onPress(gameplay, type) {
    const targetNote = findClosestNote(gameplay, type);
    const currentTimeMs = gameplay.audio.currentTimeMs();
    const timeDiff = Math.abs(currentTimeMs - targetNote.time);

    if (timeDiff <= C.GOOD_WINDOW_MS) {
      targetNote.isHit = true;

      if (targetNote.endTime) {
        targetNote.isHolding = true;
      }

      gameplay.screenShake.trigger(
        timeDiff <= C.PERFECT_WINDOW_MS ? 4 : 2,
        200
      );

      gameplay.score.update(timeDiff <= C.PERFECT_WINDOW_MS ? 300 : 100, 1);
      for (let j = 0; j < 7; j++) {
        gameplay.particles.spawn(targetNote.x, C.HIT_LINE_Y, targetNote.color);
      }
    }
  },

  onRelease(gameplay, type) {
    const currentTimeMs = gameplay.audio.currentTimeMs();
    const heldNote = gameplay.notes.notes.find(
      (n) => n.type === type && n.isHolding
    );

    if (heldNote) {
      const releaseTime = currentTimeMs;
      const targetEndTime = heldNote.endTime;
      const window = C.GOOD_WINDOW_MS;
      const earliestReleaseTime = targetEndTime - window;

      if (releaseTime < earliestReleaseTime) {
        heldNote.holdBroken = true;
      } else {
        gameplay.score.update(500, 0);
      }
    }
  },
};
