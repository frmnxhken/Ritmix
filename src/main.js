import Game from "./components/Game.js";
import { initInput } from "./utils/Input.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./utils/Constants.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const game = new Game(canvas, ctx, "music1.mp3", "beat1.json");

initInput(game);

game
  .loadBeatmap()
  .then(() => {
    ctx.fillStyle = "white";
    ctx.font = "32px FNFFont";
    ctx.textAlign = "center";
    ctx.fillText(
      "Click anywhere to start",
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2
    );

    window.addEventListener(
      "click",
      () => {
        game.start();
      },
      { once: true }
    );
  })
  .catch((err) => {
    console.error("Failed to load beatmap:", err);
  });
