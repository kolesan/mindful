import { log } from "../../utils/Logging";

import storage from '../Storage';

const SETTINGS_KEY = "settings";

export default Object.assign(Object.create(storage), {
  put(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
  },
  get(name) {
    return JSON.parse(localStorage.getItem(name));
  },
  remove(name) {
    localStorage.removeItem(name);
  }
});



function loadSettings() {
  return JSON.parse(localStorage.getItem(SETTINGS_KEY));
}

function saveSettings(settings) {
  let oldSettings = loadSettings();
  let combinedSettings = Object.assign({}, oldSettings, settings);
  log("Saving settings", combinedSettings);
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(combinedSettings))
}



export { loadSettings, saveSettings };