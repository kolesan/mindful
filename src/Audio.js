import slowGongFileName from '../resources/long-loud-gong.mp3';
import fastGongFileName from '../resources/short-fast-gong.mp3';
import { getVolume, isMuted } from './Volume';
import * as log from './Logging';

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
  sound.volume = isMuted() ? 0 : getVolume() / 100;
  sound.play();
}

(function preloadAudio() {
  new Audio(slowGongFileName);
  new Audio(fastGongFileName);
})();


export { sgong, fsgong, fgong, ffgong };