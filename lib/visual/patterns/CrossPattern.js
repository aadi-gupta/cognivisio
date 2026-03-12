import { rotate } from "../motion";

export class CrossPattern {
  constructor(options = {}) {
    this.mode = options.mode || "center";
    this.count = options.count || 20;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.items = Array.from({ length: this.count }, (_, index) => ({
      x: ((index + 1) / (this.count + 1)) * width,
      y: (-height * 0.8) + index * 42,
      size: Math.min(width, height) * (0.15 + (index % 3) * 0.036) * this.scaleFactor,
      speed: 30 + index * 2,
      angle: index * 0.1,
      spin: index % 2 === 0 ? 0.35 : -0.35,
      alpha: 0.35 + (index % 4) * 0.12,
    }));
  }

  update(time, delta) {
    this.time = time;
    this.items = this.items.map((item) => {
      let nextY = item.y + item.speed * delta;
      if (nextY - item.size > this.height) {
        nextY = -item.size * 6;
      }

      return {
        ...item,
        y: nextY,
        angle: rotate(item.angle, item.spin, delta),
      };
    });
  }

  draw(ctx, palette) {
    this.items.forEach((item) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.angle);
      ctx.strokeStyle = palette.fg;
      ctx.globalAlpha = item.alpha;
      ctx.lineWidth = 32;
      ctx.beginPath();
      ctx.moveTo(-item.size, 0);
      ctx.lineTo(item.size, 0);
      ctx.moveTo(0, -item.size);
      ctx.lineTo(0, item.size);
      ctx.stroke();
      ctx.restore();
    });

    ctx.globalAlpha = 1;
  }
}
