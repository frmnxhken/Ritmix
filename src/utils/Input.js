const keyMap = {
  ArrowLeft: "left",
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowRight: "right",
};

export function initInput(gameInstance) {
  window.addEventListener("keydown", (e) => {
    const key = keyMap[e.key];
    if (key) {
      gameInstance.handleHit(key);
    }
  });
}
