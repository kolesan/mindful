import * as Seeking from './Seeking';
import * as eventBus from '../EventBus';
import {
  TOUCH_START_ON_SEEKING_INDICATOR,
  TOUCH_MOVE_ON_SEEKING_INDICATOR,
  TOUCH_END_ON_SEEKING_INDICATOR
} from '../TimerBarSeekingIndicator';

let seeker = Seeking.inst();

function onTouchStart(level, event) {
  seeker.startSeeking(level, widthPercentage(event), event.target);
}
function onTouchMove(level, event) {
  seeker.seekTimer(level, widthPercentage(event));
}
function onTouchEnd(level, event) {
  seeker.endSeeking(event.target);
}

function widthPercentage(event) {
  let cmpRect = event.target.getBoundingClientRect();
  return Seeking.widthPercentage(cmpRect.width, event.touches[0].clientX - cmpRect.left);
}

eventBus.globalInstance.bindListener(TOUCH_START_ON_SEEKING_INDICATOR, Seeking.ifNotLocked(onTouchStart));
eventBus.globalInstance.bindListener(TOUCH_MOVE_ON_SEEKING_INDICATOR, Seeking.ifNotLocked(onTouchMove));
eventBus.globalInstance.bindListener(TOUCH_END_ON_SEEKING_INDICATOR, Seeking.ifNotLocked(onTouchEnd));