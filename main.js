const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const canvasNext = document.getElementById("next");
const ctxNext = canvasNext.getContext("2d");
const canvasHold = document.getElementById("hold");
const ctxHold = canvasHold.getContext("2d");


let board = null;
let requestId = null;
let time = null;
let playerInfo = {
  score: 0,
  lines: 0,
  level: 0,
};
let player = new Proxy(playerInfo, {
  set: (target, key, value) => {
    target[key] = value;
    updatePlayer(key, value);
    return true;
  },
});

const moves = {
  [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
  [KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
  [KEY.UP]: (p) => board.piece.rotate(p),
  [KEY.SPACE]: (p) => ({ ...p, y: p.y + 1 }),
  [KEY.A]: (p) => ({ ...p, x: p.x - 1 }),
  [KEY.D]: (p) => ({ ...p, x: p.x + 1 }),
  [KEY.S]: (p) => ({ ...p, y: p.y + 1 }),
  [KEY.W]: (p) => board.piece.rotate(p),
};

initialiseBoards();
resetHighScore();
showHighScores();
newEventListener();

function initialiseBoards() {
  ctx.canvas.width = COLS * BLOCK_SIZE;
  ctx.canvas.height = ROWS * BLOCK_SIZE;
  ctxNext.canvas.width = 4 * BLOCK_SIZE;
  ctxNext.canvas.height = 3 * BLOCK_SIZE;
  ctxHold.canvas.width = 4 * BLOCK_SIZE;
  ctxHold.canvas.height = 3 * BLOCK_SIZE;
  ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
  ctxHold.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function updatePlayer(key, value) {
  let element = document.getElementById(key);
  if (element) {
    element.textContent = value;
  }
}

function draw() {  
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  

  board.draw();
  board.piece.draw();
  board.setGhost();      
}

function animate(now = 0) {
  time.elapsed = now - time.start;

  if (time.elapsed > time.level) {
    time.start = now;

    if (!board.piece.drop()) {      
      gameOver();
      return;
    }
  }

  draw();
  requestId = requestAnimationFrame(animate);
}

function reset() {
  player.score = 0;
  player.lines = 0;
  player.level = 0;
  board = new Board(ctx, ctxNext, ctxHold);
  time = { start: 0, elapsed: 0, level: LEVEL[0] };
}

function play() {
  backgroundSound.play();
  pauseSound.currentTime = 0;
  pauseSound.play();
  newEventListener();  
  if (document.querySelector("#play_button").style.display === "") {
    reset();
  }

  if (requestId) {
    cancelAnimationFrame(requestId);
  }

  time.start = performance.now();
  document.querySelector("#play_button").style.display = "none";
  document.querySelector("#pause_button").style.display = "block";
  animate();
}

function pause() {
  backgroundSound.pause();
  pauseSound.currentTime = 0;
  pauseSound.play();
  if (document.querySelector("#play_button").style.display === "") {
    reset();    
  }
  if (!requestId) {
    document.querySelector("#play_button").style.display = "none";
    document.querySelector("#pause_button").style.display = "block";
    backgroundSound.play();
    pauseSound.play();
    animate();
    return;
  }  

  cancelAnimationFrame(requestId);
  requestId = null;
  
  ctx.fillStyle = "black";
  ctx.fillRect(0, 3, 10, 2);
  ctx.font = "2px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("PAUSED", 1, 4.7);

  document.querySelector("#play_button").style.display = "block";
  document.querySelector("#pause_button").style.display = "none";
}

function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || [];
  const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

  if (score > lowestScore) {
    highscoreSound.play();
    saveHighScore(score, highScores);
    showHighScores();
  }
}

function saveHighScore(score, highScores) {  
  const name = prompt("NEW HIGHSCORE! Enter name:").toUpperCase();
  const newScore = { score, name };

  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);

  localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
}

function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || [];
  const highScoreList = document.getElementById(HIGH_SCORES);

  highScoreList.innerHTML = highScores
    .map((score) => `<li>${score.score}: ${score.name}`)
    .join("");
}

function resetHighScore() {
  const resetTo = DEFAULT_HIGH_SCORES;
  highScores = resetTo;
  localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
}

function gameOver() {
  backgroundSound.pause();
  gameoverSound.currentTime = 0;  
  gameoverSound.play();
  cancelAnimationFrame(requestId);
  requestId = null;  

  ctx.fillStyle = "black";
  ctx.fillRect(0, 3, 10, 2);   
  ctx.font = "1.5px Arial";  
  ctx.fillStyle = "red";
  ctx.fillText("GAME OVER", 0.4, 4.5);  

  checkHighScore(player.score);
  document.querySelector("#play_button").style.display = "";
  document.querySelector("#pause_button").style.display = "none";
}

function newEventListener() {
  document.removeEventListener("keydown", handleKeyDown);
  document.addEventListener("keydown", handleKeyDown);
}

function handleKeyDown(keydown) {
  if (keydown.keyCode === KEY.P) {
    pause();
  }
  if (keydown.keyCode === KEY.CTRL) {
    board.setHoldPiece();
  }
  if (keydown.keyCode === KEY.ESC) {    
    gameOver();
  } else if (moves[keydown.keyCode]) {
    keydown.preventDefault();
    let p = moves[keydown.keyCode](board.piece);    

    if (keydown.keyCode === KEY.SPACE) {
      while (board.piece.valid(p)) {
        board.piece.move(p);        
        player.score += POINTS.HARD_DROP;
        p = moves[KEY.DOWN](board.piece);
      }
      board.piece.hardDrop();      
    } else if (board.piece.valid(p)) {
      board.piece.move(p);            
      if (keydown.keyCode === KEY.DOWN) {
        player.score += POINTS.SOFT_DROP;
      }
    }
  }
  return false;
}
