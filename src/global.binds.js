import { addEvent, start, pause, stop } from './index.js';

document.getElementById("startBtn").addEventListener("click", start);
document.getElementById("pauseBtn").addEventListener("click", pause);
document.getElementById("stopBtn").addEventListener("click", stop);