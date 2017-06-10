//settings


//tapes
const empty = "blank";
const TRAIN = "train";
const fruit = "fruit";
const wall = "wall";
const DOOR_OPEN = "door_open";
const DOOR_CLOSE = "door_close";

const COLORS = {
  wall: "#008000",
  blank: "#000000",
  train: "#FFFFFF",
  fruit: "#FF0000",
  door_close: "#FF0000",
  door_open: "#9ACD32"
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

    this.createMap();
    this.createSnake();
    this.draw_fruits();
    this.draw_train();
  }

  /**
   * Generates the map for the snake
   */

  createMap() {

    document.write("<table>");
    for (let y = 0; y < this.height; y++) {
      document.write("<tr>");
      for (let x = 0; x < this.width; x++) {
        document.write("<td class='blank' id='" + x + "-" + y + "' ></td>");

      }
      document.write("</tr>");
    }
    document.write("</table>");
  }

  createSnake() {
    this.set(this.trainCol, this.trainRow, "snake");
  }

  get(x, y) {
    return document.getElementById(x + "-" + y);
  }

  set(x, y, value) {
    if (x !== null && y !== null) {
      this.get(x, y).setAttribute("class", value);
      this.canvas.fillStyle = COLORS[value];
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
      console.log("eat fruit");
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

  draw_cell(tail, type) {
    this.set(tail.col, tail.row, type);
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
          this.draw_cell({ row: i, col: j }, fruit)
        }
        if (this.fruit_map[i][j] === -1) {
          this.draw_cell({ row: i, col: j }, wall)
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