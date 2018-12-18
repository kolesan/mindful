import './style.css';

import './custom_elements/CustomElementsRegistry';

import * as Drawer from './drawer/DrawerMenu';
import * as eventBus from './utils/EventBus';
import * as EditScreen from './edit_screen/EditScreen';
import * as Routing from "./Routing";
import { loadPrograms } from "./Storage";
import { loadTestProgramsToStorage } from "./dev/DevTools";
import { log } from "./utils/Logging";

const EXAMPLES_WERE_LOADED_KEY = "examplesWereLoaded";

loadExamplePrograms();

function loadExamplePrograms() {
  let examplesWereAlreadyLoaded = window.localStorage.getItem(EXAMPLES_WERE_LOADED_KEY);
  if (examplesWereAlreadyLoaded) {
    return;
  }
  loadTestProgramsToStorage();
  window.localStorage.setItem(EXAMPLES_WERE_LOADED_KEY, "true");
}


Drawer.init(loadPrograms());

eventBus.globalInstance.bindListener(EditScreen.NEW_PROGRAM_SAVED_EVENT,
  program => {
    Routing.toTimerScreen(program);
  }
);

eventBus.globalInstance.bindListener(EditScreen.PROGRAM_SAVED_EVENT,
  program => {
    Drawer.init(loadPrograms());
    Routing.toTimerScreen(program, true);
  }
);