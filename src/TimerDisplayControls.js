import * as eventBus from './EventBus';
import { TIMER_BAR_CLICKED_EVENT } from './TimerDisplay';

const ICON_LOCKED = "fa-lock";
const ICON_UNLOCKED = "fa-lock-open";

let seekingLocked = false;
let lockButton = document.getElementById("lockSeekingBtn");
lockButton.addEventListener("click", toggleLocked);
setIcon(seekingLocked);

function toggleLocked() {
  seekingLocked = !seekingLocked;
  setIcon(seekingLocked);
  // log.trace(setting);
}
function setIcon(seekingLocked) {
  if (seekingLocked) {
    lockedIcon(lockButton);
  } else {
    unlockedIcon(lockButton);
  }
}
function lockedIcon(item) {
  let iconElem = getIconElem(item);
  iconElem.classList.remove(ICON_UNLOCKED);
  iconElem.classList.add(ICON_LOCKED);
}
function unlockedIcon(item) {
  let iconElem = getIconElem(item);
  iconElem.classList.remove(ICON_LOCKED);
  iconElem.classList.add(ICON_UNLOCKED);
}
function getIconElem(item) {
  return item.querySelector("i");
}

eventBus.instance.bindListener(eventBus.listener(TIMER_BAR_CLICKED_EVENT, seekTimer));

function seekTimer(barClickEvent) {
  if (seekingLocked) {
    return;
  }

  console.log(barClickEvent);

}

// function newInstance() {
//   return Object.freeze({
//     start,
//     pause,
//     stop
//   });
// }
//
export { seekingLocked };