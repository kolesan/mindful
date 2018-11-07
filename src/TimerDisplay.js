import * as log from './Logging';
import { formatTime } from './Utils';
import * as eventBus from './EventBus';
import './TimerDisplay.css';
import * as utils from './Utils';
import { seekingLocked } from './TimerDisplayControls';

const TIMER_BAR_CLICKED_EVENT = "timerBarClicked";

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
  let time = createComponent("div", [`timer__current_time`, `timer__current_time_l${level}`], formatTime(0));
  let bar = createComponent("div", [`timer__bar`, `timer__bar_l${level}`]);
  let barName = createComponent("span", [`timer_bar__name`], event.name);
  let seekingIndicator = createComponent("div", [`timer__bar__seeking_indicator`]);
  let duration = createComponent("div", [`timer__duration`, `timer_duration_l${level}`], formatTime(event.duration));

  bar.style.backgroundSize = "0% 100%";
  bar.appendChild(barName);
  bar.appendChild(seekingIndicator);
  seekingIndicator.addEventListener("mousemove", showSeekingIndicator);
  seekingIndicator.addEventListener("mouseout", hideSeekingIndicator);
  seekingIndicator.addEventListener("click", event =>
    eventBus.instance.fire(TIMER_BAR_CLICKED_EVENT, event)
  );

  container.appendChild(time);
  container.appendChild(bar);
  container.appendChild(duration);

  return bar;
}

function hideSeekingIndicator(event) {
  if (seekingLocked) {
    return;
  }
  event.target.style.backgroundSize = '0% 100%';
}

function showSeekingIndicator(event) {
  if (seekingLocked) {
    return;
  }

  let seekingIndicator = event.target;
  let barWidth = event.target.getBoundingClientRect().width;
  let x = event.offsetX;
  let indicatorWidth = (x / barWidth) * 100;

  seekingIndicator.style.backgroundSize = utils.minmax(0, 100)(indicatorWidth) + '% 100%';
}

function updateBarTime(level, time, container) {
  let timeElem = container.querySelector(`.timer__current_time_l${level}`);
  timeElem.innerHTML = formatTime(time);
}

function animateBar(bar, duration) {
  // log.trace({bar, duration});
  bar.style.transform = "translate3d(0,0,0)";
  return bar.animate(
    [
      { backgroundSize: "0" },
      { backgroundSize: "100%" }
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
    start() { animations = startAnimations(bars, timer.currentEvents()) },
    pause() { pauseAnimations(animations) },
    resume() { resumeAnimations(animations) },
    stop() {
      stopAnimations(animations);
      clearScreen(container);
      bars = generateBars(timer.currentEvents(), container);
    },
    updateCurrentTime() { updateTime(timer.currentTime, timer.currentEvents(), container) },
    updateBars(updates) { updateBars(updates, animations, container) },
    showNames(show) {
      let barNameComponents = Array.from(container.querySelectorAll(".timer_bar__name"));
      if (show) {
        barNameComponents.forEach(it => it.style.display = "")
      } else {
        barNameComponents.forEach(it => it.style.display = "none")
      }
    }
  });
}

export { newInstance, TIMER_BAR_CLICKED_EVENT };