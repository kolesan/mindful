import './style.css';
import loudGongFileName from '../resources/long-loud-gong.mp3';
import fastGongFileName from '../resources/short-fast-gong.mp3';
import {TimerEvent, Timer} from './Timer';

const EVENT_ELEM_CLASS = "event";
const EVENT_LIST_CLASS = "event-list";
const EVENT_NAME_CLASS = "event-name-span";
const EVENT_DURATION_CLASS = "event-duration-span";

// let events = [
//   Object.create(TimerEvent).init("Timer1", 3000, fgong),
//   Object.create(TimerEvent).init("Timer2", 2000, fgong),
//   Object.create(TimerEvent).init("Timer3", 1000, sgong)
// ];

let events = (function generateEvents(count) {
  let events = [];

  for(let i = 0; i < count - 1; i++) {
    events.push(Object.create(TimerEvent).init(`Timer${i+1}`, 70000, fgong));
  }
  events.push(Object.create(TimerEvent).init(`Timer${count}`, 70000, sgong));

  return events;
})(45);

events.forEach(function(elem){
  // appendEventComponent(elem.name, formatTime(elem.duration));
});

function sgong(){
  new Audio(loudGongFileName).play();
}

function fgong(){
  new Audio(fastGongFileName).play();
}

function start() {
  let durationElem = document.getElementById("duration");

  window.customTimer = Object.create(Timer);
  customTimer.init(updateCurrentTime, setPaused, removePaused, events);
  customTimer.start();

  durationElem.innerHTML = formatTime(customTimer.duration);
}

let timerElem = document.getElementById("currentTime");
function updateCurrentTime() {
  timerElem.innerHTML = formatTime(customTimer.currentTime);
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

function unpause() {
  customTimer.unpause();
}

function addEvent() {
  let name = document.getElementById("eventName").value;
  let durationString = document.getElementById("eventDuration").value;
  let duration = parseTime(durationString);

  let event = Object.create(TimerEvent).init(name, duration, fgong);
  events.push(event);

  appendEventComponent(name, durationString);
}

function appendEventComponent(name, durationString){
  let durationSpan = document.createElement("span");
  durationSpan.classList.add(EVENT_DURATION_CLASS);
  durationSpan.innerHTML = durationString;
  let nameSpan = document.createElement("span");
  nameSpan.classList.add(EVENT_NAME_CLASS);
  nameSpan.innerHTML = name;

  let eventElement = document.createElement("div");
  eventElement.classList.add(EVENT_ELEM_CLASS);
  eventElement.appendChild(durationSpan);
  eventElement.appendChild(nameSpan);

  let eventsListElement = document.querySelector(`.${EVENT_LIST_CLASS}`);
  eventsListElement.appendChild(eventElement);
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



export { addEvent, start, pause, unpause, fgong, sgong };