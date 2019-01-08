import { minmax } from '../../utils/Utils';
import { currentTimer } from '../TimerScreen';

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

function inst() {
  let wasRunning;

  return Object.freeze({
    pauseTimer() {
      wasRunning = currentTimer().running;
      if (wasRunning) {
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
      if (wasRunning) {
        currentTimer().start();
      }
    }
  });
}
export { inst, widthPercentage };