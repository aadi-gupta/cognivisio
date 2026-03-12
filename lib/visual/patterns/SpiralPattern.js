import { pulse, rotate } from "../motion";

export class SpiralPattern {
  constructor(options = {}) {
    this.mode = options.mode || "center";
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.center = { x: width / 2, y: height / 2 };
    this.baseScale = Math.min(width, height) * 0.09;
    this.angle = 0;
    this.lineWidth = Math.max(28, Math.min(width, height) * 0.08);
  }

  update(time, delta) {
    this.time = time;
    this.angle = rotate(this.angle, 0.12, delta);
  }

  draw(ctx, palette, phaseTime = 0) {
    const arms = 2;
    const pulseScale = pulse(1, 0.05, this.time, 1.1);
    const growth = this.mode === "full"
      ? 1.05 + Math.min(phaseTime / 8, 1) * 0.35
      : this.scaleFactor + Math.min(phaseTime / 8, 1) * 0.35;
    const bloom = pulseScale * growth;

    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(this.angle);
    ctx.scale(bloom, bloom);
    ctx.strokeStyle = palette.fg;
    ctx.lineWidth = this.lineWidth;

    for (let arm = 0; arm < arms; arm += 1) {
      ctx.save();
      ctx.rotate((Math.PI * 2 * arm) / arms);
      ctx.beginPath();

      for (let t = 0; t < 20; t += 0.08) {
        const radius = this.baseScale * t;
        const x = Math.cos(t * 1.55) * radius;
        const y = Math.sin(t * 1.55) * radius;

        if (t === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }
}
