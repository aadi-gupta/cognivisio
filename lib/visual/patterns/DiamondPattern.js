import { rotate } from "../motion";

export class DiamondPattern {
  constructor(options = {}) {
    this.mode = options.mode || "center";
    this.count = options.count || 12;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.items = Array.from({ length: this.count }, (_, index) => ({
      x: ((index + 1) / (this.count + 1)) * width,
      y: (-height * 0.9) + index * 70,
      size: Math.min(width, height) * (0.055 + (index % 3) * 0.014) * this.scaleFactor,
      speed: 40 + index * 5,
      angle: index * 0.2,
      spin: index % 2 === 0 ? 0.4 : -0.4,
    }));
  }

  update(time, delta) {
    this.time = time;
    this.items = this.items.map((item) => {
      let nextY = item.y + item.speed * delta;
      if (nextY - item.size > this.height) {
        nextY = -item.size * 4;
      }

      return {
        ...item,
        y: nextY,
        angle: rotate(item.angle, item.spin, delta),
      };
    });
  }

  draw(ctx, palette) {
    ctx.fillStyle = palette.fg;

    this.items.forEach((item) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.angle);
      ctx.beginPath();
      ctx.moveTo(0, -item.size);
      ctx.lineTo(item.size, 0);
      ctx.lineTo(0, item.size);
      ctx.lineTo(-item.size, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }
}
