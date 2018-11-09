import { toggleMuted, setVolume } from './Volume';
import * as log from './Logging';
import * as eventBus from './EventBus';

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
  hide(playBtn);
  disable(playBtn);
  show(pauseBtn);
  enable(pauseBtn);
  enable(stopBtn);
  eventBus.globalInstance.fire(Events.START_CLICKED);
}

function pause() {
  hide(pauseBtn);
  disable(pauseBtn);
  show(playBtn);
  enable(playBtn);
  enable(stopBtn);
  eventBus.globalInstance.fire(Events.PAUSE_CLICKED);
}

function stop() {
  resetButtons();
  eventBus.globalInstance.fire(Events.STOP_CLICKED);
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

export { Events, resetButtons };