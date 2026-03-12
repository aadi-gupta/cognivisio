import { pulse, rotate } from "../motion";

export class SnowflakePattern {
  constructor(options = {}) {
    this.mode = options.mode || "full";
    this.density = options.density || 6;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    const cols = Math.max(2, this.density + 1);
    const rows = Math.max(2, this.density);
    this.items = Array.from({ length: cols * rows }, (_, index) => ({
      x: ((index % cols) + 0.5) * (width / cols),
      y: (Math.floor(index / cols) + 0.5) * (height / rows),
      size: Math.min(width, height) * 0.05,
      angle: index * 0.2,
      spin: index % 2 === 0 ? 0.4 : -0.4,
    }));
  }

  update(time, delta) {
    this.time = time;
    this.items = this.items.map((item) => ({
      ...item,
      angle: rotate(item.angle, item.spin, delta),
    }));
  }

  drawSnowflake(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(size, 0);
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
    ctx.moveTo(-size * 0.7, -size * 0.7);
    ctx.lineTo(size * 0.7, size * 0.7);
    ctx.moveTo(-size * 0.7, size * 0.7);
    ctx.lineTo(size * 0.7, -size * 0.7);
    ctx.stroke();
  }

  draw(ctx, palette) {
    const scale = pulse((this.mode === "center" ? 0.45 : 0.94) * this.scaleFactor, 0.08, this.time, 1.4);
    ctx.strokeStyle = palette.fg;
    ctx.lineWidth = 8;

    this.items.forEach((item) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.angle);
      ctx.scale(scale, scale);
      this.drawSnowflake(ctx, item.size);
      ctx.restore();
    });
  }
}
