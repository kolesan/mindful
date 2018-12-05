import './style.css';

import * as Drawer from './drawer/DrawerMenu';
import * as eventBus from './utils/EventBus';
import * as EditScreen from './edit_screen/EditScreen';
import * as Routing from "./Routing";

let programs = loadProgramsFromLocalStorage();

Drawer.init(programs);

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
    Routing.toTimerScreen(program);
  }
);

eventBus.globalInstance.bindListener(EditScreen.PROGRAM_SAVED_EVENT,
  program => {
    Drawer.init(loadProgramsFromLocalStorage());
    Routing.toTimerScreen(program);
  }
);

export { programs };