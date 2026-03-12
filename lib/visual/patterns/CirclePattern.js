import { bounce, pulse } from "../motion";

export class CirclePattern {
  constructor(options = {}) {
    this.mode = options.mode || "center";
    this.count = options.count || 7;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.circles = Array.from({ length: this.count }, (_, index) => ({
      x: (width / (this.count + 1)) * (index + 1),
      y: (height / Math.max(4, this.count)) * ((index % Math.max(3, Math.ceil(this.count / 2))) + 1.5),
      radius: Math.min(width, height) * (0.1 + (index % 3) * 0.025),
      vx: (index % 2 === 0 ? 1 : -1) * (32 + index * 5),
      vy: (index % 3 === 0 ? -1 : 1) * (20 + index * 4),
      offset: index * 0.8,
    }));
  }

  update(time, delta) {
    this.time = time;
    this.circles = this.circles.map((circle) => {
      const xState = bounce(circle.x, circle.vx * delta, 0, this.width, circle.radius);
      const yState = bounce(circle.y, circle.vy * delta, 0, this.height, circle.radius);

      return {
        ...circle,
        x: xState.position,
        y: yState.position,
        vx: xState.velocity / delta,
        vy: yState.velocity / delta,
      };
    });
  }

  draw(ctx, palette) {
    ctx.strokeStyle = palette.fg;
    ctx.fillStyle = palette.fg;

    this.circles.forEach((circle) => {
      const scale = pulse((this.mode === "full" ? 1.2 : 0.7) * this.scaleFactor, this.mode === "full" ? 0.35 : 0.2, this.time + circle.offset, 2);
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius * scale, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius * 0.45 * scale, 0, Math.PI * 2);
      ctx.stroke();
    });
  }
}
