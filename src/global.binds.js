import { start as start, pause as pause, unpause as unpause, fgong as fgong, sgong as sgong } from './index.js';

document.getElementById("start").addEventListener("click", start);
document.getElementById("pause").addEventListener("click", pause);
document.getElementById("unpause").addEventListener("click", unpause);
document.getElementById("fgongBtn").addEventListener("click", fgong);
document.getElementById("sgongBtn").addEventListener("click", sgong);