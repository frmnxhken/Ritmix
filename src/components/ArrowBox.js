export class ArrowBox {
  constructor() {
    const arrows = ["left", "up", "down", "right"];
    this.positions = arrows.map((dir, i) => ({
      name: dir,
      image: this.loadImage(`/arrow_box/${dir}.png`),
      x: 130 + i * 130,
    }));
  }

  loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  draw(ctx) {
    this.positions.forEach(({ image, x }) => {
      ctx.drawImage(image, x, 460, 80, 80);
    });
  }
}
