import { log } from '../utils/Logging';
import { newTimer } from './timer/Timer';
import { SETTING_CHANGED_EVENT, SHOW_TIMER_NAMES_SETTING } from '../drawer/settings/SettingsDrawerSection';
import { newInstance as newTimerDisplay } from './TimerDisplay';
import * as eventBus from '../utils/EventBus';
import * as Controls from './TimerControls';
import eventTraversal from './timer/EventTraversal';
import iterableTimerProgram from "./timer/IterableTimerProgram";
import timeKeeper from './timer/TimeKeeper';

function newInstance(program, timerComponentContainer) {
  let timer = newTimer(timeKeeper(1000), eventTraversal(iterableTimerProgram(program)));
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
      let event = timer.currentEvents[level];
      let time = event.startTime + Math.floor(event.duration * percent / 100);
      if (percent == 100) {
        //User should not be able to seek past the event 'he is seeking on'
        time -= 1;
      }
      timer.seek(time);
    },
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