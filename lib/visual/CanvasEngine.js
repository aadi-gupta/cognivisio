export class CanvasEngine {
  constructor(canvas, phaseFactories, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.phaseFactories = phaseFactories;
    this.options = {
      phaseDuration: 12,
      phaseTransitionDuration: 3,
      invertDuration: 10,
      paletteMode: "mono",
      timeScale: 1,
      ...options,
    };
    this.pattern = null;
    this.nextPattern = null;
    this.phaseIndex = 0;
    this.phaseStartedAt = 0;
    this.transitionStartedAt = null;
    this.animationFrame = null;
    this.lastTime = 0;
    this.handleResize = this.handleResize.bind(this);
    this.loop = this.loop.bind(this);
  }

  start() {
    if (!this.canvas || !this.ctx) {
      return;
    }

    this.createPattern(0);
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
    this.animationFrame = window.requestAnimationFrame(this.loop);
  }

  stop() {
    window.removeEventListener("resize", this.handleResize);

    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }
  }

  handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (this.pattern) {
      this.pattern.init(width, height, dpr);
    }

    if (this.nextPattern) {
      this.nextPattern.init(width, height, dpr);
    }
  }

  createPattern(index) {
    const factory = this.phaseFactories[index];
    return factory();
  }

  lerp(start, end, progress) {
    return start + (end - start) * progress;
  }

  lerpColor(from, to, progress) {
    const fromRgb = [
      parseInt(from.slice(1, 3), 16),
      parseInt(from.slice(3, 5), 16),
      parseInt(from.slice(5, 7), 16),
    ];
    const toRgb = [
      parseInt(to.slice(1, 3), 16),
      parseInt(to.slice(3, 5), 16),
      parseInt(to.slice(5, 7), 16),
    ];
    const value = fromRgb.map((channel, index) =>
      Math.round(this.lerp(channel, toRgb[index], progress))
    );

    return `rgb(${value[0]}, ${value[1]}, ${value[2]})`;
  }

  getPalette(time) {
    if (this.options.paletteMode === "color") {
      return this.getColorPalette(time);
    }

    return this.getMonoPalette(time);
  }

  getMonoPalette(time) {
    const segment = Math.floor(time / this.options.invertDuration);
    const progress = (time % this.options.invertDuration) / this.options.invertDuration;
    const light = { bg: "#ffffff", fg: "#000000" };
    const dark = { bg: "#000000", fg: "#ffffff" };
    const current = segment % 2 === 0 ? light : dark;
    const next = segment % 2 === 0 ? dark : light;

    if (progress < 0.92) {
      return current;
    }

    const snapProgress = (progress - 0.92) / 0.08;
    return {
      bg: this.lerpColor(current.bg, next.bg, snapProgress),
      fg: this.lerpColor(current.fg, next.fg, snapProgress),
    };
  }

  getColorPalette(time) {
    const palettes = [
      { bg: "#fff7cf", fg: "#f04a32" },
      { bg: "#102a63", fg: "#ffd44d" },
      { bg: "#f6fbff", fg: "#1e88ff" },
      { bg: "#143d2d", fg: "#ffef6c" },
      { bg: "#fff0f6", fg: "#d93b7f" },
    ];
    const segment = Math.floor(time / this.options.invertDuration);
    const progress = (time % this.options.invertDuration) / this.options.invertDuration;
    const current = palettes[segment % palettes.length];
    const next = palettes[(segment + 1) % palettes.length];

    if (progress < 0.9) {
      return current;
    }

    const snapProgress = (progress - 0.9) / 0.1;
    return {
      bg: this.lerpColor(current.bg, next.bg, snapProgress),
      fg: this.lerpColor(current.fg, next.fg, snapProgress),
    };
  }

  drawPattern(pattern, palette, phaseTime, alpha = 1) {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    pattern.draw(this.ctx, palette, phaseTime);
    this.ctx.restore();
  }

  loop(timestamp) {
    const realTime = timestamp / 1000;
    const rawDelta = this.lastTime ? Math.min(realTime - this.lastTime, 0.033) : 0.016;
    this.lastTime = realTime;
    this.elapsedTime = (this.elapsedTime || 0) + rawDelta * this.options.timeScale;
    const time = this.elapsedTime;
    const delta = rawDelta * this.options.timeScale;
    const palette = this.getPalette(time);

    if (!this.pattern) {
      this.pattern = this.createPattern(0);
      this.phaseIndex = 0;
      this.phaseStartedAt = time;
      this.pattern.init(window.innerWidth, window.innerHeight, Math.min(window.devicePixelRatio || 1, 2));
    }

    if (
      !this.transitionStartedAt &&
      time - this.phaseStartedAt >= this.options.phaseDuration
    ) {
      const nextIndex = (this.phaseIndex + 1) % this.phaseFactories.length;
      this.nextPattern = this.createPattern(nextIndex);
      this.nextPattern.init(
        window.innerWidth,
        window.innerHeight,
        Math.min(window.devicePixelRatio || 1, 2)
      );
      this.nextPhaseIndex = nextIndex;
      this.transitionStartedAt = time;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = palette.bg;
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    this.pattern.update(time, delta, palette);
    if (this.transitionStartedAt && this.nextPattern) {
      this.nextPattern.update(time, delta, palette);
      const transitionProgress = Math.min(
        (time - this.transitionStartedAt) / this.options.phaseTransitionDuration,
        1
      );
      this.drawPattern(this.pattern, palette, time - this.phaseStartedAt, 1 - transitionProgress);
      this.drawPattern(this.nextPattern, palette, time - this.transitionStartedAt, transitionProgress);

      if (transitionProgress >= 1) {
        this.pattern = this.nextPattern;
        this.phaseIndex = this.nextPhaseIndex;
        this.phaseStartedAt = time;
        this.transitionStartedAt = null;
        this.nextPattern = null;
      }
    } else {
      this.drawPattern(this.pattern, palette, time - this.phaseStartedAt);
    }

    this.animationFrame = window.requestAnimationFrame(this.loop);
  }
}
