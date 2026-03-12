import { bounce } from "../motion";

export class CirclePattern {
  constructor(options = {}) {
    this.mode = options.mode || "center";
    this.count = options.count || 4;
    this.scaleFactor = options.scale || 1;
    this.spawnInterval = 2.5;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.center = { x: width / 2, y: height / 2 };
    this.baseRadius = Math.min(width, height) * 0.08;
    this.items = Array.from({ length: Math.max(this.count, 8) }, (_, index) => {
      const angle = -Math.PI / 2 + index * 1.17;
      const lane = 0.3 + (index % 3) * 0.18;

      return {
        angle,
        orbitRadius: Math.min(width, height) * (0.08 + index * 0.055),
        radius: this.baseRadius * (1 + (index % 3) * 0.22),
        driftX: ((index % 2 === 0 ? 1 : -1) * (22 + index * 4)),
        driftY: ((index % 3 === 0 ? -1 : 1) * (18 + index * 3)),
        x: this.center.x + Math.cos(angle) * width * 0.02,
        y: this.center.y + Math.sin(angle) * height * 0.02,
        lane,
        offset: index * 0.55,
      };
    });
  }

  update(time, delta) {
    this.time = time;
    this.items = this.items.map((item, index) => {
      const orbitWave = Math.sin(time * 0.75 + item.offset) * 0.08;
      const targetX = this.center.x + Math.cos(item.angle + time * 0.18) * item.orbitRadius * item.lane;
      const targetY = this.center.y + Math.sin(item.angle + time * 0.18) * item.orbitRadius * item.lane;
      const easedX = item.x + (targetX - item.x) * Math.min(delta * 2.6, 1);
      const easedY = item.y + (targetY - item.y) * Math.min(delta * 2.6, 1);
      const xState = bounce(easedX, (item.driftX + orbitWave * 20) * delta, 0, this.width, item.radius);
      const yState = bounce(easedY, (item.driftY - orbitWave * 20) * delta, 0, this.height, item.radius);

      return {
        ...item,
        x: xState.position,
        y: yState.position,
        driftX: xState.velocity / Math.max(delta, 0.001),
        driftY: yState.velocity / Math.max(delta, 0.001),
      };
    });
  }

  getVisibleCount(phaseTime) {
    const base = this.mode === "center" ? 2 : 3;
    const added = Math.floor(phaseTime / this.spawnInterval);
    return Math.max(base, Math.min(this.count, base + added));
  }

  getAppearanceProgress(phaseTime, index) {
    const appearAt = Math.max(0, index - (this.mode === "center" ? 2 : 3)) * this.spawnInterval;
    return Math.max(0, Math.min(1, (phaseTime - appearAt) / 0.9));
  }

  draw(ctx, palette, phaseTime = 0) {
    const visibleCount = this.getVisibleCount(phaseTime);
    const centerGrowth = Math.min(phaseTime / 6, 1);
    const spreadProgress = this.mode === "center" ? centerGrowth : 1;
    const moveProgress = this.mode === "full" ? Math.min(phaseTime / 3.5, 1) : Math.max(0, (phaseTime - 5.5) / 3.5);
    const zoom = this.mode === "center"
      ? 0.45 + centerGrowth * 0.8
      : 0.95 + Math.min(phaseTime / 5, 1) * 0.28;

    ctx.save();
    ctx.strokeStyle = palette.fg;

    this.items.slice(0, visibleCount).forEach((item, index) => {
      const appear = this.getAppearanceProgress(phaseTime, index);
      const radiusScale = (0.85 + spreadProgress * 0.75) * this.scaleFactor * (0.78 + appear * 0.22);
      const orbitScale = item.orbitRadius * spreadProgress;
      const centerX = this.center.x + Math.cos(item.angle) * orbitScale;
      const centerY = this.center.y + Math.sin(item.angle) * orbitScale;
      const x = centerX + (item.x - centerX) * moveProgress;
      const y = centerY + (item.y - centerY) * moveProgress;
      const radius = item.radius * radiusScale * zoom;
      const alpha = 0.4 + appear * 0.6;
      const lineWidth = Math.max(10, radius * 0.18);

      ctx.globalAlpha = alpha;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = Math.max(6, lineWidth * 0.55);
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.42, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.globalAlpha = 1;
    ctx.restore();
  }
}
