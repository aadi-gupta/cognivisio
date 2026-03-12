import { pulse, rotate } from "../motion";

export class SunburstPattern {
  constructor(options = {}) {
    this.mode = options.mode || "center";
    this.rays = options.rays || 40;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.center = { x: width / 2, y: height / 2 };
    this.radius = Math.min(width, height) * 0.38;
    this.angle = 0;
  }

  update(time, delta) {
    this.time = time;
    this.angle = rotate(this.angle, 0.14, delta);
  }

  draw(ctx, palette, phaseTime = 0) {
    const zoomBase = (this.mode === "center" ? 0.35 + Math.min(phaseTime / 4.6, 1) * 1.5 : 1.05) * this.scaleFactor;
    const zoom = pulse(zoomBase, 0.12, this.time, 1.6);
    const rayCount = this.rays;

    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(this.angle);
    ctx.scale(zoom, zoom);
    ctx.strokeStyle = palette.fg;
    ctx.lineWidth = 14;

    for (let i = 0; i < rayCount; i += 1) {
      ctx.save();
      ctx.rotate((Math.PI * 2 * i) / rayCount);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -this.radius);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }
}
