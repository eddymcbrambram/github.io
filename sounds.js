class Sound {
  constructor(parent) {
    this.parent = parent;
    this.sounds = [];
    this.muted = true;
  }

  create(src, id, volume = 1, loop = false) {
    let audio = document.createElement("audio");
    audio.src = src;
    audio.id = id;
    audio.muted = false;
    audio.volume = volume;

    this.sounds.push(audio);
    this.parent.append(audio);

    if (loop) {
      audio.setAttribute("loop", "");
    }

    return audio;
  }
}

Sound.prototype.play = function () {
  for (let sound of this.sounds) {
    sound.play();
  }
};

Sound.prototype.pause = function () {
  for (let sound of this.sounds) {
    sound.pause();
  }
};

let sound = new Sound(document.querySelector("#sound_div"));

gameoverSound = sound.create(
  "assets/sounds/gameover.wav",
  "gameover_sound",
  0.5
);
pointsSound = sound.create("assets/sounds/points.wav", "points_sound", 0.8);
freezeSound = sound.create("assets/sounds/freeze.wav", "freeze_sound", 0.5);
highscoreSound = sound.create(
  "assets/sounds/highscore.wav",
  "highscore_sound",
  0.8
);
backgroundSound = sound.create(
  "assets/sounds/background.mp3",
  "background_sound",
  0.1,
  true
);
pauseSound = sound.create("assets/sounds/pause.wav", "pause_sound", 0.1);
