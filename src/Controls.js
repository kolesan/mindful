import { timerModule } from './index';
import { toggleMuted, setVolume } from './Volume';
import * as log from './Logging';
import * as constants from './Constants';
import * as eventBus from './EventBus';
import { TIMER_FINISHED } from './Timer';

let playBtn = document.getElementById("playBtn");
let pauseBtn = document.getElementById("pauseBtn");
let stopBtn = document.getElementById("stopBtn");
let volumeBtn = document.getElementById("volumeBtn");
let volumeSlider = document.getElementById("volumeSlider");

eventBus.instance.bindListener(eventBus.listener(TIMER_FINISHED, resetButtons));

function disable(btn) {
  btn.setAttribute("disabled", true);
}

function enable(btn) {
  btn.removeAttribute("disabled");
}

function start() {
  timerModule.start();
  disable(playBtn);
  enable(pauseBtn);
  enable(stopBtn);
}

function pause() {
  timerModule.pause();
  disable(pauseBtn);
  enable(playBtn);
  enable(stopBtn);
}

function stop() {
  timerModule.stop();
  resetButtons()
}

function resetButtons() {
  disable(stopBtn);
  disable(pauseBtn);
  enable(playBtn)
}

playBtn.addEventListener("click", start);
pauseBtn.addEventListener("click", pause);
stopBtn.addEventListener("click", stop);
volumeBtn.addEventListener("click", toggleMuted);
volumeSlider.addEventListener("input", setVolume);