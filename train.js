//settings


//tapes
const empty = "blank";
const TRAIN = "train";
const fruit = "fruit";
const wall = "wall";
const DOOR_OPEN = "door_open";
const DOOR_CLOSE = "door_close";

const up = 0;
const right = 1;
const down = 2;
const left = 3;

const interval = 200;
const increment = 1;


class Game {


//
// //game letiables
//   let length = 0;
//   let height = 0;
//   let width = 0;
//   let fruits = 4;
//   let fruits_eaten = 0;
//
//   let tail = [];
//
//   let fruit_map = [];
//   let trainCol = 0;
//   let trainRow = 0;
//
//   let running = false;
//   let gameOver = false;
//   let door_open = false;

//   let direction = down; // up = 0, down = -1, left = 1, right = 2
//   let int;
//   let win = false;

  constructor() {
    this.running = false;

    window.addEventListener("keydown", function key() {
      // if key is W set direction up
      let key = event.keyCode;
      console.log(key);
      if ((key == 119 || key == 87 || key == 38))
        this.direction = up;
      //if key is S set direction down
      else if ((key == 115 || key == 83 || key == 40))
        this.direction = down;
      //if key is A set direction left
      else if ((key == 97 || key == 65 || key == 37))
        this.direction = left;
      // if key is D set direction right
      else if ((key == 100 || key == 68 || key == 39))
        this.direction = right;
      if (!running)
        this.running = true;
      else if (key == 32)
        this.running = false;

    });
    this.run()
  }


  /*
   entry point of the game
   */
  run() {
    this.init();
    int = setInterval(this.gameLoop, interval);
  }

  init() {
    let world = levels[0];

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
        // console.log('" + x + "-" + y + "');
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
    if (x != null && y != null) {
      console.log("---" + x + "-" + y + this.get(x, y));
      this.get(x, y).setAttribute("class", value);
    }
  }

  getType(x, y) {
    return this.get(x, y).getAttribute("class");
  }

  gameLoop() {
    this.draw_train();
    if (this.running && !this.gameOver) {
      this.update();
      this.updateTail();
      this.draw_train();
    } else if (this.gameOver) {
      clearInterval(int);
    }
  }

  update() {
    if (this.direction == up)
      this.trainRow--;
    else if (this.direction == down)
      this.trainRow++;
    else if (this.direction == left)
      this.trainCol--;
    else if (this.direction == right)
      this.trainCol++;

    for (let i = 0; i < this.tail.length; i++) {
      let it = tail[i];
      if (it.row == this.trainRow && it.col == this.trainCol) {
        gameOver = true;
      }
    }

    if (this.fruit_map[trainRow][trainCol] >= 1) {
      console.log("eat fruit");
      this.fruits_eaten++;
      let last = tail[tail.length - 1];
      this.tail.push({ row: last.row, col: last.col });
      this.fruit_map[trainRow][trainCol] = 0;
      if (this.fruits_eaten == this.fruits) {
        this.door_open = true;
        this.draw_fruits();
      }
    }

    if (this.fruit_map[trainRow][trainCol] == -2 && this.door_open) {
      this.win = true;
    }

    if (this.fruit_map[trainRow][trainCol] < 0) {
      this.gameOver = true;
    }

  }


  draw_cell(tail, type) {
    this.set(tail.col, tail.row, type);
  }

  updateTail() {
    this.tail.unshift({ col: this.trainCol, row: this.trainRow });
    this.draw_cell(this.tail.pop(), empty);

  }

  draw_train() {
    for (let i = 0; i < this.tail.length; i++) {
      console.log(this.tail[i]);
      this.draw_cell(this.tail[i], TRAIN);
    }
  }

  draw_fruits() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.fruit_map[i][j] > 0) {
          this.draw_cell({ row: i, col: j }, fruit)
        }
        if (this.fruit_map[i][j] == -1) {
          this.draw_cell({ row: i, col: j }, wall)
        }
        if (this.fruit_map[i][j] == -2 && this.door_open) {
          this.draw_cell({ row: i, col: j }, DOOR_OPEN)
        }
        if (this.fruit_map[i][j] == -2 && !this.door_open) {
          this.draw_cell({ row: i, col: j }, DOOR_CLOSE)
        }
      }
    }
  }
}

new Game();