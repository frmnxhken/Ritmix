export class ArrowBox {
  static loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  static positions = [
    { name: "left", image: ArrowBox.loadImage("/arrow_box/left.png"), x: 150 },
    { name: "up", image: ArrowBox.loadImage("/arrow_box/up.png"), x: 280 },
    { name: "down", image: ArrowBox.loadImage("/arrow_box/down.png"), x: 680 },
    {
      name: "right",
      image: ArrowBox.loadImage("/arrow_box/right.png"),
      x: 810,
    },
  ];

  draw(ctx) {
    ArrowBox.positions.forEach(({ image, x }) => {
      ctx.drawImage(image, x - 80 / 2, 420, 80, 80);
    });
  }
}
