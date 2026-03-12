import { bounce, rotate } from "../motion";

export class PawPattern {
  constructor(options = {}) {
    this.mode = options.mode || "center";
    this.count = options.count || 8;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.items = Array.from({ length: this.count }, (_, index) => ({
      x: ((index + 1) / (this.count + 1)) * width,
      y: ((index % Math.max(2, Math.ceil(this.count / 2))) + 1) * (height / (Math.max(3, Math.ceil(this.count / 2)) + 1)),
      vx: (index % 2 === 0 ? 1 : -1) * (26 + index * 4),
      vy: (index % 3 === 0 ? -1 : 1) * (20 + index * 3),
      size: Math.min(width, height) * (0.08 + (index % 2) * 0.015) * this.scaleFactor,
      angle: index * 0.2,
      spin: index % 2 === 0 ? 0.6 : -0.6,
    }));
  }

  update(time, delta) {
    this.time = time;
    this.items = this.items.map((item) => {
      const xState = bounce(item.x, item.vx * delta, 0, this.width, item.size);
      const yState = bounce(item.y, item.vy * delta, 0, this.height, item.size);

      return {
        ...item,
        x: xState.position,
        y: yState.position,
        vx: xState.velocity / delta,
        vy: yState.velocity / delta,
        angle: rotate(item.angle, item.spin, delta),
      };
    });
  }

  drawPaw(ctx, size) {
    ctx.beginPath();
    ctx.ellipse(-size * 0.45, -size * 0.45, size * 0.18, size * 0.24, 0, 0, Math.PI * 2);
    ctx.ellipse(0, -size * 0.58, size * 0.18, size * 0.24, 0, 0, Math.PI * 2);
    ctx.ellipse(size * 0.45, -size * 0.45, size * 0.18, size * 0.24, 0, 0, Math.PI * 2);
    ctx.ellipse(size * 0.7, -size * 0.05, size * 0.18, size * 0.24, 0, 0, Math.PI * 2);
    ctx.ellipse(0, size * 0.25, size * 0.46, size * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  draw(ctx, palette) {
    ctx.fillStyle = palette.fg;
    this.items.forEach((item) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.angle);
      this.drawPaw(ctx, item.size);
      ctx.restore();
    });
  }
}
