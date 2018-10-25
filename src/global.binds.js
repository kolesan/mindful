import { start, pause, stop } from './index.js';
import { toggleMuted, setVolume } from './Volume';

document.getElementById("startBtn").addEventListener("click", start);
document.getElementById("pauseBtn").addEventListener("click", pause);
document.getElementById("stopBtn").addEventListener("click", stop);
document.getElementById("volumeBtn").addEventListener("click", toggleMuted);
document.getElementById("volumeSlider").addEventListener("input", setVolume);