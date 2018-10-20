import './style.css';
import loudGongFileName from '../resources/long-loud-gong.mp3';
import fastGongFileName from '../resources/short-fast-gong.mp3';
import {TimerEvent, Timer} from './Timer';

let events = [];

function sgong(){
  new Audio(loudGongFileName).play();
}

function fgong(){
  new Audio(fastGongFileName).play();
}

function start() {
  let duration = parseTime(document.getElementById("mainTimer").value);
  let durationElem = document.getElementById("duration");
  let timerElem = document.getElementById("timerOutput");

  window.myKoLeTimer = Object.create(Timer);
  myKoLeTimer.init(timerElem, durationElem, [{duration: 1}, {duration: 2}]);
  myKoLeTimer.start();
}

function pause() {
  myKoLeTimer.pause();
}

function unpause() {
  myKoLeTimer.unpause();
}

function addEvent() {
  let name = document.getElementById("eventName").value;
  let durationString = document.getElementById("eventDuration").value;
  let duration = parseTime(durationString);
  let event = Object.create(TimerEvent).init(name, duration, fgong);
  events.push(event);

  let durationSpan = document.createElement("span");
  durationSpan.classList.add("event-duration-span");
  durationSpan.innerHTML = durationString;
  let nameSpan = document.createElement("span");
  nameSpan.classList.add("event-name-span");
  nameSpan.innerHTML = name;

  let eventElement = document.createElement("div");
  eventElement.classList.add("event");
  eventElement.appendChild(durationSpan);
  eventElement.appendChild(nameSpan);

  let eventsListElement = document.querySelector(".event-list");
  eventsListElement.appendChild(eventElement)
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