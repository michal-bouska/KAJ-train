/**
 * Created by bousk_ni5m4b6 on 10/06/2017.
 */

const lose_div = document.createElement("div");
lose_div.textContent = "Prohráli jste, můžete to zkusit znovu, nebo jít do jiného levelu.";
const win_div = document.createElement("div");
win_div.textContent = "Gratulace, vyhráli jste, můžete pokračovat do dalšího levelu.";
const default_div = document.createElement("div");
default_div.textContent = "Můžete přetáhnout vlastnoručně vytvořený level na stránku, který se následně načte. Vzorový level ";
const a = document.createElement("a");
a.href =  'dadlevel.txt';
a.innerHTML = "ZDE";
default_div.appendChild(a);

const load_err = document.createElement("div");
load_err.textContent = "Požadovaný soubor se nepodařilo načíst";


const info_map = {
  "lose": lose_div,
  "win": win_div,
  0: default_div,
  "load_err": load_err
};

const info_class_map = {
  "lose": "lose",
  "win": "win",
  0: default_div,
  "load_err": "lose"
};

class OverallInterface {

  constructor() {
    this.print_level_button();
    this.init_game_from_url();
    const th = this;

    window.onhashchange = function () {
      th.init_game_from_url();
    };
    this.reprint();
    this.init_dad();
  }

  init_dad() {
    const dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('dragover', this.handleDragOver.bind(this), false);
    dropZone.addEventListener('drop', this.handleFileSelect.bind(this), false);
  }

  init_game_from_url() {
    let l = this.get_level_from_url();
    if ((localStorage.getItem("l" + l) === null && localStorage.getItem("l" + (l - 1)) === null) || levels[l] == null) {
      l = 0;
      window.location.hash = "#" + l;
    }
    this.init_level(levels[l]);
  }

  init_level(l) {
    if (this.prev_game != null) {
      this.prev_game.destroy();
    }
    this.prev_game = new Game(l, this.reprint.bind(this), this.restart.bind(this));
    this.print_level(l);
  }

  handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    const files = evt.dataTransfer.files; // FileList object


    for (let i = 0; i < files.length; i++) {

      const f = files[i];
      let reader = new FileReader();
      const th = this;

      reader.onload = (function (theFile) {
        return function (e) {
          const help = e.target.result;
          if (help != null) {
            let level;
            try {
              level = JSON.parse(help);
            }
            catch(err) {
              th.print_info("load_err");
            }
            console.log(level);
            level.level = -1;
            th.init_level(level)
          }

        };
      })(f);

      reader.readAsText(f);
    }
  }

  handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  print_level(level) {
    document.getElementById("level").innerHTML = level.name;
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
    let i = 0;
    for (const key in levels) {
      if (localStorage.getItem("l" + key) !== null || prev) {
        i++;
        const d = document.createElement("div");
        const btn = document.createElement("BUTTON");
        btn.className = "button";
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
    let foot = document.getElementsByTagName("footer")[0];
    foot.innerHTML = "";
    if (code !== 0) {
      foot.className = info_class_map[code];
    } else {
      foot.className = "";
    }
    const d = info_map[code];
    foot.appendChild(d);
  }
}


// Setup the dnd listeners.


new OverallInterface();