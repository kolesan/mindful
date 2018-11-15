import { newTimer, TIMER_FINISHED } from './Timer';
import { SETTING_CHANGED_EVENT, SHOW_TIMER_NAMES_SETTING } from '../settings/Settings';
import { newInstance as newTimerDisplay } from './TimerDisplay';
import * as eventBus from '../utils/EventBus';
import * as log from '../utils/Logging';
import * as utils from '../utils/Utils';
import * as Controls from './TimerControls';

function newInstance(program, timerComponentContainer) {
  let timer = newTimer(program);
  let display = newTimerDisplay(timer, timerComponentContainer);
  timer.onFinish(Controls.resetButtons);
  bindEventListeners();

  return {
    init: display.attach,
    shutDown() {
      display.detach();
      if (this.running) {
        this.pause();
      }
    },
    start: timer.start.bind(timer),
    pause: timer.pause.bind(timer),
    stop: timer.stop.bind(timer),
    seek: (level, percent) => {
      let event = timer.currentEvents()[level];
      let time = event.startTime + Math.floor(event.duration * percent / 100);
      if (percent == 100) {
        time -= 10;
      }
      timer.seek(time);
    },
    get state() { return timer.state },
    get running() { return timer.running },
    get paused() { return timer.paused },
    get stopped() { return timer.stopped }
  };

  function bindEventListeners() {
    eventBus.globalInstance.bindListener(SETTING_CHANGED_EVENT, setting => {
        if (setting.name == SHOW_TIMER_NAMES_SETTING) {
          display.showNames(setting.selected);
        }
    });
  }
}

export { newInstance };