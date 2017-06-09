//settings
var interval = 200;
var increment = 1;

//game variables
var length = 0;
var height = 0;
var width = 0;
var fruits = 4;
var fruits_eaten = 0;

var tail = [];

var fruit_map = [];
var trainCol = 0;
var trainRow = 0;

var running = false;
var gameOver = false;
var door_open = false;
var up = 0;
var right = 1;
var down = 2;
var left = 3;
var direction = down; // up = 0, down = -1, left = 1, right = 2
var int;
var win = false;

//tapes
const empty = "blank";
const TRAIN = "train";
const fruit = "fruit";
const wall = "wall";
const DOOR_OPEN = "door_open";
const DOOR_CLOSE = "door_close";

window.addEventListener("keydown", function key() {
  // if key is W set direction up
  var key = event.keyCode;
  console.log(key);
  if ((key == 119 || key == 87 || key == 38))
    direction = up;
  //if key is S set direction down
  else if ((key == 115 || key == 83 || key == 40))
    direction = down;
  //if key is A set direction left
  else if ((key == 97 || key == 65 || key == 37))
    direction = left;
  // if key is D set direction right
  else if ((key == 100 || key == 68 || key == 39))
    direction = right;
  if (!running)
    running = true;
  else if (key == 32)
    running = false;

});

/*
 entry point of the game
 */
function run() {
  init();
  int = setInterval(gameLoop, interval);
}

function init() {

  var world = levels[0];

  fruit_map = world.fruit_map;
  trainCol = world.start_col;
  trainRow = world.start_row;
  height = world.height;
  width = world.width;
  fruits = world.fruits;

  tail.push({ col: trainCol, row: trainRow });

  createMap();
  createSnake();
  draw_fruits();
  draw_train();
}

/**
 * Generates the map for the snake
 */

function createMap() {
  document.write("<table>");
  for (var y = 0; y < height; y++) {
    document.write("<tr>");
    for (var x = 0; x < width; x++) {
      // console.log('" + x + "-" + y + "');
      document.write("<td class='blank' id='" + x + "-" + y + "' ></td>");
    }
    document.write("</tr>");
  }
  document.write("</table>");
}

function createSnake() {
  set(trainCol, trainRow, "snake");
}

function get(x, y) {
  return document.getElementById(x + "-" + y);
}

function set(x, y, value) {
  if (x != null && y != null)
    console.log("---" + x + "-" + y +  get(x, y) );
    get(x, y).setAttribute("class", value);
}

function getType(x, y) {
  return get(x, y).getAttribute("class");
}

function gameLoop() {
  draw_train();
  if (running && !gameOver) {
    update();
    updateTail();
    draw_train();
  } else if (gameOver) {
    clearInterval(int);
  }
}

function update() {
  if (direction == up)
    trainRow--;
  else if (direction == down)
    trainRow++;
  else if (direction == left)
    trainCol--;
  else if (direction == right)
    trainCol++;

  for (var i = 0; i < tail.length; i++) {
    var it = tail[i];
    if (it.row == trainRow && it.col == trainCol) {
      gameOver = true;
    }
  }

  if (fruit_map[trainRow][trainCol] >= 1) {
    console.log("eat fruit");
    fruits_eaten++;
    var last = tail[tail.length - 1];
    tail.push({ row: last.row, col: last.col });
    fruit_map[trainRow][trainCol] = 0;
    if (fruits_eaten == fruits) {
      door_open = true;
      draw_fruits();
    }
  }

  if (fruit_map[trainRow][trainCol] == -2 && door_open) {
    win = true;
  }

  if (fruit_map[trainRow][trainCol] < 0) {
    gameOver = true;
  }

}

function draw_cell(tail, type) {
  set(tail.col, tail.row, type);
}

function updateTail() {
  tail.unshift({ col: trainCol, row: trainRow });
  draw_cell(tail.pop(), empty);

}

function draw_train() {
  for (var i = 0; i < tail.length; i++) {
    console.log(tail[i]);
    draw_cell(tail[i], TRAIN);
  }
}

function draw_fruits() {
  for (var i = 0; i < height; i++) {
    fruit_map.push([]);
    for (var j = 0; j < width; j++) {
      if (fruit_map[i][j] > 0) {
        draw_cell({ row: i, col: j }, fruit)
      }
      if (fruit_map[i][j] == -1) {
        draw_cell({ row: i, col: j }, wall)
      }
      if (fruit_map[i][j] == -2 && door_open) {
        draw_cell({ row: i, col: j }, DOOR_OPEN)
      }
      if (fruit_map[i][j] == -2 && !door_open) {
        draw_cell({ row: i, col: j }, DOOR_CLOSE)
      }
    }
  }
}


run();