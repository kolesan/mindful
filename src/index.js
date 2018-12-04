import './style.css';

import * as Drawer from './drawer/DrawerMenu';
import './timer_screen/TimerScreen';
import './edit_screen/EditScreen';
import './Routing';

import * as eventBus from './utils/EventBus';
import * as EditScreen from './edit_screen/EditScreen';
import { screens } from './Screens';
let programs = loadProgramsFromLocalStorage();
let currentProgram = programs.find(program => program.default) || programs[0];

Drawer.init();

if (currentProgram) {
  screens.timer.show(currentProgram.id);
} else {
  screens.title.show();
}

function loadProgramsFromLocalStorage() {
  let stored = window.localStorage.getItem("programs");
  let programs = [];
  if (stored && stored.length > 0) {
    programs = JSON.parse(stored);
  }
  return programs;
}

eventBus.globalInstance.bindListener(EditScreen.NEW_PROGRAM_SAVED_EVENT,
  program => {
    programs.push(program);
    currentProgram = program;
    screens.timer.show(program.id);
  }
);

eventBus.globalInstance.bindListener(EditScreen.PROGRAM_SAVED_EVENT,
  program => {
    screens.timer.show(program.id);
  }
);

function setCurrentProgram(program) {
  currentProgram = program;
  screens.current.init(program.id);
}

export { programs, currentProgram, setCurrentProgram };