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

let testProgram = {
  title: "Test",
  description: `
     ¯\\_(ツ)_/¯
  `,
  mainEvent: test(),
};


let yogaBtn = document.getElementById("yogaBtn");
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
  controls.disable(testBtn);
  controls.enable(yogaBtn);
  controls.enable(meditationBtn);
}
function loadYogaProgram() {
  loadProgarm(yogaProgram);
  controls.disable(yogaBtn);
  controls.enable(testBtn);
  controls.enable(meditationBtn)
}
function loadMeditationProgram() {
  loadProgarm(meditationProgram);
  controls.disable(meditationBtn);
  controls.enable(yogaBtn);
  controls.enable(testBtn)
}

loadTestProgram();

yogaBtn.addEventListener("click", loadYogaProgram);
meditationBtn.addEventListener("click", loadMeditationProgram);
testBtn.addEventListener("click", loadTestProgram);


export { timerModule };