import { timerModule } from './index';
import { toggleMuted, setVolume } from './Volume';
import * as log from './Logging';
import * as constants from './Constants';
import * as eventBus from './EventBus';
import { FINISH_EVENT_TYPE } from './Timer';

let playBtn = document.getElementById("playBtn");
let pauseBtn = document.getElementById("pauseBtn");
let stopBtn = document.getElementById("stopBtn");
let volumeBtn = document.getElementById("volumeBtn");
let volumeSlider = document.getElementById("volumeSlider");

let started = false;
let paused = false;

eventBus.instance.bindListener(eventBus.listener(FINISH_EVENT_TYPE, stop));

function disable(btn) {
  btn.setAttribute("disabled", true);
}

function enable(btn) {
  btn.removeAttribute("disabled");
}

function start() {
  if (!started) {
    timerModule.start();
  } else {
    timerModule.resume();
  }
  started = true;
  paused = false;
  enable(pauseBtn);
  enable(stopBtn);
  disable(playBtn)
}

function pause() {
  if (!paused) {
    timerModule.pause();
  }
  started = true;
  paused = true;
  disable(pauseBtn);
  enable(playBtn)
}

function stop() {
  if (started) {
    timerModule.stop();
  }
  started = false;
  paused = false;
  disable(pauseBtn);
  disable(stopBtn);
  enable(playBtn)
}

playBtn.addEventListener("click", start);
pauseBtn.addEventListener("click", pause);
stopBtn.addEventListener("click", stop);
volumeBtn.addEventListener("click", toggleMuted);
volumeSlider.addEventListener("input", setVolume);