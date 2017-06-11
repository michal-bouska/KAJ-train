let edge = false;
let sound_suff = "mp3";

if (/Edge\/\d./i.test(navigator.userAgent)) {
  edge = true;
}

if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
  sound_suff = "wav"
}

(function () {
  function isSupported() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch(e) {
      return false;
    }
  }

  if (!isSupported()) {
    function init(undef) {
      console.log("use local storage pol");
      let store = {
        setItem: function (id, val) {
          return store[id] = String(val);
        },
        getItem: function (id) {
          return store.hasOwnProperty(id) ? String(store[id]) : undef;
        },
        removeItem: function (id) {
          return delete store[id];
        },
        clear: function () {
          init();
        }
      };

      window.localStorage = store;
    }
    init();
  }
}());