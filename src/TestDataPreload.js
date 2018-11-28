import * as TimerModule from './timer_screen/TimerToDisplayBinder';
import * as eventBus from './utils/EventBus';
import * as Controls from './timer_screen/TimerControls';
import * as TreeUtils from './utils/TreeUtils';
import { createComponent } from './utils/HtmlUtils';

eventBus.globalInstance.bindListener(Controls.Events.START_CLICKED, () => timerModules.current.start());
eventBus.globalInstance.bindListener(Controls.Events.PAUSE_CLICKED, () => timerModules.current.pause());
eventBus.globalInstance.bindListener(Controls.Events.STOP_CLICKED, () => timerModules.current.stop());

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
    timerModules.add(programWrapper.id, TimerModule.newInstance(convertEvent(program.mainEvent), document.querySelector(".timer__display")));
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

import { Tools } from "./edit_screen/EditScreen";
import { newTimerEvent } from "./timer_screen/Timer";
function convertEvent(programEvent, startTime = 0, i = 1) {
  let timerEvent = newTimerEvent(
    programEvent.name.replace("%{i}", i),
    startTime,
    programEvent.duration,
    programEvent.callback,
    convertProgramElementChildren(programEvent, startTime, i)
  );
  console.log(timerEvent);
  return timerEvent;
}

function convertProgramElementChildren(programElement, startTime, i) {
  let children = [];
  // console.log(programElement);
  programElement.children.forEach(it => {
    switch(it.element) {
      case Tools.event:
        children.push(convertEvent(it, startTime, i));
        startTime += it.duration;
        break;
      case Tools.loop:
        let childrenDurationSum = it.children.reduce((a, b) => a + b.duration, 0);
        for(let i = 0; i < it.iterations; i++) {
          children.push(...convertProgramElementChildren(it, startTime, i+1));
          startTime += childrenDurationSum;
        }
        break;
    }
  });
  return children;
}

import { callbackDictionary } from './EventCallbacks';
import * as EditScreen from './edit_screen/EditScreen';

let programWrappers = [];
loadProgramsFromLocalStorage();
function loadProgramsFromLocalStorage() {
  let stored = window.localStorage.getItem("programs");
  if (stored && stored.length > 0) {
    programWrappers = deserializePrograms(stored).map((it, i) =>{
      let wrapper = initWrapper(it);
      injectProgramId(wrapper, i);
      createAndInjectButton(wrapper);
      return wrapper;
    });
    loadDefaultProgram(programWrappers);
  }
  //Else show title screen
}

eventBus.globalInstance.bindListener(EditScreen.PROGRAM_SAVED_EVENT, appendNewProgram);
function appendNewProgram(program) {
  let wrapper = initWrapper(program);
  injectProgramId(wrapper);
  createAndInjectButton(wrapper);
  programWrappers.push(wrapper);
  loadProgarm(wrapper);
}

function deserializePrograms(serializedPrograms) {
  let programs = JSON.parse(serializedPrograms);
  programs.forEach(program => {
    TreeUtils.visit(program.mainEvent, eventNode => eventNode.callback = callbackDictionary.get(eventNode.callback));
  });
  return programs;
}
function initWrapper(program) {
  return {program};
}
function loadDefaultProgram(programWrappers) {
  let defaultProgramWrapper = programWrappers.find(it => it.program.default) || programWrappers[0];
  loadProgarm(defaultProgramWrapper);
}
function injectProgramId(programWrapper, i) {
  programWrapper.id = i;
}
function createAndInjectButton(programWrapper) {
  let drawerProgramsSection = document.querySelector("#drawerProgramsSection");
  let btn = createButtonForProgram(programWrapper);
  drawerProgramsSection.appendChild(btn);
  programWrapper.btn = btn;
}

function createButtonForProgram(programWrapper) {
  let { program } = programWrapper;
  let btn = createComponent("button", ["drawer_menu__item"]);
  btn.appendChild(createComponent("i", ["drawer_menu__item__icon", ...program.icon.split(" ")]));
  btn.appendChild(document.createTextNode(program.title));
  btn.addEventListener("click", () => loadProgarm(programWrapper));
  return btn;
}

function currentTimer() {
  return timerModules.current;
}

export { currentTimer };