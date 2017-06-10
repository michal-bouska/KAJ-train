//settings


//tapes
const empty = "blank";
const TRAIN = "train";
const FRUIT = "fruit";
const WALL = "wall";
const DOOR_OPEN = "door_open";
const DOOR_CLOSE = "door_close";

const COLORS = {
  wall: "#008000",
  blank: "#000000",
  train: "#FFFFFF",
  fruit: "#FF0000",
  door_close: "#FF0000",
  door_open: "#9ACD32",
//  fruit color:
  1: "#FF0000",
  2: "#ff57dd",
  3: "#fff431"
};

const up = 0;
const right = 1;
const down = 2;
const left = 3;

const interval = 200;
const increment = 1;

const CELL_SIZE = 18;
const CELL_SPAN = 2;


class Game {

  constructor() {
    this.running = false;
    document.write(`<canvas width="500" height="500" id="desk"></canvas>`);

    this.canvas = document.getElementById("desk").getContext("2d");

    const th = this;

    window.addEventListener("keydown", function key() {
      // if key is W set direction up
      let key = event.keyCode;
      console.log(key);
      if ((key === 119 || key === 87 || key === 38))
        th.direction = up;
      //if key is S set direction down
      else if ((key === 115 || key === 83 || key === 40))
        th.direction = down;
      //if key is A set direction left
      else if ((key === 97 || key === 65 || key === 37))
        th.direction = left;
      // if key is D set direction right
      else if ((key === 100 || key === 68 || key === 39))
        th.direction = right;
      if (!th.running)
        th.running = true;
      else if (key === 32)
        th.running = false;

    });
    this.run()
  }


  /*
   entry point of the game
   */
  run() {
    this.init();
    setInterval(this.gameLoop.bind(this), interval);
  }

  init() {
    let world = levels[0];
    this.fruits_eaten = 0;
    this.game_over = false;

    this.fruit_map = world.fruit_map;
    this.trainCol = world.start_col;
    this.trainRow = world.start_row;
    this.height = world.height;
    this.width = world.width;
    this.fruits = world.fruits;

    this.tail = [{ col: this.trainCol, row: this.trainRow }];

    this.draw_fruits();
    this.draw_train();
  }


  set(x, y, value, fruit = 0) {
    console.log("x:" + x + ", y:" + y + " " + value + " " + fruit);
    if (x !== null && y !== null) {
      this.canvas.fillStyle = COLORS[value];
      if (value === FRUIT) {
        this.canvas.fillStyle = COLORS[fruit];
      }
      this.canvas.fillRect(x * (CELL_SIZE + CELL_SPAN), y * (CELL_SIZE + CELL_SPAN), CELL_SIZE, CELL_SIZE);
      this.canvas.stroke();
    }
  }

  gameLoop() {
    this.draw_train();
    if (this.running && !this.game_over) {
      this.update();
      this.update_tail();
      this.draw_train();
    } else if (this.game_over) {
      // clearInterval();
    }
  }

  update() {
    if (this.direction === up)
      this.trainRow--;
    else if (this.direction === down)
      this.trainRow++;
    else if (this.direction === left)
      this.trainCol--;
    else if (this.direction === right)
      this.trainCol++;

    for (let i = 0; i < this.tail.length; i++) {
      let it = this.tail[i];
      if (it.row === this.trainRow && it.col === this.trainCol) {
        this.game_over = true;
      }
    }

    if (this.fruit_map[this.trainRow][this.trainCol] >= 1) {
      console.log("eat FRUIT");
      this.fruits_eaten++;
      let last = this.tail[this.tail.length - 1];
      this.tail.push({ row: last.row, col: last.col });
      this.fruit_map[this.trainRow][this.trainCol] = 0;
      if (this.fruits_eaten === this.fruits) {
        this.door_open = true;
        this.draw_fruits();
      }
    }

    if (this.fruit_map[this.trainRow][this.trainCol] === -2 && this.door_open) {
      this.win = true;
    }

    if (this.fruit_map[this.trainRow][this.trainCol] < 0) {
      this.game_over = true;
    }
  }

  draw_cell(tail, type, fruit = 0) {
    this.set(tail.col, tail.row, type, fruit);
  }

  update_tail() {
    this.tail.unshift({ col: this.trainCol, row: this.trainRow });
    this.draw_cell(this.tail.pop(), empty);

  }

  draw_train() {
    for (let i = 0; i < this.tail.length; i++) {
      // console.log(this.tail[i]);
      this.draw_cell(this.tail[i], TRAIN);
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
}

new Game();