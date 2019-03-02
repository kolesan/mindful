import './style.css';
import './favicon.ico';

import './custom_elements/CustomElementsRegistry';
import './utils/PrototypeExtensions';

import { log } from "./utils/Logging";
import * as Drawer from './drawer/DrawerMenu';
import * as eventBus from './utils/EventBus';
import * as EditScreen from './edit_screen/EditScreen';
import * as Routing from "./Routing";
import { loadSettings } from "./storage/local_storage/LocalStorage";
import programsStorage from "./storage/programs_storage/ProgramsStorage";
import { loadTestProgramsToStorage } from "./dev/DevTools";
import { setVolumeSlider } from "./timer_screen/volume/VolumeControls";

const EXAMPLES_WERE_LOADED_KEY = "examplesWereLoaded";

loadExamplePrograms();
setSettingsFromStorage();

function loadExamplePrograms() {
  let examplesWereAlreadyLoaded = window.localStorage.getItem(EXAMPLES_WERE_LOADED_KEY);
  if (examplesWereAlreadyLoaded) {
    return;
  }
  loadTestProgramsToStorage();
  window.localStorage.setItem(EXAMPLES_WERE_LOADED_KEY, "true");
}

function setSettingsFromStorage() {
  let settingsFromStorage = loadSettings();
  let settings = Object.assign({}, defaultSettings(), settingsFromStorage);
  setVolumeSlider(settings.volume);
}

function defaultSettings() {
  return {
    volume: 25
  };
}


Drawer.init(programsStorage.loadAll());

eventBus.globalInstance.bindListener(EditScreen.NEW_PROGRAM_SAVED_EVENT,
  id => {
    Routing.toTimerScreen(programsStorage.load(id).value);
  }
);

eventBus.globalInstance.bindListener(EditScreen.PROGRAM_SAVED_EVENT,
  id => {
    Drawer.init(programsStorage.loadAll());
    Routing.toTimerScreen(programsStorage.load(id).value, true);
  }
);