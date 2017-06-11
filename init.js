let edge = false;
let sound_suff = "mp3";

if (/Edge\/\d./i.test(navigator.userAgent)) {
  edge = true;
}

if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
  sound_suff = "wav"
}