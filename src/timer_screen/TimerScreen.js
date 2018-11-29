import './timer_screen.css';

import './TimerDisplayControls';
import './seeking/TouchSeeking';
import './seeking/MouseSeeking';
import { loadProgramById, loadDefaultProgram } from '../TestDataPreload';
import * as Routing from "../Routing";
import * as TestDataPreload from "../TestDataPreload";

function onShow(id) {
  if (id) {
    loadProgramById(id);
  } else {
    loadDefaultProgram();
  }
}

let timerScreen = document.querySelector("#timerScreen");
let editBtn = timerScreen.querySelector("button[name=editBtn]");
editBtn.addEventListener("click", event => {
  let currentProgram = TestDataPreload.currentProgram;
  Routing.toEditScreen(currentProgram.title, currentProgram.id);
});

export { onShow };