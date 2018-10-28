import { newEventStack } from "./Stack";
import { instance as eventBus } from './EventBus';
import * as log from './Logging';

const TIMER_FINISHED = "TIMER_FINISHED";

let TimerEvent = {
  init: function initTimerEvent(name, startTime, duration, callback, children=[]) {
    this.name = name;
    this.duration = duration;
    this.startTime = startTime;
    this.endTime = startTime + duration;
    this.callback = callback;
    this.children = children;

    return this;
  }
};
function newTimerEvent(name, startTime, duration, callback, childEvents) {
  return Object.create(TimerEvent).init(name, startTime, duration, callback, childEvents);
}

let Timer = {
  init: function initTimer(onTick, onEventCompletion, mainEvent) {
    this.onTick = onTick;
    this.onEventCompletion = onEventCompletion;
    this.mainEvent = mainEvent;
    this.duration = mainEvent.duration;

    this.currentTime = 0;
    this.eventStack = newEventStack(mainEvent);

    return this;
  },
  start: function startTimer() {
    this.startTime = Date.now();
    this.launch();
  },
  launch: function launchTimer() {
    this.intervalId = setInterval(this.tick.bind(this), 1000);
  },
  tick: function tickTimer() {
    this.currentTime += 1000;
    this.onTick(this.currentTime);

    if (this.currentTime >= this.eventStack.head().event.endTime) {
      this.eventStack.head().event.callback();

      let stackBefore = this.eventStack.snapshot();
      this.eventStack.next();
      let stackAfter = this.eventStack.snapshot();

      this.onEventCompletion(calculateStackDiff(stackBefore, stackAfter));

      if (this.eventStack.empty()) {
        this.stop();
        eventBus.fire(TIMER_FINISHED);
      }
    }
  },
  pause: function pauseTimer() {
    this.msLeftoversOnPause = 1000 - (Date.now() - this.startTime) % 1000;
    clearInterval(this.intervalId);
    // log.trace({msLeftoversOnPause: this.msLeftoversOnPause, currentTime: this.currentTime});
  },
  resume: function resumeTimer() {
    setTimeout(() => {
      this.tick();
      this.launch();
    }, this.msLeftoversOnPause);
  },
  stop: function stopTimer() {
    clearInterval(this.intervalId);
    this.currentTime = 0;
    this.eventStack = newEventStack(this.mainEvent);
  },
  currentEvents: function getCurrentEvents() {
    return this.eventStack.snapshot().map((it) => { return it.event });
  }
};
function newTimer(onTick, onEventCompletion, mainEvent) {
  return Object.create(Timer).init(onTick, onEventCompletion, mainEvent);
}

function calculateStackDiff(before, after) {
  let diff = [];
  after.forEach(function(afterElem, i) {
    let beforeElem = before[i];
    if (!beforeElem) {
      diff.push(diffElem("+", afterElem, i));
    } else if (afterElem.id != beforeElem.id) {
      diff.push(diffElem("-", beforeElem, i));
      diff.push(diffElem("+", afterElem, i));
    }
  });
  if (before.length > after.length) {
    for(let i = after.length; i < before.length; i++) {
      diff.push(diffElem("-", before[i], i));
    }
  }
  return diff;
}
function diffElem(sign, elem, level) {
  return {sign, elem, level};
}

export { newTimerEvent, newTimer, TIMER_FINISHED };