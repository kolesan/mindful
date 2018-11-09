import { newTimer, TIMER_FINISHED } from './Timer';
import { SETTING_CHANGED_EVENT, SHOW_TIMER_NAMES_SETTING } from './Settings';
import { newInstance as newTimerDisplay, TIMER_BAR_CLICKED_EVENT } from './TimerDisplay';
import { seekingLocked } from './TimerDisplayControls';
import * as eventBus from './EventBus';
import * as log from './Logging';
import * as utils from './Utils';

function newInstance(mainEvent, timerComponentContainer) {
  let timer = newTimer(onTimerTick, onEventCompletion, mainEvent);
  let display = newTimerDisplay(timer, timerComponentContainer);

  bindEventListeners();

  return Object.freeze({
    start,
    pause,
    stop
  });

  function start() {
    timer.start();
    display.start();
  }

  function pause() {
    timer.pause();
    display.pause();
  }

  function stop() {
    timer.stop();
    display.stop();
  }

  function onTimerTick() {
    display.updateCurrentTime();
  }

  function onEventCompletion(eventUpdates) {
    display.updateBars(eventUpdates);
  }

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
    eventBus.instance.bindListener(
      eventBus.listener(TIMER_FINISHED, display.stop)
    );
    eventBus.instance.bindListener(
      eventBus.listener(SETTING_CHANGED_EVENT, ([setting])=>{
        if (setting.name == SHOW_TIMER_NAMES_SETTING) {
          display.showNames(setting.selected);
        }
        log.trace(setting);
      })
    );
    eventBus.instance.bindListener(
      eventBus.listener(TIMER_BAR_CLICKED_EVENT, seekTimer)
    );
  }
}

export { newInstance };