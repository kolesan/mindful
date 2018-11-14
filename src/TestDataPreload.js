import * as TimerModule from './TimerToDisplayBinder';


import * as eventBus from './EventBus';
import * as Controls from './Controls';
eventBus.globalInstance.bindListener(Controls.Events.START_CLICKED, () => timerModules.current.start());
eventBus.globalInstance.bindListener(Controls.Events.PAUSE_CLICKED, () => timerModules.current.pause());
eventBus.globalInstance.bindListener(Controls.Events.STOP_CLICKED, () => timerModules.current.stop());

import * as log from './Logging';
import * as utils from './Utils';
import { TimerStates } from './Timer';
import { seekingLocked } from './TimerDisplayControls';
import {
  TOUCH_START_ON_SEEKING_INDICATOR,
  TOUCH_MOVE_ON_SEEKING_INDICATOR,
  TOUCH_END_ON_SEEKING_INDICATOR,
  MOUSE_MOVE_ON_SEEKING_INDICATOR,
  MOUSE_DOWN_ON_SEEKING_INDICATOR,
  MOUSE_UP_ON_SEEKING_INDICATOR,
  MOUSE_OUT_ON_SEEKING_INDICATOR
} from './TimerBarSeekingIndicator';
let seeking = false;
let mouseOut = false;
let timerStateBeforeSeeking;
window.addEventListener("mouseup", ifNotLocked(function() {
  if (seeking && mouseOut) {
    seeking = false;
    if (timerStateBeforeSeeking == TimerStates.running) {
      timerModules.current.start();
    }
  }
}));
let seekingIndicator;
let currentSeekingIndicatorLevel;
window.addEventListener("mousemove", ifNotLocked(function(event) {
  if (seeking && mouseOut) {
    let rect = seekingIndicator.getBoundingClientRect();
    seekTimer(currentSeekingIndicatorLevel, utils.minmax(0, 100)(((event.clientX - rect.left) / rect.width) * 100));
  }
}));
function onMouseOut(level, target) {
  if (level == currentSeekingIndicatorLevel) {
    mouseOut = true;
    seekingIndicator = target;
  }
}
function onMouseMove(level, seekToPercent) {
  if (seeking) {
    seekTimer(currentSeekingIndicatorLevel, seekToPercent);
  }
  if (level == currentSeekingIndicatorLevel) {
    mouseOut = false;
  }
}
function onMouseDown(level, seekToPercent) {
  timerStateBeforeSeeking = timerModules.current.state;
  if (timerModules.current.running) {
    timerModules.current.pause();
  }
  seeking = true;
  currentSeekingIndicatorLevel = level;
  seekTimer(level, seekToPercent);
}
function onMouseUp() {
  seeking = false;
  if (timerStateBeforeSeeking == TimerStates.running) {
    timerModules.current.start();
  }
}
function onTouchStart(level, seekToPercent) {
  timerStateBeforeSeeking = timerModules.current.state;
  if (timerModules.current.running) {
    timerModules.current.pause();
  }
  seekTimer(level, seekToPercent);
}
function onTouchMove(level, seekToPercent) {
  seekTimer(level, seekToPercent);
}
function onTouchEnd() {
  if (timerStateBeforeSeeking == TimerStates.running) {
    timerModules.current.start();
  }
}
function seekTimer(level, seekToPercent) {
  timerModules.current.seek(level, seekToPercent);
}
function ifNotLocked(fn) {
  return function(...args) {
    if (!seekingLocked) {
      fn(...args);
    }
  }
}
eventBus.globalInstance.bindListener(TOUCH_START_ON_SEEKING_INDICATOR, ifNotLocked(onTouchStart));
eventBus.globalInstance.bindListener(TOUCH_MOVE_ON_SEEKING_INDICATOR, ifNotLocked(onTouchMove));
eventBus.globalInstance.bindListener(TOUCH_END_ON_SEEKING_INDICATOR, ifNotLocked(onTouchEnd));
eventBus.globalInstance.bindListener(MOUSE_MOVE_ON_SEEKING_INDICATOR, ifNotLocked(onMouseMove));
eventBus.globalInstance.bindListener(MOUSE_DOWN_ON_SEEKING_INDICATOR, ifNotLocked(onMouseDown));
eventBus.globalInstance.bindListener(MOUSE_UP_ON_SEEKING_INDICATOR, ifNotLocked(onMouseUp));
eventBus.globalInstance.bindListener(MOUSE_OUT_ON_SEEKING_INDICATOR, ifNotLocked(onMouseOut));



const ITEM_SELECTED_CLASS = "drawer_menu__item_selected";
function selectItem(item) {
  item.classList.add(ITEM_SELECTED_CLASS);
}
function deselectItem(item) {
  item.classList.remove(ITEM_SELECTED_CLASS);
}
function deselectAllItems() {
  let items = document.querySelectorAll("#drawerProgramsSection > .drawer_menu__item");
  items.forEach(deselectItem);
}
function deselectAllSelectOne(item) {
  deselectAllItems();
  selectItem(item);
}

import * as TreeUtils from './TreeUtils';
let timerModules = {
  currentModuleId: undefined,
  get current() { return this[String(this.currentModuleId)] },
  get(id) { return this[String(id)] },
  add(id, module) { this[String(id)] = module; },
  toggleCurrent(id) { this.currentModuleId = id }
};
function loadProgarm(programWrapper) {
  let { program, btn } = programWrapper;
  if (timerModules.current) {
    timerModules.current.shutDown();
  }
  timerModules.toggleCurrent(programWrapper.id);
  if (timerModules.current) {
    timerModules.current.init();
  } else {
    timerModules.add(programWrapper.id, TimerModule.newInstance(program.mainEvent, document.querySelector(".timer__display")));
  }

  if (timerModules.current.paused) {
    Controls.setButtonToAfterPauseState();
  } else if (timerModules.current.stopped) {
    Controls.resetButtons();
  }

  document.querySelector("#titleText").innerHTML = program.title;
  document.querySelector("#descriptionText").innerHTML = program.description;
  deselectAllSelectOne(btn);
}

let programWrappers = [];
loadProgramsFromLocalStorage();
function loadProgramsFromLocalStorage() {
  let stored = window.localStorage.getItem("programs");
  if (stored && stored.length > 0) {
    programWrappers = deserializePrograms(stored).map(it => {return {program: it}});
    injectProgramIds(programWrappers);
    createAndInjectButtons(programWrappers);
    loadDefaultProgram(programWrappers);
  }
  //Show title screen
}
import { callbackDictionary } from './EventCallbacks';
function deserializePrograms(serializedPrograms) {
  let programs = JSON.parse(serializedPrograms);
  programs.forEach(program => {
    TreeUtils.visit(program.mainEvent, eventNode => eventNode.callback = callbackDictionary.get(eventNode.callback));
  });
  return programs;
}
function loadDefaultProgram(programWrappers) {
  let defaultProgramWrapper = programWrappers.find(it => it.program.default) || programWrappers[0];
  loadProgarm(defaultProgramWrapper);
}
function injectProgramIds(programWrappers) {
  programWrappers.forEach((it, i) => it.id = i);
}
function createAndInjectButtons(programWrappers) {
  let drawerProgramsSection = document.querySelector("#drawerProgramsSection");
  programWrappers.forEach(it => {
    let btn = createButtonForProgram(it);
    drawerProgramsSection.appendChild(btn);
    it.btn = btn;
  });
}

function createButtonForProgram(programWrapper) {
  let { program } = programWrapper;
  let btn = utils.createComponent("button", ["drawer_menu__item"]);
  btn.appendChild(utils.createComponent("i", ["drawer_menu__item__icon", ...program.icon.split(" ")]));
  btn.appendChild(document.createTextNode(program.title));
  btn.addEventListener("click", () => loadProgarm(programWrapper));
  return btn;
}

export { timerModules };