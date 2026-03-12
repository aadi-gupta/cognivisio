export class CheckerPattern {
  constructor(options = {}) {
    this.mode = options.mode || "center";
    this.density = options.density || 2;
    this.scaleFactor = options.scale || 1;
  }

  init(width, height) {
    this.width = width;
    this.height = height;
    this.center = { x: width / 2, y: height / 2 };
    this.boardCells = Math.max(2, this.density);
    this.baseBoardSize = Math.min(width, height) * 0.18 * this.scaleFactor;
    this.maxBoardSize = Math.max(width, height) * (this.mode === "full" ? 1.9 : 1.5);
    this.wobbleSeed = this.density * 0.7;
  }

  update(time) {
    this.time = time;
  }

  getBoardSize(phaseTime = 0) {
    const growthWindow = this.mode === "full" ? 8.5 : 7.5;
    const progress = Math.min(phaseTime / growthWindow, 1);
    const eased = 1 - Math.pow(1 - progress, 2.4);
    return this.baseBoardSize + (this.maxBoardSize - this.baseBoardSize) * eased;
  }

  draw(ctx, palette, phaseTime = 0) {
    const boardSize = this.getBoardSize(phaseTime);
    const cellSize = boardSize / this.boardCells;
    const halfBoard = boardSize / 2;
    const driftX = Math.sin(this.time * 0.9 + this.wobbleSeed) * cellSize * 0.08;
    const driftY = Math.cos(this.time * 0.7 + this.wobbleSeed) * cellSize * 0.08;
    const startX = this.center.x - halfBoard + driftX;
    const startY = this.center.y - halfBoard + driftY;

    ctx.save();
    ctx.fillStyle = palette.fg;

    for (let row = 0; row < this.boardCells; row += 1) {
      for (let col = 0; col < this.boardCells; col += 1) {
        if ((row + col) % 2 !== 0) {
          continue;
        }

        const x = startX + col * cellSize;
        const y = startY + row * cellSize;

        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }

    ctx.restore();
  }
}
