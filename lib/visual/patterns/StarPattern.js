import { orbit, pulse } from "../motion";

export class StarPattern {
  constructor(options = {}) {
    this.mode = options.mode || "center";
    this.count = options.count || 9;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.center = { x: width / 2, y: height / 2 };
    this.items = Array.from({ length: this.count }, (_, index) => ({
      radius: Math.min(width, height) * (0.12 + index * 0.05),
      speed: 0.4 + index * 0.05,
      offset: index * 0.8,
      size: Math.min(width, height) * (0.18 + (index % 3) * 0.05),
    }));
  }

  update(time) {
    this.time = time;
  }

  draw(ctx, palette, phaseTime = 0) {
    const orbitBoost = (this.mode === "center" ? 0.4 + Math.min(phaseTime / 4.5, 1) * 0.9 : 1) * this.scaleFactor;
    ctx.fillStyle = palette.fg;

    this.items.forEach((item, index) => {
      const point = orbit(this.center, item.radius * orbitBoost, item.speed, this.time, item.offset);
      const alpha = pulse(0.7, 0.3, this.time + index, 3);
      ctx.globalAlpha = Math.max(0.2, alpha);
      ctx.save();
      ctx.translate(point.x, point.y);
      ctx.beginPath();
      for (let i = 0; i < 10; i += 1) {
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const radius = i % 2 === 0 ? item.size : item.size * 0.7;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    ctx.globalAlpha = 1;
  }
}
