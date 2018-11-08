import * as log from './Logging';
import * as eventBus from './EventBus';
import './TimerDisplay.css';
import * as utils from './Utils';
import { seekingLocked } from './TimerDisplayControls';
import { newBarComponent } from './TimerBar';

const TIMER_BAR_CLICKED_EVENT = "timerBarClicked";

function addBarComponent(level, event, container) {
  let bar = newBarComponent(level, event);
  bar.attachTo(container);
  return bar;
}

function newInstance(timer, container){
  let bars = [];
  generateBars();

  return Object.freeze({
    start() { startAnimations() },
    pause() { pauseAnimations() },
    stop() {
      stopAnimations();
      generateBars();
    },
    updateCurrentTime() { updateTime(timer.currentTime, timer.currentEvents()) },
    updateBars(updates) {
      updateBars(updates);
      startAnimations()
    },
    showNames(show) {
      let barNameComponents = Array.from(container.querySelectorAll(".timer_bar__name"));
      if (show) {
        barNameComponents.forEach(it => it.style.display = "")
      } else {
        barNameComponents.forEach(it => it.style.display = "none")
      }
    }
  });

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

  function updateTime(time, events) {
    for(let i = 0; i < events.length; i++) {
      bars[i].setTime(time - events[i].startTime);
    }
  }
}

export { newInstance, TIMER_BAR_CLICKED_EVENT };