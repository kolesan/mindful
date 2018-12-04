import './timer_screen.css';

import './TimerDisplayControls';
import './seeking/TouchSeeking';
import './seeking/MouseSeeking';

import * as Routing from '../Routing';
import * as TimerModule from './TimerToDisplayBinder';
import * as eventBus from '../utils/EventBus';
import * as Controls from './TimerControls';
import { convertEvent } from "./ProgramEventToTimerEventConverter";
import { programs, currentProgram } from '../index';

let timerScreen = document.querySelector("#timerScreen");
let editBtn = timerScreen.querySelector("button[name=editBtn]");
editBtn.addEventListener("click", event => {
  Routing.toEditScreen(currentProgram.title, currentProgram.id);
});


let timerModules = {
  currentModuleId: null,
  get current() { return this[String(this.currentModuleId)] },
  get(id) { return this[String(id)] },
  add(id, module) { this[String(id)] = module; },
  toggleCurrent(id) { this.currentModuleId = id }
};


function loadTimer(program) {
  if (currentTimer()) {
    currentTimer().shutDown();
  }
  timerModules.toggleCurrent(program.id);
  if (currentTimer()) {
    currentTimer().init();
  } else {
    let timerEvent = convertEvent(program.mainEvent);
    let timerModule = TimerModule.newInstance(timerEvent, document.querySelector(".timer__display"));
    timerModules.add(program.id, timerModule);
  }

  if (currentTimer().paused) {
    Controls.setButtonsToAfterPauseState();
  } else if (currentTimer().stopped) {
    Controls.resetButtons();
  }

  document.querySelector("#titleText").innerHTML = program.title;
  document.querySelector("#descriptionText").innerHTML = program.description;
}


function currentTimer() {
  return timerModules.current;
}

function loadTimerById(id) {
  loadTimer(
    programs.find(program => program.id == id)
  );
}

eventBus.globalInstance.bindListener(Controls.Events.START_CLICKED, () => timerModules.current.start());
eventBus.globalInstance.bindListener(Controls.Events.PAUSE_CLICKED, () => timerModules.current.pause());
eventBus.globalInstance.bindListener(Controls.Events.STOP_CLICKED, () => timerModules.current.stop());

let screen = {
  cmp: timerScreen,
  onShow(id) {
    loadTimerById(id);
  }
};

export { screen, currentTimer };