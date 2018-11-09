import { newEventStack } from "./Stack";
import { instance as eventBus } from './EventBus';
import * as log from './Logging';

const TIMER_FINISHED = "TIMER_FINISHED";

let TimerEvent = {
  idCounter: 0,
  init: function initTimerEvent(name, startTime, duration, callback, children=[]) {
    this.id = Object.getPrototypeOf(this).idCounter++;
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

const States = {
  running: "running",
  paused: "paused",
  stopped: "stopped",
};

let Timer = {
  get running() { return this.state == States.running},
  get paused() { return this.state == States.paused},
  get stopped() { return this.state == States.stopped},
  markRunning() { this.state = States.running },
  markPaused() { this.state = States.paused },
  markStopped() { this.state = States.stopped },
  init: function initTimer(onTick, onEventCompletion, mainEvent) {
    this.onTick = onTick;
    this.onEventCompletion = onEventCompletion;
    this.mainEvent = mainEvent;
    this.duration = mainEvent.duration;

    this.currentTime = 0;
    this.eventStack = newEventStack(mainEvent);

    this.markStopped();
    return this;
  },
  start: function startTimer() {
    if (this.stopped) {
      this.startTime = Date.now();
      this.launch();
    } else if (this.paused) {
      this.startTime += Date.now() - this.pauseTime;
      this.msLeftoverOnPauseTimeoutId = setTimeout(() => {
        this.tick();
        this.launch();
      }, this.msLeftoversOnPause);
    }
    this.markRunning();
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
  seek: function seekTimer(time) {
    if (this.running) {
      clearTimeout(this.msLeftoverOnPauseTimeoutId);
      clearInterval(this.intervalId);
    }
    seekEventStackByTime(this.eventStack, time);
    //Relaunch timer
    let msLeftovers = time % 1000;
    this.currentTime = time - msLeftovers;
    this.startTime = Date.now() - time;
    this.pauseTime = Date.now();
    this.msLeftoversOnPause = 1000 - msLeftovers;
    if (this.running) {
      this.msLeftoverOnPauseTimeoutId = setTimeout(() => {
        this.tick();
        this.launch();
      }, this.msLeftoversOnPause);
    } else if (this.stopped) {
      this.markPaused();
    }
  },
  pause: function pauseTimer() {
    this.markPaused();
    this.pauseTime = Date.now();
    this.msLeftoversOnPause = 1000 - (this.pauseTime - this.startTime) % 1000;
    clearTimeout(this.msLeftoverOnPauseTimeoutId);
    clearInterval(this.intervalId);
    // log.trace({msLeftoversOnPause: this.msLeftoversOnPause, currentTime: this.currentTime});
  },
  stop: function stopTimer() {
    this.markStopped();
    clearTimeout(this.msLeftoverOnPauseTimeoutId);
    clearInterval(this.intervalId);
    this.currentTime = 0;
    this.eventStack.reset();
  },
  currentEvents: function getCurrentEvents() {
    return this.eventStack.snapshot().map((it) => { return it.event });
  },
  time: function getCurrentTime() {
    return this.currentTime;
  }
};
function seekEventStackByTime(stack, time) {
  stack.reset();

  let matchingElements = [];
  while(stack.seek(it => it.event.startTime <= time && it.event.endTime > time)) {
    matchingElements.push(stack.head());
    stack.next();
  }

  if (matchingElements.length == 0) {
    throw new Error(`Can not seek to '${time}', it is out of bounds`);
  }

  let closestMatch = matchingElements.reduce((a, b) => time - a.event.startTime > time - b.event.startTime ? b : a);

  stack.reset();
  stack.seek(it => it.event.id == closestMatch.event.id);
}
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