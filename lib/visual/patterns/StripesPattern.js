import { drift, pulse } from "../motion";

export class StripesPattern {
  constructor(options = {}) {
    this.mode = options.mode || "full";
    this.density = options.density || 8;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.offset = 0;
    this.band = Math.min(width, height) / (this.density + 2);
  }

  update(time, delta) {
    this.time = time;
    this.offset = drift(this.offset, 38, delta, this.band * 4);
  }

  draw(ctx, palette) {
    const zoom = pulse((this.mode === "center" ? 0.42 : 0.92) * this.scaleFactor, 0.14, this.time, 1.2);
    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.scale(zoom, zoom);
    ctx.rotate(-Math.PI / 4);
    ctx.translate(-this.width / 2, -this.height / 2);
    ctx.fillStyle = palette.fg;

    for (let x = -this.width; x < this.width * 2; x += this.band * 2) {
      ctx.fillRect(x + this.offset, -this.height, this.band, this.height * 3);
    }

    ctx.restore();
  }
}
