const EMPTY = "blank";
const TRAIN = "train";
const FRUIT = "fruit";
const WALL = "wall";
const DOOR_OPEN = "door_open";
const DOOR_CLOSE = "door_close";
const LOSE = "lose";
const WIN = "win";

const COLORS = {
  wall: "#008000",
  blank: "#000000",
  train: "#FFFFFF",
  fruit: "#FF0000",
  door_close: "#FF0000",
  door_open: "#9ACD32",
//  fruit color:
  0: "#FFFFFF",
  1: "#FF0000",
  2: "#1a00ff",
  3: "#fff431",
  4: "#FFFFFF"
};

const up = 0;
const right = 1;
const down = 2;
const left = 3;

const interval = 200;

let CELL_SIZE = 36;
let CELL_SPAN = 4;
let CELL_SUM_SUZE = CELL_SIZE + CELL_SPAN;

const sounds = [];
let suff = ".mp3";

// let a = document.createElement('audio');
//
// if (a.canPlayType('audio/mpeg;')) {
//   suff = "mp3"
// } else {
//   suff = "wav"
// }

sounds.push(new Audio('audio/01' + suff));
sounds.push(new Audio('audio/02' + suff));
// sounds.push(new Audio('audio/03' + suff));

const win_sound = new Audio("audio/win.wav");
const failure_sound = new Audio("audio/failure.wav");

class Game {

  constructor(level, reprint_callback, restart_callback) {
    console.log("load level: " + level);
    if (level > 0 && localStorage.getItem("l" + level) === null) {
      console.log("Level not allowed");
      document.getElementById("train_desk").innerHTML = "Nepřístupný level";
    }

    this.running = false;
    this.train_colors = [0];

    this.reprint_callback = reprint_callback;
    this.restart_callback = restart_callback;

    let world = JSON.parse(JSON.stringify(levels[level]));
    this.fruits_eaten = 0;
    this.game_over = false;

    this.fruit_map = world.fruit_map;
    this.train_col = world.start_col;
    this.train_row = world.start_row;
    this.height = world.height;
    this.width = world.width;
    this.fruits = world.fruits;
    this.password = world.password;
    this.score = 0;
    this.increment = 1;
    this.last_eat = -1;
    this.level = level;
    this.dead = false;

    this.tail = [{ col: this.train_col, row: this.train_row }];


    this.help_method();
  }

  help_method() {

      document.getElementById("train_desk").innerHTML = "<canvas width=" + this.width * CELL_SUM_SUZE + " height=" + this.height * CELL_SUM_SUZE + " id='desk'></canvas>";


      this.canvas = document.getElementById("desk").getContext("2d");

      this.event_listener = this.key_listener.bind(this);

      document.addEventListener("keydown", this.event_listener, false);

      this.draw_fruits();
      this.draw_train();

      this.int = setInterval(this.gameLoop.bind(this), interval);
  }

  key_listener() {
    if (!this.dead) {
      // if key is W set direction up
      let key = event.keyCode;
      console.log(key);
      if ((key === 119 || key === 87 || key === 38))
        this.direction = up;
      //if key is S set direction down
      else if ((key === 115 || key === 83 || key === 40))
        this.direction = down;
      //if key is A set direction left
      else if ((key === 97 || key === 65 || key === 37))
        this.direction = left;
      // if key is D set direction right
      else if ((key === 100 || key === 68 || key === 39))
        this.direction = right;
      if (key === 82)
        this.restart_callback();
      if (!this.running)
        this.running = true;
      else if (key === 32)
        this.running = false;
    }
  }


  gameLoop() {
    if (Math.random() < 0.005) {
      console.log("play audio");
      const id = Math.floor(Math.random() * sounds.length);
      sounds[id].play();
    }

    this.draw_train();
    if (this.running && !this.game_over && !this.win) {
      this.update();
      this.update_tail();
      this.draw_fruits();
      this.draw_train();
    } else if (this.game_over) {
      // this.int.clearInterval();
    }
  }

  game_over_f() {
    this.game_over = true;
    if (!this.win) {
      failure_sound.play();
      this.reprint_callback(LOSE);
    }
  }

  game_win() {
    localStorage.setItem("l" + this.level, this.password);
    let scores = localStorage.getItem("ls" + this.level);
    if (scores == null) {
      scores = []
    } else {
      scores = JSON.parse(scores);
    }
    scores.push(this.score);
    scores = Array.from(new Set(scores));
    localStorage.setItem("ls" + this.level, JSON.stringify(scores));
    this.win = true;
    win_sound.play();
    this.reprint_callback(WIN);
  }

  update() {
    const prev_col = this.train_col;
    const prev_row = this.train_row;
    this.change_move_direction();

    if (!(prev_col === this.train_col && prev_row === this.train_row)) {
      for (let i = 0; i < this.tail.length; i++) {
        let it = this.tail[i];
        if (it.row === this.train_row && it.col === this.train_col) {
          this.game_over_f()
        }
      }
    }

    if (this.fruit_map[this.train_row][this.train_col] >= 1) {
      this.eat_fruit();
    }

    if (this.fruit_map[this.train_row][this.train_col] === -2 && this.door_open) {
      this.game_win();
    }

    if (this.fruit_map[this.train_row][this.train_col] < 0) {
      this.game_over_f()
    }
  }

  change_move_direction() {
    if (this.direction === up)
      this.train_row--;
    else if (this.direction === down)
      this.train_row++;
    else if (this.direction === left)
      this.train_col--;
    else if (this.direction === right)
      this.train_col++;
  }

  eat_fruit() {
    this.fruits_eaten++;
    const fruit = this.fruit_map[this.train_row][this.train_col];
    this.set_score(fruit);
    this.train_colors.push(fruit);
    let last = this.tail[this.tail.length - 1];
    this.tail.push({ row: last.row, col: last.col });
    this.fruit_map[this.train_row][this.train_col] = 0;
    if (this.fruits_eaten === this.fruits) {
      this.door_open = true;
      this.draw_fruits();
    }
    console.log("eat: " + fruit + ", score:" + this.score);
  }

  set_score(fruit) {
    if (this.last_eat === fruit) {
      this.increment = this.increment * 2;
    } else {
      this.increment = 1;
      this.last_eat = fruit;
    }
    this.score = this.score + this.increment;
    document.getElementById("score").innerHTML = this.score;
  }

  set(x, y, value, fruit = 0) {
    // console.log("x:" + x + ", y:" + y + " " + value + " " + fruit);
    if (x !== null && y !== null) {
      this.canvas.fillStyle = COLORS[value];
      if (value === FRUIT || value === TRAIN) {
        this.canvas.fillStyle = COLORS[fruit];
      }

      var size_modifier = 0;
      if (value === FRUIT) {
        size_modifier = -4;
      }

      this.canvas.fillRect(x * (CELL_SIZE + CELL_SPAN) - size_modifier / 2, y * (CELL_SIZE + CELL_SPAN) - size_modifier / 2, CELL_SIZE + size_modifier, CELL_SIZE + size_modifier);
    }
  }


  draw_cell(tail, type, fruit = 0) {
    this.set(tail.col, tail.row, type, fruit);
  }

  update_tail() {
    this.tail.unshift({ col: this.train_col, row: this.train_row });
    this.draw_cell(this.tail.pop(), EMPTY);
  }

  draw_train() {
    for (let i = 0; i < this.tail.length; i++) {
      this.draw_cell(this.tail[i], TRAIN, this.train_colors[i]);
    }
  }

  draw_fruits() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.fruit_map[i][j] > 0) {
          this.draw_cell({ row: i, col: j }, FRUIT, this.fruit_map[i][j])
        }
        if (this.fruit_map[i][j] === -1) {
          this.draw_cell({ row: i, col: j }, WALL)
        }
        if (this.fruit_map[i][j] === -2 && this.door_open) {
          this.draw_cell({ row: i, col: j }, DOOR_OPEN)
        }
        if (this.fruit_map[i][j] === -2 && !this.door_open) {
          this.draw_cell({ row: i, col: j }, DOOR_CLOSE)
        }
      }
    }
  }

  destroy() {
    this.dead = true;
    clearInterval(this.int);
    document.removeEventListener("keydown", this.event_listener, false);
    this.game_over = true;
  }
}

