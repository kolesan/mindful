import { newTimer, TIMER_FINISHED } from './Timer';
import { SETTING_CHANGED_EVENT, SHOW_TIMER_NAMES_SETTING } from './Settings';
import { newInstance as newTimerDisplay } from './TimerDisplay';
import * as eventBus from './EventBus';
import * as log from './Logging';

function newInstance(mainEvent, timerComponentContainer) {
  let timer = newTimer(onTimerTick, onEventCompletion, mainEvent);
  let display = newTimerDisplay(timer, timerComponentContainer);
  let started = false;
  let paused = false;

  bindEventListeners();

  return Object.freeze({
    start,
    pause,
    stop
  });

  function start() {
    if (!started) {
      timer.start();
      display.start();
    } else {
      timer.resume();
      display.resume();
    }
    started = true;
    paused = false;
  }

  function pause() {
    if (!paused) {
      timer.pause();
      display.pause();
    }
    paused = true;
  }

  function stop() {
    if (started) {
      timer.stop();
      display.stop();
    }
    started = false;
    paused = false;
  }

  function onTimerTick() {
    display.updateCurrentTime();
  }

  function onEventCompletion(eventUpdates) {
    display.updateBars(eventUpdates);
  }

  function bindEventListeners() {
    eventBus.instance.bindListener(
      eventBus.listener(TIMER_FINISHED, ()=>{
        display.stop();
        started = false;
        paused = false;
      })
    );
    eventBus.instance.bindListener(
      eventBus.listener(SETTING_CHANGED_EVENT, ([setting])=>{
        if (setting.name == SHOW_TIMER_NAMES_SETTING) {
          display.showNames(setting.selected);
        }
        log.trace(setting);
      })
    );
  }
}

export { newInstance };