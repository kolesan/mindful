import * as log from './Logging';
import './TimerDisplay.css';
import { create } from './TimerBar';

const TIMER_BAR_CLICKED_EVENT = "timerBarClicked";

function addBarComponent(level, event, container) {
  let bar = create(level, event);
  bar.attach(container);
  return bar;
}

function newInstance(timer, container){
  timer.onStart(startAnimations);
  timer.onPause(pauseAnimations);
  timer.onStop(stop);
  timer.onFinish(stop);
  timer.onSeek(seek);
  timer.onTick(updateTime);
  timer.onLevelUpdate(barUpdate);

  let bars = [];
  generateBars();

  return Object.freeze({
    showNames(show) { showTimerBarNames(show) }
  });

  function stop() {
    stopAnimations();
    generateBars();
  }
  function seek() {

  }
  function barUpdate([[updates]]) {
    log.log(updates);
    updateBars(updates);
    startAnimations()
  }

  function startAnimations() {
    bars.forEach((it) => {it.animation.play()});
  }

  function pauseAnimations() {
    bars.forEach((it) => {it.animation.pause()});
  }

  function stopAnimations() {
    bars.forEach((it) => {it.animation.cancel()});
  }

  function generateBars() {
    let events = timer.currentEvents();
    clearScreen();
    bars = [];
    for(let i = 0; i < events.length; i++) {
      bars.push(addBarComponent(i, events[i], container));
    }
  }

  function clearScreen() {
    container.innerHTML = '';
  }

  function updateBars(eventUpdates) {
    eventUpdates.forEach(function(it) {
      if (it.sign == "-") {
        bars.pop().detach();
      }
    });
    eventUpdates.forEach(function(it) {
      if (it.sign == "+") {
        bars.push(addBarComponent(it.level, it.elem.event, container));
      }
    });
  }

  function updateTime() {
    let events = timer.currentEvents();
    for(let i = 0; i < events.length; i++) {
      bars[i].setTime(timer.currentTime - events[i].startTime);
    }
  }

  function showTimerBarNames(show) {
    let barNameComponents = Array.from(container.querySelectorAll(".timer_bar__name"));
    if (show) {
      barNameComponents.forEach(it => it.style.display = "")
    } else {
      barNameComponents.forEach(it => it.style.display = "none")
    }
  }
}

export { newInstance, TIMER_BAR_CLICKED_EVENT };