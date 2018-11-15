import * as log from '../../utils/Logging';
import { minmax } from '../../utils/Utils';
import { seekingLocked } from '../TimerDisplayControls';
import { currentTimer } from '../../TestDataPreload';
import { TimerStates } from '../Timer';

const INDICATOR_ACTIVE_CLASS = "timer__bar__seeking_indicator_active";
function markIndicatorActive(indicator) {
  indicator.classList.add(INDICATOR_ACTIVE_CLASS);
}
function markIndicatorInactive(indicator) {
  indicator.classList.remove(INDICATOR_ACTIVE_CLASS);
}

function widthPercentage(width, x) {
  return minmax(0, 100)((x / width) * 100);
}

function ifNotLocked(fn) {
  return function(...args) {
    if (!seekingLocked) {
      fn(...args);
    }
  }
}

function inst() {
  let timerStateBeforePause;

  return Object.freeze({
    pauseTimer() {
      timerStateBeforePause = currentTimer().state;
      if (currentTimer().running) {
        currentTimer().pause();
      }
    },
    startSeeking(level, percent, indicator) {
      markIndicatorActive(indicator);
      this.pauseTimer();
      this.seekTimer(level, percent);
    },
    seekTimer(level, percent) {
      currentTimer().seek(level, percent);
    },
    endSeeking(indicator) {
      markIndicatorInactive(indicator);
      if (wasRunning()) {
        currentTimer().start();
      }
    }
  });

  function wasRunning() {
    return timerStateBeforePause == TimerStates.running;
  }
}
export { inst, widthPercentage, ifNotLocked };