/**
 * Created by bousk_ni5m4b6 on 10/06/2017.
 */

class OveralInterface {

  constructor() {
    // localStorage.removeItem("l1");
    // localStorage.removeItem("l2");
    this.print_level_button();
    this.init_game_from_url();
    const th = this;

    window.onhashchange = function () {
      th.init_game_from_url();
    }
    this.reprint();
  }

  init_game_from_url() {
    let l = this.get_level_from_url();
    if (localStorage.getItem("l" + l) === null && localStorage.getItem("l" + (l - 1)) === null) {
      document.getElementById("train_desk").remove();
      l = 0;
    }
    if (this.prev_game != null) {
      this.prev_game.destroy();
    }
    console.log("create new game");
    this.prev_game = new Game(l, this.reprint.bind(this), this.restart.bind(this));
  }

  get_level_from_url() {
    return parseInt(new URL(document.URL).hash.substr(1));
  }

  restart() {
    this.print_level_button();
    this.print_best_score();
    this.init_game_from_url();

  }

  reprint() {
    this.print_level_button();
    this.print_best_score()
  }

  print_level_button() {
    let maps_menu = document.getElementById("maps_menu");
    maps_menu.innerHTML = "";
    let prev = true;
    const th = this;
    for (const key in levels) {
      if (localStorage.getItem("l" + key) !== null || prev) {
        const btn = document.createElement("BUTTON");
        const t = document.createTextNode(levels[key].name);
        btn.appendChild(t);
        btn.addEventListener("click", function () {
          window.location.hash = "#" + key;
          th.init_game_from_url()
        });
        maps_menu.appendChild(btn);
      } else {
      }
      if (localStorage.getItem("l" + key) === null) {
        prev = false;
      }
    }
  }

  print_best_score() {
    let maps_menu = document.getElementById("best_score");
    maps_menu.innerHTML = "";

    const level = this.get_level_from_url();

    let scores = localStorage.getItem("ls" + level);
    if (scores == null) {
      scores = []
    } else {
      scores = JSON.parse(scores);
    }
    console.log(scores);
    scores = scores.map(num => parseInt(num)).sort(function(a,b){return b - a});

    for (let i = 0; i < scores.length; i++) {
      const t = document.createElement("div");
      t.textContent = scores[i];
      maps_menu.appendChild(t);

    }

  }
}


new OveralInterface();