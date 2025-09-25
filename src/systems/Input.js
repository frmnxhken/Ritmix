const keyMap = {
  ArrowLeft: "left",
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowRight: "right",
};

export function initInput(gameInstance) {
  const onKeyDown = (e) => {
    const key = keyMap[e.key];
    if (key && !gameInstance.heldKeys[key]) {
      gameInstance.heldKeys[key] = true;
      gameInstance.handlePress(key);
    }
  };

  const onKeyUp = (e) => {
    const key = keyMap[e.key];
    if (key) {
      gameInstance.heldKeys[key] = false;
      gameInstance.handleRelease(key);
    }
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  gameInstance.onKeyDown = onKeyDown;
  gameInstance.onKeyUp = onKeyUp;
}
