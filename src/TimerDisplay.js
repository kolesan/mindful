import * as log from './Logging';
import './TimerDisplay.css';
import * as TimerBar from './TimerBar';

function newInstance(timer, container){
  timer.onStart(startAnimations);
  timer.onPause(pauseAnimations);
  timer.onStop(stop);
  timer.onFinish(stop);
  timer.onSeek(seek);
  timer.onTick(updateTime);
  timer.onLevelUpdate(barUpdate);

  let bars = [];
  detatchBars();
  generateBars();
  attachBars();

  return Object.freeze({
    attach() { attachBars(); },
    detach() { detatchBars(); },
    showNames(show) { showTimerBarNames(show) }
  });

  function stop() {
    stopAnimations();
    detatchBars();
    generateBars();
    attachBars();
  }
  function seek(time, updates) {
    pauseAnimations();
    updateBars(updates);
    updateTime();
    seekAnimations(time);
    if (timer.running) {
      startAnimations();
    }
  }
  function barUpdate(updates) {
    updateBars(updates);
    startAnimations()
  }

  function startAnimations() {
    bars.forEach(it => it.animation.play());
  }

  function pauseAnimations() {
    bars.forEach(it => it.animation.pause());
  }

  function stopAnimations() {
    bars.forEach(it => it.animation.cancel());
  }

  function generateBars() {
    let events = timer.currentEvents();
    bars = [];
    for(let i = 0; i < events.length; i++) {
      bars.push(createTimerBar(i, events[i]));
    }
  }

  function createTimerBar(level, event) {
    return TimerBar.create(level, event);
  }

  function attachBars() {
    bars.forEach(it => it.attach(container));
  }

  function detatchBars() {
    bars.forEach(it => it.detach());
  }

  function updateBars(eventUpdates) {
    eventUpdates.forEach(function(it) {
      if (it.sign == "-") {
        bars.pop().detach();
      }
    });
    eventUpdates.forEach(function(it) {
      if (it.sign == "+") {
        let bar = createTimerBar(it.level, it.elem.event);
        bar.attach(container);
        bars.push(bar);
      }
    });
  }

  function seekAnimations(time) {
    timer.currentEvents().forEach(function(event, i) {
      bars[i].animation.currentTime = time - event.startTime;
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

export { newInstance };