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
import { MOUSE_OUT_ON_SEEKING_INDICATOR,
  MOUSE_MOVE_ON_SEEKING_INDICATOR,
  MOUSE_DOWN_ON_SEEKING_INDICATOR,
  MOUSE_UP_ON_SEEKING_INDICATOR } from './TimerBarSeekingIndicator';
let seeking = false;
let timerStateBeforeSeeking;
window.addEventListener("mouseup", e => {
  if (seeking) {
    seeking = false;
    if (timerStateBeforeSeeking == TimerStates.running) {
      timerModules.current.start();
    }
  }
});
function onMouseOut(e) {
  // console.log(e);
}
function onMouseMove(e) {
  if (seekingLocked) return;

  if (seeking) {
    seekTimer(e);
  }
}
function onMouseDown(e) {
  if (seekingLocked) return;

  timerStateBeforeSeeking = timerModules.current.state;
  if (timerModules.current.running) {
    timerModules.current.pause();
  }
  seeking = true;
  seekTimer(e);
}
function onMouseUp(e) {
  if (seekingLocked) return;

  seeking = false;
  if (timerStateBeforeSeeking == TimerStates.running) {
    timerModules.current.start();
  }
  seekTimer(e);
}
function seekTimer(e) {
  let seekingIndicator = e.target;

  let barWidth = seekingIndicator.getBoundingClientRect().width;
  let indicatorWidth = (e.offsetX / barWidth) * 100;
  let seekToPercent = utils.minmax(0, 100)(indicatorWidth);

  timerModules.current.seek(seekingIndicator.dataset.level, seekToPercent);
}
eventBus.globalInstance.bindListener(MOUSE_OUT_ON_SEEKING_INDICATOR, onMouseOut);
eventBus.globalInstance.bindListener(MOUSE_MOVE_ON_SEEKING_INDICATOR, onMouseMove);
eventBus.globalInstance.bindListener(MOUSE_DOWN_ON_SEEKING_INDICATOR, onMouseDown);
eventBus.globalInstance.bindListener(MOUSE_UP_ON_SEEKING_INDICATOR, onMouseUp);



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
    TreeUtils.visit(program.mainEvent, eventNode => eventNode.callback = callbackDictionary[eventNode.callback]);
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