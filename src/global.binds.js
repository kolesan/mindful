import { start, pause, stop, toggleMute } from './index.js';

document.getElementById("startBtn").addEventListener("click", start);
document.getElementById("pauseBtn").addEventListener("click", pause);
document.getElementById("stopBtn").addEventListener("click", stop);
document.getElementById("volumeBtn").addEventListener("click", toggleMute);