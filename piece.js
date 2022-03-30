class Piece {
  constructor(ctx) {
    this.ctx = ctx;
    this.spawn();
  }

  spawn() {
    this.typeId = this.chooseType(SHAPES.length - 1);
    this.shape = SHAPES[this.typeId];
    this.colour = COLOURS[this.typeId];
    this.x = 0;
    this.y = 0;
    this.hardDropped = false;
  }

  chooseType(noOfTypes) {
    return Math.floor(Math.random() * noOfTypes);
  }

  draw() {
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          const gradient = this.ctx.createLinearGradient(
            this.x + x - 0.5,
            this.y + y - 0.5,
            this.x + x + 1.5,
            this.y + y + 1.5
          );
          gradient.addColorStop(0.0, "white");
          gradient.addColorStop(0.5, this.colour);
          gradient.addColorStop(0.9, "black");

          this.ctx.fillStyle = gradient;
          this.ctx.lineWidth = 1 / BLOCK_SIZE;
          this.ctx.globalAlpha = 0.8;

          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
          this.ctx.globalAlpha = 1;
          this.ctx.strokeRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }

  drawGhost() {
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          const gradient = this.ctx.createLinearGradient(
            this.x + x - 0.5,
            this.y + y - 0.5,
            this.x + x + 1.5,
            this.y + y + 1.5
          );
          gradient.addColorStop(0.25, 'white');
          gradient.addColorStop(0.4, this.colour);          
          gradient.addColorStop(0.7, 'black');

          this.ctx.globalAlpha = 0.3;
          this.ctx.fillStyle = gradient;
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);          
          
          this.ctx.strokeStyle = "white";
          this.ctx.lineWidth = .5 / BLOCK_SIZE;          
          this.ctx.strokeRect(this.x + x, this.y + y, 1, 1);

          this.ctx.strokeStyle = "black";
          this.ctx.globalAlpha = 1.0;
          this.ctx.lineWidth = 1 / BLOCK_SIZE;
        }
      });
    });
  }

  move(p) {
    if (!this.hardDropped) {
      this.x = p.x;
      this.y = p.y;
    }
    this.shape = p.shape;
  }

  hardDrop() {
    this.hardDropped = true;
  }

  rotate(p) {
    let t = JSON.parse(JSON.stringify(p));

    for (let y = 0; y < t.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [t.shape[x][y], t.shape[y][x]] = [t.shape[y][x], t.shape[x][y]];
      }
    }
    t.shape.forEach((row) => row.reverse());    
    return t;
  }

  freeze() {
    freezeSound.currentTime = 0;    
    freezeSound.play();
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          board.grid[y + this.y][x + this.x] = value;
        }
      });
    });
  }

  drop() {
    let p = moves[KEY.DOWN](board.piece);

    if (this.valid(p)) {
      this.move(p);
    } else {
      this.freeze();
      board.clearLines();
      if (this.y === 0) {
        return false;
      }
      board.setCurrentPiece();
    }
    return true;
  }

  valid(p) {
    return p.shape.every((row, y) => {
      return row.every(
        (value, x) =>
          value === 0 ||
          (board.isInBounds(p.x + x, p.y + y) &&
            board.isVacant(p.x + x, p.y + y))
      );
    });
  }
}
