import { drift, wave } from "../motion";

export class DiamondGridPattern {
  constructor(options = {}) {
    this.mode = "full";
    this.density = options.density || 6;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.offsets = [0, 0];
    this.cell = Math.min(width, height) / (this.density + 3);
  }

  update(time, delta) {
    this.time = time;
    this.offsets[0] = drift(this.offsets[0], 36, delta, this.cell * 2);
    this.offsets[1] = drift(this.offsets[1], 18, delta, this.cell * 2);
  }

  drawLayer(ctx, palette, offset, alpha, scale) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = palette.fg;
    ctx.lineWidth = 14;
    ctx.scale(scale * this.scaleFactor, scale * this.scaleFactor);

    for (let y = -this.cell; y < this.height / scale + this.cell; y += this.cell * 1.6) {
      for (let x = -this.cell; x < this.width / scale + this.cell; x += this.cell * 1.6) {
        const bob = wave((x + y) * 0.01, this.cell * 0.12, 2, this.time);
        ctx.beginPath();
        ctx.moveTo(x + offset, y + bob - this.cell * 0.7);
        ctx.lineTo(x + offset + this.cell * 0.7, y + bob);
        ctx.lineTo(x + offset, y + bob + this.cell * 0.7);
        ctx.lineTo(x + offset - this.cell * 0.7, y + bob);
        ctx.closePath();
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  draw(ctx, palette) {
    this.drawLayer(ctx, palette, this.offsets[0], 1, 1);
    this.drawLayer(ctx, palette, -this.offsets[1], 0.45, 0.82);
  }
}
