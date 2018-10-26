import { newTimer, TIMER_FINISHED } from './Timer';
import { newInstance as newTimerDisplay } from './TimerDisplay';
import * as eventBus from './EventBus';

function newInstance(mainEvent, timerComponentContainer) {
  let timer = newTimer(onTimerTick, onEventCompletion, mainEvent);
  let display = newTimerDisplay(timer, timerComponentContainer);
  let started = false;
  let paused = false;

  bindTimerFinishListener();

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

  function bindTimerFinishListener() {
    eventBus.instance.bindListener(
      eventBus.listener(TIMER_FINISHED, ()=>{
        display.stop();
        started = false;
        paused = false;
      })
    );
  }
}

export { newInstance };