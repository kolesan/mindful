import * as eventBus from '../utils/EventBus';
import { TIMER_BAR_CLICKED_EVENT } from './TimerDisplay';
import * as log from '../utils/Logging';
import * as utils from '../utils/Utils';

const ICON_LOCKED = "fa-lock";
const ICON_UNLOCKED = "fa-lock-open";

let seekingLocked = false;
let lockButton = document.getElementById("lockSeekingBtn");
lockButton.addEventListener("click", toggleLocked);
let toggleLockIcon = utils.makeSetIconByStateFunction(lockButton.querySelector("i"), ICON_LOCKED, ICON_UNLOCKED);
toggleLockIcon(seekingLocked);

function toggleLocked() {
  seekingLocked = !seekingLocked;
  toggleLockIcon(seekingLocked);
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