import * as log from './Logging';
import * as eventBus from './EventBus';

const SETTING_CHANGED_EVENT = "SETTING_CHANGED";
const SHOW_TIMER_NAMES_SETTING = "showTimerNames";
const READ_TIMER_NAMES_SETTING = "readTimerNames";

const ICON_SELECTED = "fa-check-square";
const ICON_NOT_SELECTED = "fa-square";

let settings = [
  setting(SHOW_TIMER_NAMES_SETTING, true, document.querySelector("#showTimerNamesBtn")),
  setting(READ_TIMER_NAMES_SETTING, false, document.querySelector("#readTimerNamesBtn"))
];
initSettings();


function setting(name, selected, item) {
  return {name, selected, item};
}
function initSettings() {
  settings.forEach(it => {
    setIcon(it);
    it.item.addEventListener("click", event => toggleSelected(it));
  });
}


function toggleSelected(setting) {
  setting.selected = !setting.selected;
  setIcon(setting);
  setting.item.blur();
  eventBus.instance.fire(SETTING_CHANGED_EVENT, setting);
  // log.trace(setting);
}
function setIcon(setting) {
  if (setting.selected) {
    selectedIcon(setting.item);
  } else {
    deselectedIcon(setting.item);
  }
}
function selectedIcon(item) {
  let icon = getIcon(item);
  icon.classList.remove(ICON_NOT_SELECTED);
  icon.classList.add(ICON_SELECTED);
}
function deselectedIcon(item) {
  let icon = getIcon(item);
  icon.classList.remove(ICON_SELECTED);
  icon.classList.add(ICON_NOT_SELECTED);
}
function getIcon(item) {
  return item.querySelector("i");
}


export { SETTING_CHANGED_EVENT, SHOW_TIMER_NAMES_SETTING };