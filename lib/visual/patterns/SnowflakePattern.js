import { pulse, rotate } from "../motion";

export class SnowflakePattern {
  constructor(options = {}) {
    this.mode = "full";
    this.density = options.density || 6;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    const cols = 6;
    const rows = 5;
    const cellWidth = width / cols;
    const cellHeight = height / rows;
    const maxScale = (0.72 + 0.18) * this.scaleFactor;
    const maxReach = Math.min(cellWidth, cellHeight) * 0.3;
    const baseSize = maxReach / Math.max(maxScale, 0.01);
    this.items = Array.from({ length: cols * rows }, (_, index) => ({
      x: ((index % cols) + 0.5) * (width / cols),
      y: (Math.floor(index / cols) + 0.5) * (height / rows),
      size: baseSize,
      angle: index * 0.2,
      spin: index % 2 === 0 ? 0.4 : -0.4,
    }));
  }

  update(time, delta) {
    this.time = time;
    this.items = this.items.map((item) => ({
      ...item,
      angle: rotate(item.angle, item.spin, delta),
    }));
  }

  drawSnowflake(ctx, size) {
    const branchStart = size * 0.45;
    const branchLength = size * 0.26;

    ctx.beginPath();

    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const tipX = Math.cos(angle) * size;
      const tipY = Math.sin(angle) * size;
      const branchX = Math.cos(angle) * branchStart;
      const branchY = Math.sin(angle) * branchStart;
      const leftAngle = angle - Math.PI / 5;
      const rightAngle = angle + Math.PI / 5;

      ctx.moveTo(0, 0);
      ctx.lineTo(tipX, tipY);

      ctx.moveTo(branchX, branchY);
      ctx.lineTo(
        branchX + Math.cos(leftAngle) * branchLength,
        branchY + Math.sin(leftAngle) * branchLength
      );

      ctx.moveTo(branchX, branchY);
      ctx.lineTo(
        branchX + Math.cos(rightAngle) * branchLength,
        branchY + Math.sin(rightAngle) * branchLength
      );
    }

    ctx.stroke();
  }

  draw(ctx, palette) {
    const scale = pulse(0.78 * this.scaleFactor, 0.12, this.time, 1.2);
    const baseLineWidth = 10;
    ctx.strokeStyle = palette.fg;

    this.items.forEach((item) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.angle);
      ctx.scale(scale, scale);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = baseLineWidth / Math.max(scale, 0.01);
      this.drawSnowflake(ctx, item.size);
      ctx.restore();
    });
  }
}
