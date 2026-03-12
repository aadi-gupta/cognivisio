import { pulse, drift } from "../motion";

export class TrianglesPattern {
  constructor(options = {}) {
    this.mode = options.mode || "full";
    this.density = options.density || 6;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.size = Math.min(width, height) / (this.density + 3);
    this.offset = 0;
  }

  update(time, delta) {
    this.time = time;
    this.offset = drift(this.offset, 32, delta, this.size * 2.8);
  }

  draw(ctx, palette) {
    const scale = pulse((this.mode === "center" ? 0.42 : 0.92) * this.scaleFactor, 0.12, this.time, 1.2);
    const step = this.size * 2.4;

    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-this.width / 2, -this.height / 2);
    ctx.fillStyle = palette.fg;

    for (let y = -step; y < this.height + step; y += step) {
      for (let x = -step; x < this.width + step; x += step) {
        ctx.beginPath();
        ctx.moveTo(x + this.offset, y);
        ctx.lineTo(x + this.offset + this.size, y + this.size * 1.7);
        ctx.lineTo(x + this.offset - this.size, y + this.size * 1.7);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.restore();
  }
}
