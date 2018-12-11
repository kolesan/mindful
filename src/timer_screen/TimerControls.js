import './timer_controls.css';

import { toggleMuted, setVolume } from './volume/Volume';
import * as eventBus from '../utils/EventBus';

const Events = {
  START_CLICKED: "START_CLICKED",
  STOP_CLICKED: "STOP_CLICKED",
  PAUSE_CLICKED: "PASUE_CLICKED"
};

let playBtn = document.getElementById("playBtn");
let pauseBtn = document.getElementById("pauseBtn");
let stopBtn = document.getElementById("stopBtn");
let volumeBtn = document.getElementById("volumeBtn");
let volumeSlider = document.getElementById("volumeSlider");
resetButtons();

function disable(btn) {
  btn.setAttribute("disabled", true);
}

function enable(btn) {
  btn.removeAttribute("disabled");
}

function hide(btn) {
  btn.style.display = "none";
}

function show(btn) {
  btn.style.display = "";
}
function start() {
  setButtonsToAfterStartState();
  eventBus.globalInstance.fire(Events.START_CLICKED);
}

function pause() {
  setButtonsToAfterPauseState();
  eventBus.globalInstance.fire(Events.PAUSE_CLICKED);
}

function stop() {
  resetButtons();
  eventBus.globalInstance.fire(Events.STOP_CLICKED);
}

function setButtonsToAfterStartState() {
  hide(playBtn);
  disable(playBtn);
  show(pauseBtn);
  enable(pauseBtn);
  enable(stopBtn);
}

function setButtonsToAfterPauseState() {
  hide(pauseBtn);
  disable(pauseBtn);
  show(playBtn);
  enable(playBtn);
  enable(stopBtn);
}

function resetButtons() {
  show(playBtn);
  enable(playBtn);
  hide(pauseBtn);
  disable(pauseBtn);
  disable(stopBtn);
}

playBtn.addEventListener("click", start);
pauseBtn.addEventListener("click", pause);
stopBtn.addEventListener("click", stop);
volumeBtn.addEventListener("click", toggleMuted);
volumeSlider.addEventListener("input", setVolume);

export { Events, setButtonsToAfterStartState, setButtonsToAfterPauseState, resetButtons };