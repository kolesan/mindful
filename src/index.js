import './style.css';
import { newTimerEvent, newTimer } from './Timer';
import * as audio from './Audio';
import * as log from './Logging';

// let mainEvent = (function yoga() {
//   let l2events = [];
//
//   l2events.push(newTimerEvent(`l2_timer0`, 0, 30000, audio.fsgong));
//   for(let i = 0; i < 50; i++) {
//     let startTime = i*70000+30000;
//
//     let l3events = [];
//     l3events.push(newTimerEvent(`l3_timer${i+1}.1`, startTime, 30000, audio.ffgong));
//     l3events.push(newTimerEvent(`l3_timer${i+1}.2`, startTime+30000, 30000, audio.ffgong));
//
//     l2events.push(newTimerEvent(`l2_timer${i+1}`, startTime, 70000, audio.fgong, l3events));
//   }
//
//   return newTimerEvent(`MainTimer`, 0, 3600000, audio.sgong, l2events);
// })();

// let mainEvent = (function meditation() {
//   let l2events = [];
//   l2events.push(newTimerEvent(`Prep`, 0, 30*1000, audio.fsgong));
//
//   l2events.push(newTimerEvent(`Breathing`, 0.5*60*1000, 20*60*1000, audio.fgong));
//   l2events.push(newTimerEvent(`Body`,      20*60*1000,  15*60*1000, audio.fgong));
//   l2events.push(newTimerEvent(`Hearing`,   35*60*1000,  5*60*1000, audio.fgong));
//   l2events.push(newTimerEvent(`Thoughts`,  40*60*1000,  3*60*1000, audio.fgong));
//   l2events.push(newTimerEvent(`Ground`,    43*60*1000,  2*60*1000, audio.fgong));
//
//   return newTimerEvent(`MainTimer`, 0, 46*60*1000, audio.sgong, l2events);
// })();

let mainEvent = (function test() {
  let l2events = [];

  l2events.push(newTimerEvent(`l2_timer0`, 0, 2000, audio.fsgong));

  let l3events = [];
  l3events.push(newTimerEvent(`l3_timer1.1`, 2000, 3000, audio.ffgong));
  l3events.push(newTimerEvent(`l3_timer1.2`, 5000, 3000, audio.ffgong));

  l2events.push(newTimerEvent(`l2_timer1`, 2000, 7000, audio.fgong, l3events));

  return newTimerEvent(`MainTimer`, 0, 10000, audio.sgong, l2events);
})();


let timerSection = document.querySelector(".timer");
function start() {
  window.customTimer = newTimer(updateCurrentTime, setPaused, removePaused, updateBars, mainEvent);
  customTimer.start();

  generateTimerBars(customTimer);
}

function generateTimerBars(timer) {
  let eventStack = timer.eventStack;
  for(let i = 0; i < eventStack.length(); i++) {
    addBarComponent(i, eventStack.get(i).event);
  }
}

function updateBars(stackDiff) {
  stackDiff.forEach(function eachStackDiff(it) {
    if (it.sign == "-") {
      removeBarComponent(it.level)
    }
  });
  stackDiff.forEach(function eachStackDiff(it) {
    if (it.sign == "+") {
      addBarComponent(it.level, it.elem.event);
    }
  });
}

function removeBarComponent(level) {
  let time = document.querySelector(`.timer__current_time_l${level}`);
  let bar = document.querySelector(`.timer__bar_l${level}`);
  let duration = document.querySelector(`.timer_duration_l${level}`);
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

function addBarComponent(level, event) {
  let time = createComponent("div", [`timer__current_time_l${level}`], formatTime(0));
  let bar = createComponent("div", [`timer__bar`, `timer__bar_l${level}`]);
  let duration = createComponent("div", [`timer__duration`, `timer_duration_l${level}`], formatTime(event.duration));

  timerSection.appendChild(time);
  timerSection.appendChild(bar);
  timerSection.appendChild(duration);

  bar.style.transform = "translate3d(0,0,0)";
  bar.style.willChange = "width";
  bar.animate(
    [
      { width: 0 },
      { width: "100%" }
    ],
    {
      duration: event.duration
    }
  );
}

let timerElem = document.getElementById("currentTime");
function updateCurrentTime(timer) {
  for(let i = 0; i < timer.eventStack.length(); i++) {
    updateTimerBar(i, timer.currentTime, timer.eventStack.get(i).event);
  }
}

function updateTimerBar(level, currentTime, event) {
  let timeElem = document.querySelector(`.timer__current_time_l${level}`);
  let time = currentTime - event.startTime;
  timeElem.innerHTML = formatTime(time);
}

function setPaused() {
  timerElem.innerHTML += " PAUSED";
}

function removePaused() {
  timerElem.innerHTML = timerElem.innerHTML.replace(" PAUSED", "");
}

function pause() {
  customTimer.pause();
}

function stop() {
  customTimer.unpause();
}

function formatTime(timestamp) {
  const sd = 1000;
  const md = sd*60;
  const hd = md*60;

  function div(a, b) {
    return Math.floor(a / b);
  }

  function format(num) {
    let prefix = "";
    if (num < 10) {
      prefix = "0";
    }
    return prefix + num;
  }

  let h = div(timestamp, hd);
  timestamp -= h*hd;

  let m = div(timestamp, md);
  timestamp -= m*md;

  let s = div(timestamp, sd);

  return `${format(h)}:${format(m)}:${format(s)}`;
}

function parseTime(timeString) {
  let timeArray = timeString.split(":");
  let h = Number(timeArray[0]) || 0;
  let m = Number(timeArray[1]) || 0;
  let s = Number(timeArray[2]) || 0;
  return h*1000*60*60 + m*1000*60 + s*1000;
}



export { start, pause, stop };