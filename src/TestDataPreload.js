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
  id: 1,
  title: "Mindful Yoga",
  description: `
    30s prep
    70s poses x 50
    01h total
  `,
  mainEvent: yoga(),
};

let meditationProgram = {
  id: 2,
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
  id: 3,
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

let cardioProgram = {
  id: 4,
  title: "Cardio",
  description: `Simple HIIT 1min action/1min rest`,
  mainEvent: (function() {
    let builder = EventBuilder();
    builder.add(`Preparation`, s(10), audio.fsgong);
    for(let i = 0; i < 30; i++) {
      builder.add(`Action`, m(1), audio.fgong).add(`Rest`, m(1), audio.fsgong)
    }
    return builder.build(`1h HIIT`, audio.sgong);
  })()
};

let chestProgram = {
  id: 5,
  title: "AthleanX Chest",
  description: `Sore in 6`,
  mainEvent: (function() {
    return EventBuilder()
      .add(`Preparation`, s(15), audio.fsgong)
      .add(`Dumbbell press`, m(1), audio.fgong)
      .add(`Preparation`, s(3), audio.fsgong)
      .add(`Dumbbell pullover`, m(1), audio.fgong)
      .add(`Preparation`, s(3), audio.fsgong)
      .add(`Dumbbell press fast`, s(30), audio.fgong)
      .add(`Rest`, s(30), audio.fsgong)
      .add(`Dumbbell pullover`, m(1), audio.fgong)
      .add(`Preparation`, s(3), audio.fsgong)
      .add(`Dumbbell press`, m(1), audio.fgong)
      .add(`Preparation`, s(3), audio.fsgong)
      .add(`Dumbbell press fast`, s(30), audio.fgong)
      .add(`Preparation`, s(3), audio.fsgong)
      .add(`Spiderman pushups`, s(30), audio.fgong)
      .build(`Sore in 6 AthleanX Chest`, audio.sgong);
  })()
};

let testProgram = {
  id: 6,
  title: "Test",
  description: `
     ¯\\_(ツ)_/¯
  `,
  mainEvent: test(),
};


let yogaBtn = document.getElementById("yogaBtn");
let absBtn = document.getElementById("absBtn");
let meditationBtn = document.getElementById("meditationBtn");
let cardioBtn = document.getElementById("cardioBtn");
let chestBtn = document.getElementById("chestBtn");
let testBtn = document.getElementById("testBtn");

let timerModules = {
  currentModuleId: undefined,
  get current() { return this[String(this.currentModuleId)] },
  get(id) { return this[String(id)] },
  add(id, module) { this[String(id)] = module; },
  toggleCurrent(id) { this.currentModuleId = id }
};

function loadProgarm(program, btn) {
  if (timerModules.current) {
    timerModules.current.shutDown();
  }
  timerModules.toggleCurrent(program.id);
  if (timerModules.current) {
    timerModules.current.init();
  } else {
    timerModules.add(program.id, TimerModule.newInstance(program.mainEvent, document.querySelector(".timer__display")));
  }

  if (timerModules.current.paused) {
    Controls.setButtonToAfterPauseState();
  } else if (timerModules.current.stopped) {
    Controls.resetButtons();
  }

  document.querySelector("#titleText").innerHTML = program.title;
  document.querySelector("#descriptionText").innerHTML = program.description;
  deselectAllSelectOne(btn);
}

import * as eventBus from './EventBus';
import * as Controls from './Controls';
eventBus.globalInstance.bindListener(Controls.Events.START_CLICKED, () => timerModules.current.start());
eventBus.globalInstance.bindListener(Controls.Events.PAUSE_CLICKED, () => timerModules.current.pause());
eventBus.globalInstance.bindListener(Controls.Events.STOP_CLICKED, () => timerModules.current.stop());

import * as log from './Logging';
import * as utils from './Utils';
import { TimerStates } from './Timer';
import { seekingLocked } from './TimerDisplayControls';
import { MOUSE_OUT_ON_SEEKING_INDICATOR,
  MOUSE_MOVE_ON_SEEKING_INDICATOR,
  MOUSE_DOWN_ON_SEEKING_INDICATOR,
  MOUSE_UP_ON_SEEKING_INDICATOR } from './TimerBarSeekingIndicator';
let seeking = false;
let timerStateBeforeSeeking;
window.addEventListener("mouseup", e => {
  if (seeking) {
    seeking = false;
    if (timerStateBeforeSeeking == TimerStates.running) {
      timerModules.current.start();
    }
  }
});
function onMouseOut(e) {
  // console.log(e);
}
function onMouseMove(e) {
  if (seekingLocked) return;

  if (seeking) {
    seekTimer(e);
  }
}
function onMouseDown(e) {
  if (seekingLocked) return;

  timerStateBeforeSeeking = timerModules.current.state;
  if (timerModules.current.running) {
    timerModules.current.pause();
  }
  seeking = true;
  seekTimer(e);
}
function onMouseUp(e) {
  if (seekingLocked) return;

  seeking = false;
  if (timerStateBeforeSeeking == TimerStates.running) {
    timerModules.current.start();
  }
  seekTimer(e);
}
function seekTimer(e) {
  let seekingIndicator = e.target;

  let barWidth = seekingIndicator.getBoundingClientRect().width;
  let indicatorWidth = (e.offsetX / barWidth) * 100;
  let seekToPercent = utils.minmax(0, 100)(indicatorWidth);

  timerModules.current.seek(seekingIndicator.dataset.level, seekToPercent);
}
eventBus.globalInstance.bindListener(MOUSE_OUT_ON_SEEKING_INDICATOR, onMouseOut);
eventBus.globalInstance.bindListener(MOUSE_MOVE_ON_SEEKING_INDICATOR, onMouseMove);
eventBus.globalInstance.bindListener(MOUSE_DOWN_ON_SEEKING_INDICATOR, onMouseDown);
eventBus.globalInstance.bindListener(MOUSE_UP_ON_SEEKING_INDICATOR, onMouseUp);

function loadYogaProgram() {
  loadProgarm(yogaProgram, yogaBtn);
}
function loadAbsProgram() {
  loadProgarm(absAthleanXProgram, absBtn);
}
function loadMeditationProgram() {
  loadProgarm(meditationProgram, meditationBtn);
}
function loadCardioProgram() {
  loadProgarm(cardioProgram, cardioBtn);
}
function loadChestProgram() {
  loadProgarm(chestProgram, chestBtn);
}
function loadTestProgram() {
  loadProgarm(testProgram, testBtn);
}
const ITEM_SELECTED_CLASS = "drawer_menu__item_selected";
function selectItem(item) {
  item.classList.add(ITEM_SELECTED_CLASS);
}
function deselectItem(item) {
  item.classList.remove(ITEM_SELECTED_CLASS);
}
function deselectAllItems() {
  [yogaBtn, absBtn, meditationBtn, cardioBtn, chestBtn, testBtn].forEach(deselectItem);
}
function deselectAllSelectOne(item) {
  deselectAllItems();
  selectItem(item);
}

loadTestProgram();
yogaBtn.addEventListener("click", loadYogaProgram);
absBtn.addEventListener("click", loadAbsProgram);
meditationBtn.addEventListener("click", loadMeditationProgram);
cardioBtn.addEventListener("click", loadCardioProgram);
chestBtn.addEventListener("click", loadChestProgram);
testBtn.addEventListener("click", loadTestProgram);


export { timerModules };