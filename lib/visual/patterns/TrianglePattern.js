import { pulse, rotate, drift } from "../motion";

export class TrianglePattern {
  constructor(options = {}) {
    this.mode = options.mode || "center";
    this.density = options.density || 5;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.size = Math.min(width, height) / (this.density + 3);
    this.offsetX = 0;
    this.offsetY = 0;
    this.rotation = 0;
  }

  update(time, delta) {
    this.time = time;
    this.rotation = rotate(this.rotation, 0.08, delta);
    this.offsetX = drift(this.offsetX, 34, delta, this.size * 2.4);
    this.offsetY = drift(this.offsetY, 20, delta, this.size * 2.1);
  }

  draw(ctx, palette) {
    const zoom = pulse((this.mode === "full" ? 1.2 : 0.55) * this.scaleFactor, this.mode === "full" ? 0.22 : 0.16, this.time, 1.2);
    const stepX = this.size * 2.2;
    const stepY = this.size * 1.9;

    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.rotate(this.rotation);
    ctx.scale(zoom, zoom);
    ctx.translate(-this.width / 2, -this.height / 2);
    ctx.fillStyle = palette.fg;

    for (let y = -stepY; y < this.height + stepY; y += stepY) {
      for (let x = -stepX; x < this.width + stepX; x += stepX) {
        ctx.beginPath();
        ctx.moveTo(x + this.offsetX, y + this.offsetY);
        ctx.lineTo(x + this.offsetX + this.size, y + this.offsetY + this.size * 1.6);
        ctx.lineTo(x + this.offsetX - this.size, y + this.offsetY + this.size * 1.6);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.restore();
  }
}
