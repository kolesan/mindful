import * as TimerModule from './timer_screen/TimerToDisplayBinder';
import * as eventBus from './utils/EventBus';
import * as Controls from './timer_screen/TimerControls';
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
let currentProgram = null;
function loadProgram(programWrapper) {
  let { program, btn } = programWrapper;
  if (timerModules.current) {
    timerModules.current.shutDown();
  }
  timerModules.toggleCurrent(program.id);
  if (timerModules.current) {
    timerModules.current.init();
  } else {
    timerModules.add(program.id, TimerModule.newInstance(convertEvent(program.mainEvent), document.querySelector(".timer__display")));
  }

  if (timerModules.current.paused) {
    Controls.setButtonToAfterPauseState();
  } else if (timerModules.current.stopped) {
    Controls.resetButtons();
  }

  document.querySelector("#titleText").innerHTML = program.title;
  document.querySelector("#descriptionText").innerHTML = program.description;
  deselectAllSelectOne(btn);

  currentProgram = program;
}

import { ToolNames } from "./edit_screen/tools/Tools";
import { newTimerEvent } from "./timer_screen/Timer";
import { callbackDictionary } from './EventCallbacks';
function convertEvent(programEvent, startTime = 0, i = 1) {
  return newTimerEvent(
    programEvent.name.replace("{i}", i),
    startTime,
    programEvent.duration,
    callbackDictionary.get(programEvent.callback),
    convertProgramElementChildren(programEvent, startTime, i)
  );
}

function convertProgramElementChildren(programElement, startTime, i) {
  let children = [];
  programElement.children.forEach(it => {
    switch(it.element) {
      case ToolNames.event:
        children.push(convertEvent(it, startTime, i));
        startTime += it.duration;
        break;
      case ToolNames.loop:
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

import * as EditScreen from './edit_screen/EditScreen';
import * as Routing from "./Routing";

let programWrappers = [];
loadProgramsFromLocalStorage();
function loadProgramsFromLocalStorage() {
  let stored = window.localStorage.getItem("programs");
  if (stored && stored.length > 0) {
    programWrappers = JSON.parse(stored).map((it, i) =>{
      let wrapper = initWrapper(it);
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
  createAndInjectButton(wrapper);
  programWrappers.push(wrapper);
  loadProgram(wrapper);
}

function initWrapper(program) {
  return {program};
}
function loadDefaultProgram() {
  let defaultProgramWrapper = programWrappers.find(it => it.program.default) || programWrappers[0];
  loadProgram(defaultProgramWrapper);
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
  btn.addEventListener("click", () => {
    loadProgram(programWrapper);
    Routing.toTimerScreen(program.title, program.id);
  });
  return btn;
}

function currentTimer() {
  return timerModules.current;
}

function loadProgramById(id) {
  loadProgram(
    programWrappers.find(wrapper => wrapper.program.id == id)
  );
}

export { currentProgram, currentTimer, loadProgramById, loadDefaultProgram };