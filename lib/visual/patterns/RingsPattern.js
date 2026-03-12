import { ripple } from "../motion";

export class RingsPattern {
  constructor(options = {}) {
    this.mode = options.mode || "center";
    this.count = options.count || 7;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.center = { x: width / 2, y: height / 2 };
    this.spacing = Math.min(width, height) / (this.count + 1);
  }

  update(time) {
    this.time = time;
  }

  draw(ctx, palette, phaseTime = 0) {
    const centerScale = (this.mode === "center" ? 0.3 + Math.min(phaseTime / 4.6, 1) * 1.6 : 1) * this.scaleFactor;
    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.scale(centerScale, centerScale);
    ctx.translate(-this.center.x, -this.center.y);
    ctx.strokeStyle = palette.fg;
    ctx.lineWidth = 12;

    for (let i = 0; i < this.count; i += 1) {
      const radius = ripple(i * this.spacing, 80, this.time, this.spacing * this.count);
      const alpha = 1 - radius / (this.spacing * this.count);
      ctx.globalAlpha = Math.max(alpha, 0.08);
      ctx.beginPath();
      ctx.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }
}
