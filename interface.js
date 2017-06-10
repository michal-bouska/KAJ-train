/**
 * Created by bousk_ni5m4b6 on 10/06/2017.
 */

const lose_div = document.createElement("div");
lose_div.textContent = "Prohráli jste, můžete to zkusit znovu, nebo jít do jiného levelu.";
const win_div = document.createElement("div");
win_div.textContent = "Gratulace, vyhráli jste, můžete pokračovat do dalšího levelu.";


const info_map = {"lose": lose_div,
    "win": win_div};

class OveralInterface {

  constructor() {
    // localStorage.removeItem("l1");
    // localStorage.removeItem("l2");
    this.print_level_button();
    this.init_game_from_url();
    const th = this;

    window.onhashchange = function () {
      th.init_game_from_url();
    };
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
    this.init_game_from_url();
    this.reprint();
  }

  reprint(code = 0) {
    this.print_level_button();
    this.print_best_score();
    this.print_info(code);
  }

  print_level_button() {
    let maps_menu = document.getElementById("maps_menu");
    maps_menu.innerHTML = "";
    let prev = true;
    const th = this;
    for (const key in levels) {
      if (localStorage.getItem("l" + key) !== null || prev) {
        const d = document.createElement("div");
        const btn = document.createElement("BUTTON");
        const t = document.createTextNode(levels[key].name);
        btn.appendChild(t);
        btn.addEventListener("click", function () {
          window.location.hash = "#" + key;
          th.init_game_from_url()
        });
        d.appendChild(btn);
        maps_menu.appendChild(d);
      } else {
      }
      if (localStorage.getItem("l" + key) === null) {
        prev = false;
      }
    }
  }

  print_best_score() {
    let best_scores = document.getElementById("best_score");
    best_scores.innerHTML = "";

    const level = this.get_level_from_url();

    let scores = localStorage.getItem("ls" + level);
    if (scores == null) {
      scores = []
    } else {
      scores = JSON.parse(scores);
    }
    console.log(scores);
    scores = scores.map(num => parseInt(num)).sort(function (a, b) {
      return b - a
    });

    for (let i = 0; i < scores.length; i++) {
      const t = document.createElement("div");
      t.textContent = scores[i];
      best_scores.appendChild(t);

    }

  }

  print_info(code) {
    if (code !== 0) {
      let foot = document.getElementsByTagName("footer")[0];
      foot.innerHTML = "";
      foot.className = code;
      const d = info_map[code];
      foot.appendChild(d);
    }
  }
}


new OveralInterface();