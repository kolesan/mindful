import { newTimerEvent } from './Timer';
import * as audio from './Audio';

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

// let mainEvent = yoga();
// let mainEvent = meditation();
let mainEvent = test();

export { mainEvent };