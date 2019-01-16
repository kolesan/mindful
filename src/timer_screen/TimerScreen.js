import './timer_screen.css';

import './seeking/TouchSeeking';
import './seeking/MouseSeeking';
import './TimerControls';

import * as Routing from '../Routing';
import * as TimerModule from './TimerToDisplayBinder';
import * as eventBus from '../utils/EventBus';
import * as Controls from './TimerControls';
import { replaceWithClone } from "../utils/HtmlUtils";

import { callbackDictionary } from '../EventCallbacks';
import programSerialization from './timer/ProgramSerialization';

let timerScreen = document.querySelector("#timerScreen");
let editBtn = timerScreen.querySelector("button[name=editBtn]");

let programSerializationService = programSerialization(callbackDictionary);

let timerModules = {
  currentModuleId: null,
  get current() { return this[String(this.currentModuleId)] },
  get(id) { return this[String(id)] },
  put(id, module) { this[String(id)] = module; },
  toggleCurrent(id) { this.currentModuleId = id }
};


function loadTimer(program, recreateTimer = false) {
  if (currentTimer()) {
    currentTimer().shutDown();
  }

  timerModules.toggleCurrent(program.id);

  if (!currentTimer() || recreateTimer) {
    timerModules.put(program.id, newTimerModule(program));
  } else {
    currentTimer().init();
  }

  if (currentTimer().paused) {
    Controls.setButtonsToAfterPauseState();
  } else if (currentTimer().stopped) {
    Controls.resetButtons();
  }

  document.querySelector("#titleText").innerHTML = program.title;
}

function newTimerModule(program) {
  return TimerModule.newInstance(
    programSerializationService.deserialize(program),
    document.querySelector(".timer__display")
  );
}

function currentTimer() {
  return timerModules.current;
}

eventBus.globalInstance.bindListener(Controls.Events.START_CLICKED, () => timerModules.current.start());
eventBus.globalInstance.bindListener(Controls.Events.PAUSE_CLICKED, () => timerModules.current.pause());
eventBus.globalInstance.bindListener(Controls.Events.STOP_CLICKED, () => timerModules.current.stop());

let screen = {
  title: function(program) {
    return `${program.title}`;
  },
  cmp: timerScreen,
  onShow(program, recreateTimer) {
    loadTimer(program, recreateTimer);
    cloneEditButtonAndAttachClickListener(program);
  },
  onHide() {
    currentTimer().pause();
  }
};

function cloneEditButtonAndAttachClickListener(program) {
  editBtn = replaceWithClone(editBtn);
  editBtn.addEventListener("click", event => {
    Routing.toEditScreen(program);
  });
}

export { screen, currentTimer };