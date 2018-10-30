import { newTimerEvent } from './Timer';
import * as TimerModule from './TimerToDisplayBinder';
import * as audio from './Audio';
import * as controls from './Controls';

function yoga() {
  let l2events = [];

  l2events.push(newTimerEvent(`l2_timer0`, 0, 30000, audio.fsgong));
  for(let i = 0; i < 50; i++) {
    let startTime = i*70000+30000;

    let l3events = [];
    l3events.push(newTimerEvent(`l3_timer${i+1}.1`, startTime, 30000, audio.ffgong));
    l3events.push(newTimerEvent(`l3_timer${i+1}.2`, startTime+30000, 30000, audio.ffgong));

    l2events.push(newTimerEvent(`l2_timer${i+1}`, startTime, 70000, audio.fgong, l3events));
  }

  return newTimerEvent(`MainTimer`, 0, 3600000, audio.sgong, l2events);
}

function meditation() {
  let l2events = [];
  l2events.push(newTimerEvent(`Prep`, 0, 30*1000, audio.fsgong));

  l2events.push(newTimerEvent(`Breathing`, 0.5*60*1000, 20*60*1000, audio.fgong));
  l2events.push(newTimerEvent(`Body`,      20*60*1000,  15*60*1000, audio.fgong));
  l2events.push(newTimerEvent(`Hearing`,   35*60*1000,  5*60*1000, audio.fgong));
  l2events.push(newTimerEvent(`Thoughts`,  40*60*1000,  3*60*1000, audio.fgong));
  l2events.push(newTimerEvent(`Ground`,    43*60*1000,  2*60*1000, audio.fgong));

  return newTimerEvent(`MainTimer`, 0, 46*60*1000, audio.sgong, l2events);
}

function test() {
  let l2events = [];

  l2events.push(newTimerEvent(`l2_timer0`, 0, 2000, audio.fsgong));

  let l3events = [];
  l3events.push(newTimerEvent(`l3_timer1.1`, 2000, 3000, audio.ffgong));
  l3events.push(newTimerEvent(`l3_timer1.2`, 5000, 3000, audio.ffgong));

  l2events.push(newTimerEvent(`l2_timer1`, 2000, 7000, audio.fgong, l3events));

  return newTimerEvent(`MainTimer`, 0, 10000, audio.sgong, l2events);
}

let yogaProgram = {
  title: "Mindful Yoga",
  description: `
    30s prep
    70s poses x 50
    01h total
  `,
  mainEvent: yoga(),
};

let meditationProgram = {
  title: "Meditation",
  description: `
    20m Breathing
    15m Body
    05m Hearing
    03m Thoughts
    02m Ground
    01m Chill
  `,
  mainEvent: meditation(),
};

let absAthleanXProgram = {
  title: "AthleanXABS",
  // description: `
  //    60s Seated Ab Circles L
  //    3s preparation
  //    60s Seated Ab Circles R
  //    3s preparation
  //    60s Drunken Mountain Climber
  //    30s REST
  //    60s Marching Planks
  //    3s preparation
  //    60s Scissors
  //    3s preparation
  //    30s Starfish Crunch
  //    30s REST
  //    30s Russian 'V' Tuck Twist
  // `,
  description: `AthleanX ABS`,
  mainEvent: (function() {
    return EventBuilder()
      .add(`Preparation`, s(10), audio.fsgong)
      .add(`Seated Ab Circles L`, s(60), audio.fgong)
      .add(`Preparation`, s(3), audio.fsgong)
      .add(`Seated Ab Circles R`, s(60), audio.fgong)
      .add(`Preparation`, s(3), audio.fsgong)
      .add(`Drunken Mountain Climber`, s(60), audio.fgong)
      .add(`REST`, s(30), audio.fsgong)
      .add(`Marching Planks`, s(60), audio.fgong)
      .add(`Preparation`, s(3), audio.fsgong)
      .add(`Scissors`, s(60), audio.fgong)
      .add(`Preparation`, s(3), audio.fsgong)
      .add(`Starfish Crunch`, s(30), audio.fgong)
      .add(`REST`, s(30), audio.fsgong)
      .add(`Russian 'V' Tuck Twist`, s(30), audio.fsgong)
      .build(`MainTimer`, audio.sgong);
  })()
};

function s(c) {
  return c*1000;
}
function m(c) {
  return s(c)*60;
}
function h(c) {
  return m(c)*60;
}

function EventBuilder() {
  let totalTime = 0;
  let children = [];
  return Object.freeze({
    add(name, duration, callback, grandChildren) {
      children.push(newTimerEvent(name, totalTime, duration, callback, grandChildren));
      totalTime += duration;
      return this;
    },
    build(name, callback) {
      return newTimerEvent(name, 0, totalTime + 1000, callback, children);
    }
  });
}

let testProgram = {
  title: "Test",
  description: `
     ¯\\_(ツ)_/¯
  `,
  mainEvent: test(),
};


let yogaBtn = document.getElementById("yogaBtn");
let absBtn = document.getElementById("absBtn");
let meditationBtn = document.getElementById("meditationBtn");
let testBtn = document.getElementById("testBtn");

let timerModule;
function loadProgarm(program) {
  document.querySelector("#titleText").innerHTML = program.title;
  document.querySelector("#descriptionText").innerHTML = program.description;

  timerModule = TimerModule.newInstance(program.mainEvent, document.querySelector(".timer"));
}

function loadTestProgram() {
  loadProgarm(testProgram);
  disableOneEnableOthers(testBtn);
}
function loadYogaProgram() {
  loadProgarm(yogaProgram);
  disableOneEnableOthers(yogaBtn);
}
function loadAbsProgram() {
  loadProgarm(absAthleanXProgram);
  disableOneEnableOthers(absBtn);
}
function loadMeditationProgram() {
  loadProgarm(meditationProgram);
  disableOneEnableOthers(meditationBtn);
}
function disableOneEnableOthers(btn) {
  enableAllButtons();
  controls.disable(btn);
}
function enableAllButtons() {
  let buttons = Array.from(document.querySelector(".description_program_controls").children);
  buttons.forEach(it => controls.enable(it));
}

loadTestProgram();
yogaBtn.addEventListener("click", loadYogaProgram);
absBtn.addEventListener("click", loadAbsProgram);
meditationBtn.addEventListener("click", loadMeditationProgram);
testBtn.addEventListener("click", loadTestProgram);


export { timerModule };