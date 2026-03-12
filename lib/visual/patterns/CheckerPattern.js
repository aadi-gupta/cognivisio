import { drift, pulse } from "../motion";

export class CheckerPattern {
  constructor(options = {}) {
    this.mode = options.mode || "full";
    this.density = options.density || 6;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.cell = Math.min(width, height) / (this.density + 2);
    this.offset = 0;
  }

  update(time, delta) {
    this.time = time;
    this.offset = drift(this.offset, 26, delta, this.cell * 2);
  }

  draw(ctx, palette) {
    const scale = pulse((this.mode === "center" ? 0.45 : 0.9) * this.scaleFactor, 0.18, this.time, 1.1);
    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-this.width / 2, -this.height / 2);
    ctx.fillStyle = palette.fg;

    for (let y = -this.cell; y < this.height + this.cell; y += this.cell) {
      for (let x = -this.cell; x < this.width + this.cell; x += this.cell) {
        const row = Math.floor(y / this.cell);
        const col = Math.floor((x + this.offset) / this.cell);
        if ((row + col) % 2 === 0) {
          ctx.fillRect(x + this.offset, y, this.cell, this.cell);
        }
      }
    }

    ctx.restore();
  }
}
