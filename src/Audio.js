import slowGongFileName from '../resources/long-loud-gong.mp3';
import fastGongFileName from '../resources/short-fast-gong.mp3';
import Volume from './timer_screen/volume/Volume';
import * as log from './utils/Logging';

function fsgong(){
  playSound(slowGongFileName, 4);
}

function sgong(){
  playSound(slowGongFileName);
}

function fgong(){
  playSound(fastGongFileName);
}

function ffgong(){
  playSound(fastGongFileName, 4);
}

function playSound(filename, rate=1) {
  let sound = new Audio(filename);
  sound.load();
  sound.playbackRate = rate;
  sound.volume = Volume.muted ? 0 : Volume.volume / 100;
  sound.play();
}

(function preloadAudio() {
  new Audio(slowGongFileName);
  new Audio(fastGongFileName);
})();


export { sgong, fsgong, fgong, ffgong };