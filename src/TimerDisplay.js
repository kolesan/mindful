import * as log from './Logging';
import { formatTime } from './Utils';

function updateTime(time, events, container) {
  for(let i = 0; i < events.length; i++) {
    updateBarTime(i, time - events[i].startTime, container);
  }
}

function generateBars(events, container) {
  let bars = [];
  for(let i = 0; i < events.length; i++) {
    bars.push(addBarComponent(i, events[i], container));
  }
  return bars;
}

function updateBars(eventUpdates, animations, container) {
  eventUpdates.forEach(function(it) {
    if (it.sign == "-") {
      removeBarComponent(it.level, container);
      animations.pop();
    }
  });
  eventUpdates.forEach(function(it) {
    if (it.sign == "+") {
      animations.push(animateBar(addBarComponent(it.level, it.elem.event, container), it.elem.event.duration));
    }
  });
}

function removeBarComponent(level, container) {
  let time = container.querySelector(`.timer__current_time_l${level}`);
  let bar = container.querySelector(`.timer__bar_l${level}`);
  let duration = container.querySelector(`.timer_duration_l${level}`);
  removeComponent(time);
  removeComponent(bar);
  removeComponent(duration);
}

function removeComponent(node) {
  node.parentNode.removeChild(node);
}

function createComponent(tag, styles, content) {
  let elem = document.createElement(tag);
  styles.forEach(function(it) {
    elem.classList.add(it);
  });
  if (content) {
    elem.innerHTML = content;
  }
  return elem;
}

function addBarComponent(level, event, container) {
  let time = createComponent("div", [`timer__current_time_l${level}`], formatTime(0));
  let bar = createComponent("div", [`timer__bar`, `timer__bar_l${level}`]);
  let duration = createComponent("div", [`timer__duration`, `timer_duration_l${level}`], formatTime(event.duration));

  bar.style.width = 0;

  container.appendChild(time);
  container.appendChild(bar);
  container.appendChild(duration);

  return bar;
}

function updateBarTime(level, time, container) {
  let timeElem = container.querySelector(`.timer__current_time_l${level}`);
  timeElem.innerHTML = formatTime(time);
}

function animateBar(bar, duration) {
  // log.trace({bar, duration});
  bar.style.transform = "translate3d(0,0,0)";
  bar.style.willChange = "width";
  return bar.animate(
    [
      { width: 0 },
      { width: "100%" }
    ],
    { duration: duration }
  );
}

function startAnimations(bars, events) {
  // log.trace(bars);
  return bars.map(function(bar, i){
    return animateBar(bar, events[i].duration);
  });
}

function pauseAnimations(animations) {
  animations.forEach((it) => {it.pause()});
}

function resumeAnimations(animations) {
  animations.forEach((it) => {it.play()});
}

function stopAnimations(animations) {
  animations.forEach((it) => {it.cancel()});
}

function clearScreen(container) {
  container.innerHTML = '';
}

function newInstance(timer, container){
  let animations = [];
  clearScreen(container);
  let bars = generateBars(timer.currentEvents(), container);
  return Object.freeze({
    start: function () { animations = startAnimations(bars, timer.currentEvents()) },
    pause: function() { pauseAnimations(animations) },
    resume: function() { resumeAnimations(animations) },
    stop: function() {
      stopAnimations(animations);
      clearScreen(container);
      bars = generateBars(timer.currentEvents(), container);
    },
    updateCurrentTime: function() { updateTime(timer.currentTime, timer.currentEvents(), container) },
    updateBars: function(updates) { updateBars(updates, animations, container) }
  });
}

export { newInstance };