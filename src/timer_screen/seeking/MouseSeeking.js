import * as Seeking from './Seeking';
import * as eventBus from '../../utils/EventBus';
import {
  MOUSE_MOVE_ON_SEEKING_INDICATOR,
  MOUSE_DOWN_ON_SEEKING_INDICATOR,
  MOUSE_UP_ON_SEEKING_INDICATOR,
  MOUSE_OUT_ON_SEEKING_INDICATOR
} from '../TimerBarSeekingIndicator';

let seeker = Seeking.inst();

let seeking = false;
let mouseOut = false;
let seekingIndicator;
let currentSeekingIndicatorLevel;

window.addEventListener("mouseup", function() {
  if (seeking && mouseOut) {
    seeking = false;
    seeker.endSeeking(seekingIndicator);
  }
});
window.addEventListener("mousemove", function(event) {
  if (seeking && mouseOut) {
    let rect = seekingIndicator.getBoundingClientRect();
    seeker.seekTimer(currentSeekingIndicatorLevel, Seeking.widthPercentage(rect.width, event.clientX - rect.left));
  }
});

function onMouseOut(level, event) {
  if (level == currentSeekingIndicatorLevel) {
    mouseOut = true;
    seekingIndicator = event.target;
  }
  if (!seeking) {
    hideSeekingIndicator(event.target);
  }
}
function onMouseMove(level, event) {
  let seekToPercent = widthPercentage(event);
  if (seeking) {
    seeker.seekTimer(currentSeekingIndicatorLevel, seekToPercent);
  } else {
    showSeekingIndicator(event.target, seekToPercent);
  }
  if (level == currentSeekingIndicatorLevel) {
    mouseOut = false;
  }
}

function onMouseDown(level, event) {
  seeking = true;
  currentSeekingIndicatorLevel = level;
  seeker.startSeeking(level, widthPercentage(event), event.target);
  hideSeekingIndicator(event.target);
}

function onMouseUp(level, event) {
  seeking = false;
  hideSeekingIndicator(event.target);
  seeker.endSeeking(event.target);
}

function hideSeekingIndicator(indicator) {
  indicator.style.backgroundSize = '0% 100%';
}

function showSeekingIndicator(indicator, width) {
  indicator.style.backgroundSize = width + '% 100%';
}

function widthPercentage(event) {
  return Seeking.widthPercentage(event.target.clientWidth, event.offsetX);
}

eventBus.globalInstance.bindListener(MOUSE_MOVE_ON_SEEKING_INDICATOR, onMouseMove);
eventBus.globalInstance.bindListener(MOUSE_DOWN_ON_SEEKING_INDICATOR, onMouseDown);
eventBus.globalInstance.bindListener(MOUSE_UP_ON_SEEKING_INDICATOR, onMouseUp);
eventBus.globalInstance.bindListener(MOUSE_OUT_ON_SEEKING_INDICATOR, onMouseOut);