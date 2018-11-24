import * as audio from '../Audio';
import { newTimerEvent } from '../timer_screen/Timer';

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



let yogaProgram = {
  title: "Yoga",
  icon: "fas fa-dumbbell",
  description: `
    30s prep
    70s poses x 50
    01h total
  `,
  mainEvent: function yoga() {
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
  }()
};

let meditationProgram = {
  title: "Meditation",
  icon: "fas fa-brain",
  description: `
    20m Breathing
    15m Body
    05m Hearing
    03m Thoughts
    02m Ground
    01m Chill
  `,
  mainEvent: function meditation() {
    let l2events = [];
    l2events.push(newTimerEvent(`Prep`, 0, 30*1000, audio.fsgong));

    l2events.push(newTimerEvent(`Breathing`, 0.5*60*1000, 20*60*1000, audio.fgong));
    l2events.push(newTimerEvent(`Body`,      20*60*1000,  15*60*1000, audio.fgong));
    l2events.push(newTimerEvent(`Hearing`,   35*60*1000,  5*60*1000, audio.fgong));
    l2events.push(newTimerEvent(`Thoughts`,  40*60*1000,  3*60*1000, audio.fgong));
    l2events.push(newTimerEvent(`Ground`,    43*60*1000,  2*60*1000, audio.fgong));

    return newTimerEvent(`MainTimer`, 0, 46*60*1000, audio.sgong, l2events);
  }()
};

let absAthleanXProgram = {
  title: "Abs",
  icon: "fas fa-table",
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

let cardioProgram = {
  title: "Cardio",
  icon: "fas fa-heartbeat",
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
  title: "Chest",
  icon: "fas fa-user",
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
  default: true,
  title: "Test",
  icon: "fas fa-text-height",
  description: `
     ¯\\_(ツ)_/¯
  `,
  mainEvent: function test() {
    let l2events = [];

    l2events.push(newTimerEvent(`l2_timer0`, 0, 2000, audio.fsgong));

    let l3events = [];
    l3events.push(newTimerEvent(`l3_timer1.1`, 2000, 3000, audio.ffgong));
    l3events.push(newTimerEvent(`l3_timer1.2`, 5000, 3000, audio.ffgong));

    l2events.push(newTimerEvent(`l2_timer1`, 2000, 7000, audio.fgong, l3events));

    return newTimerEvent(`MainTimer`, 0, 10000, audio.sgong, l2events);
  }()
};

let programs = [yogaProgram, meditationProgram, absAthleanXProgram, cardioProgram, chestProgram, testProgram];
export { programs };