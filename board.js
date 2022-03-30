class Board {
  constructor(ctx, ctxNext, ctxHold) {
    this.ctx = ctx;
    this.ctxNext = ctxNext;
    this.ctxHold = ctxHold;
    this.grid = this.getEmptyBoard(ROWS,COLS);    
    this.setNextPiece();
    this.setCurrentPiece();
  }
  
  getEmptyBoard(rows,cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
  }
  
  draw() {    
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          const gradient = this.ctx.createLinearGradient(
            x - 0.5,
            y - 0.5,
            x + 1.5,
            y + 1.5
          );
          gradient.addColorStop(0, "white");
          gradient.addColorStop(0.5, COLOURS[value - 1]);
          gradient.addColorStop(0.9, "black");

          this.ctx.fillStyle = gradient;
          this.ctx.globalAlpha = 0.8;

          this.ctx.fillRect(x, y, 1, 1);
          this.ctx.globalAlpha = 1;
          this.ctx.strokeRect(x, y, 1, 1);
        }
      });
    });
  }

  setNextPiece() {
    const { width, height } = this.ctxNext.canvas;
    if (this.queue) {
      this.nextPiece = this.queue;
      this.queue = null;      
    } else {
      this.nextPiece = new Piece(this.ctxNext);      
    }
    this.ctxNext.clearRect(0, 0, width, height);
    this.nextPiece.draw();
  }

  setCurrentPiece() {
    this.piece = this.nextPiece;
    this.piece.ctx = this.ctx;
    this.piece.x = 3;
    this.setNextPiece();
  }

  setGhost() {
    this.ghostPiece = new Piece(this.ctx);
    this.ghostPiece.x = this.piece.x;
    this.ghostPiece.y = this.piece.y;
    this.ghostPiece.shape = this.piece.shape;
    this.ghostPiece.colour = this.piece.colour;

    let p = this.ghostPiece;
    while (board.ghostPiece.valid(p)) {
      board.ghostPiece.move(p);
      p = moves[KEY.DOWN](this.ghostPiece);
    }
    this.ghostPiece.drawGhost();
  }

  setHoldPiece() {
    
    if (this.holdPiece) {
      this.queue = this.nextPiece;          
      this.nextPiece = this.holdPiece;
      this.nextPiece.ctx = this.ctxNext;
      this.ctxNext.clearRect(0, 0, this.ctxNext.canvas.width, this.ctxNext.canvas.height);
      this.nextPiece.draw();
      this.ctxHold.clearRect(0, 0, this.ctxHold.canvas.width, this.ctxHold.canvas.height);
      this.holdPiece = null;
      return;
    }   

    this.holdPiece = this.nextPiece;
    this.holdPiece.ctx = this.ctxHold;
    this.ctxHold.clearRect(0, 0, this.ctxHold.canvas.width, this.ctxHold.canvas.height);
    this.holdPiece.drawGhost();
    this.setNextPiece();
  }

  isInBounds(x, y) {
    return x >= 0 && x < COLS && y < ROWS;
  }

  isVacant(x, y) {
    return this.grid[y] && this.grid[y][x] === 0;
  }

  clearLines() {
    let lines = 0;
    this.grid.forEach((row, y) => {
      if (row.every((value) => value !== 0)) {
        lines++;
        this.grid.splice(y, 1);
        this.grid.unshift(Array(COLS).fill(0));
      }
    });

    if (lines > 0) {
      player.score += this.getLineClearPoints(lines);
      pointsSound.currentTime = 0;
      pointsSound.play();
      player.lines += lines;
      if (player.lines >= LINES_PER_LEVEL) {
        player.level++;
        player.score += POINTS.LEVEL_UP;
        player.lines -= LINES_PER_LEVEL;
        time.level = LEVEL[player.level];
      }
    }
  }

  getLineClearPoints(lines) {
    const lineClearPoints =
      lines === 1
        ? POINTS.LINE_CLEARX1
        : lines === 2
        ? POINTS.LINE_CLEARX2
        : lines === 3
        ? POINTS.LINE_CLEARX3
        : lines === 4
        ? POINTS.TETRIS
        : 0;
    return (player.level + 1) * lineClearPoints;
  }
}
