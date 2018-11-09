import { newTimer, TIMER_FINISHED } from './Timer';
import { SETTING_CHANGED_EVENT, SHOW_TIMER_NAMES_SETTING } from './Settings';
import { newInstance as newTimerDisplay, TIMER_BAR_CLICKED_EVENT } from './TimerDisplay';
import { seekingLocked } from './TimerDisplayControls';
import * as eventBus from './EventBus';
import * as log from './Logging';
import * as utils from './Utils';
import * as Controls from './Controls';

function newInstance(program, timerComponentContainer) {
  let timer = newTimer(program);
  let display = newTimerDisplay(timer, timerComponentContainer);
  timer.onFinish(Controls.resetButtons);
  bindEventListeners();

  function seekTimer([barClickEvent]) {
    if (seekingLocked) {
      return;
    }

    console.log(barClickEvent);
    let seekingIndicator = barClickEvent.target;
    let level = seekingIndicator.dataset.level;
    log.trace(level);

    let barWidth = seekingIndicator.getBoundingClientRect().width;
    let x = barClickEvent.offsetX;
    let indicatorWidth = (x / barWidth) * 100;

    let seekToPercent = utils.minmax(0, 100)(indicatorWidth);
    if (level == 0) {
      let time = Math.floor(timer.duration * seekToPercent / 100);
      log.trace({time});
      display.pause();
      timer.seek(time);
      display.seek();
    } else {

    }
    let events = timer.currentEvents();
  }

  function bindEventListeners() {
    eventBus.globalInstance.bindListener(
      eventBus.listener(Controls.Events.START_CLICKED, () => timer.start())
    );
    eventBus.globalInstance.bindListener(
      eventBus.listener(Controls.Events.PAUSE_CLICKED, () => timer.pause())
    );
    eventBus.globalInstance.bindListener(
      eventBus.listener(Controls.Events.STOP_CLICKED, () => timer.stop())
    );
    eventBus.globalInstance.bindListener(
      eventBus.listener(TIMER_BAR_CLICKED_EVENT, seekTimer)
    );
    eventBus.globalInstance.bindListener(
      eventBus.listener(SETTING_CHANGED_EVENT, ([setting])=>{
        if (setting.name == SHOW_TIMER_NAMES_SETTING) {
          display.showNames(setting.selected);
        }
      })
    );
  }
}

export { newInstance };