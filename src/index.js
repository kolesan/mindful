import './style.css';
import slowGongFileName from '../resources/long-loud-gong.mp3';
import fastGongFileName from '../resources/short-fast-gong.mp3';
import { newTimerEvent, newTimer } from './Timer';

// let mainEvent = (function generateEvents() {
//   let l2events = [];
//
//   l2events.push(newTimerEvent(`l2_timer0`, 0, 30000, fsgong));
//   for(let i = 0; i < 50; i++) {
//     let startTime = i*70000+30000;
//
//     let l3events = [];
//     l3events.push(newTimerEvent(`l3_timer${i+1}.1`, startTime, 30000, ffgong));
//     l3events.push(newTimerEvent(`l3_timer${i+1}.2`, startTime+30000, 30000, ffgong));
//
//     l2events.push(newTimerEvent(`l2_timer${i+1}`, startTime, 70000, fgong, l3events));
//   }
//
//   return newTimerEvent(`MainTimer`, 0, 3600000, sgong, l2events);
// })();

// let mainEvent = (function generateEvents() {
//   let l2events = [];
//   l2events.push(newTimerEvent(`Prep`, 0, 30*1000, fsgong));
//
//   l2events.push(newTimerEvent(`Breathing`, 0.5*60*1000, 20*60*1000, fgong));
//   l2events.push(newTimerEvent(`Body`,      20*60*1000,  15*60*1000, fgong));
//   l2events.push(newTimerEvent(`Hearing`,   35*60*1000,  5*60*1000, fgong));
//   l2events.push(newTimerEvent(`Thoughts`,  40*60*1000,  3*60*1000, fgong));
//   l2events.push(newTimerEvent(`Ground`,    43*60*1000,  2*60*1000, fgong));
//
//   return newTimerEvent(`MainTimer`, 0, 45*60*1000, sgong, l2events);
// })();

let mainEvent = (function generateEvents() {
  let l2events = [];

  l2events.push(newTimerEvent(`l2_timer0`, 0, 2000, fsgong));

  let l3events = [];
  l3events.push(newTimerEvent(`l3_timer1.1`, 2000, 3000, ffgong));
  l3events.push(newTimerEvent(`l3_timer1.2`, 5000, 3000, ffgong));

  l2events.push(newTimerEvent(`l2_timer1`, 2000, 7000, fgong, l3events));

  return newTimerEvent(`MainTimer`, 0, 10000, sgong, l2events);
})();

function fsgong(){
  playSound(slowGongFileName, 3);
}

function sgong(){
  playSound(slowGongFileName);
}

function fgong(){
  playSound(fastGongFileName);
}

function ffgong(){
  playSound(fastGongFileName, 3);
}

let volume = 0;
toggleVolumeIcon();

function playSound(filename, rate=1) {
  let sound = new Audio(filename);
  sound.playbackRate = rate;
  sound.volume = volume;
  sound.play();
}

function toggleMute() {
  volume = toggleVolume(volume);
  toggleVolumeIcon();
}

function toggleVolume(volume) {
  return Number(!volume);
}

function toggleVolumeIcon() {
  let icon = document.querySelector(".controls__button__volume").querySelector(".fas");
  if (volume) {
    icon.classList.remove("fa-volume-mute");
    icon.classList.add("fa-volume-up");
  } else {
    icon.classList.remove("fa-volume-up");
    icon.classList.add("fa-volume-mute");
  }
}

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
  bar.style.border = "1px solid transparent";
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



export { start, pause, stop, toggleMute, toggleVolume };