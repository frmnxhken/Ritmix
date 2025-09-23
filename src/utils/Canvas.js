import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/utils/Constants";

export function Canvas() {
  const root = document.getElementById("root");
  root.innerHTML = `<canvas width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>`;
}
