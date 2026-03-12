import { pulse } from "../motion";

export class DotsPattern {
  constructor(options = {}) {
    this.mode = options.mode || "full";
    this.density = options.density || 6;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.spacing = Math.min(width, height) / (this.density + 2);
  }

  update(time) {
    this.time = time;
  }

  draw(ctx, palette) {
    const zoom = pulse((this.mode === "center" ? 0.28 : 0.8) * this.scaleFactor, this.mode === "center" ? 0.35 : 0.45, this.time, 1.1);
    const radius = this.spacing * 0.76;

    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-this.width / 2, -this.height / 2);
    ctx.fillStyle = palette.fg;

    for (let y = this.spacing / 2; y < this.height + this.spacing; y += this.spacing) {
      for (let x = this.spacing / 2; x < this.width + this.spacing; x += this.spacing) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}
