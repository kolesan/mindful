import { timerModule } from './index';
import { toggleMuted, setVolume } from './Volume';
import * as log from './Logging';

function start() {
  log.trace(timerModule);
  timerModule.start();
}

function pause() {
  timerModule.pause();
}

function stop() {
  timerModule.stop();
}

document.getElementById("startBtn").addEventListener("click", start);
document.getElementById("pauseBtn").addEventListener("click", pause);
document.getElementById("stopBtn").addEventListener("click", stop);
document.getElementById("volumeBtn").addEventListener("click", toggleMuted);
document.getElementById("volumeSlider").addEventListener("input", setVolume);