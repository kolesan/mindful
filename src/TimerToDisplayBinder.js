import { newTimer } from './Timer';
import { newInstance as newTimerDisplay } from './TimerDisplay';

function start(timer, display) {
  timer.start();
  display.start();
}

function pause(timer, display) {
  timer.pause();
  display.pause();
}

function resume(timer, display) {
  timer.resume();
  display.resume();
}

function stop(timer, display) {
  timer.stop();
  display.stop();
}

function newInstance(mainEvent, timerComponentContainer) {
  let timer = newTimer(onTimerTick, onEventCompletion, mainEvent);
  let display = newTimerDisplay(timer, timerComponentContainer);

  return Object.freeze({
    start: function(){start(timer, display)},
    pause: function(){pause(timer, display)},
    resume: function(){resume(timer, display)},
    stop: function(){stop(timer, display)}
  });

  function onTimerTick() {
    display.updateCurrentTime();
  }

  function onEventCompletion(eventUpdates) {
    display.updateBars(eventUpdates);
  }
}

export { newInstance };