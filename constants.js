const COLS = 10;
const ROWS = 42;
const BLOCK_SIZE = 20;
const COLOURS = [
  "darkcyan",
  "darkblue",
  "darkorange",
  "goldenrod",
  "darkolivegreen",
  "rebeccapurple",
  "darkred",
];
const SHAPES = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0],
  ],
  [
    [4, 4],
    [4, 4],
  ],
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
];
const KEY = {
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  ESC: 27,
  P: 80,
  CTRL: 17,  
};
Object.freeze(KEY);
const POINTS = {
  LINE_CLEARX1: 100,
  LINE_CLEARX2: 300,
  LINE_CLEARX3: 500,
  TETRIS: 800,
  LEVEL_UP: 420,
  SOFT_DROP: 1,
  HARD_DROP: 2,
};
Object.freeze(POINTS);
const LINES_PER_LEVEL = 10;
const LEVEL = {
  0: 650,
  1: 600,
  2: 550,
  3: 500,
  4: 450,
  5: 400,
  6: 350,
  7: 300,
  8: 250,
  9: 200,
  10: 150,
  11: 150,
  12: 150,
  13: 150,
  14: 150,
  15: 150,
  16: 100,
  17: 100,
  18: 100,
  19: 100,
  20: 30,
};
Object.freeze(LEVEL);
const NO_OF_HIGH_SCORES = 10;
const HIGH_SCORES = "highScores";
const DEFAULT_HIGH_SCORES = [
  { score: 69420, name: "MEMELORD" },
  { score: 50000, name: "SWEATY" },
  { score: 40000, name: "TRYHARD" },
  { score: 30000, name: "GAMER" },
  { score: 25000, name: "NOTBAD" },
  { score: 20000, name: "ALRIGHT" },
  { score: 15000, name: "AVERAGE" },
  { score: 10000, name: "CASUAL" },
  { score: 5000, name: "LOSER" },
  { score: 420, name: "ZOOTED" },
];
