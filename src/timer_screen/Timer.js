import { newEventStack } from "../utils/Stack";
import { instantiate as createEventBus } from '../utils/EventBus';
import * as log from '../utils/Logging';

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
  Events: Object.freeze({
    START: "TIMER_STARTED",
    PAUSE: "TIMER_PAUSED",
    STOP: "TIMER_STOPPED",
    FINISH: "TIMER_FINISHED",
    TICK: "TIMER_TICK",
    LEVEL_UPDATE: "TIMER_LEVEL_UPDATE",
    SEEK: "TIMER_SEEK_UPDATE",
  }),

  get running() { return this.state == States.running},
  get paused() { return this.state == States.paused},
  get stopped() { return this.state == States.stopped},
  markRunning() { this.state = States.running },
  markPaused() { this.state = States.paused },
  markStopped() { this.state = States.stopped },

  on(event, fn) { this.timerEventBus.bindListener(event, fn) },
  onStart(fn) { this.on(this.Events.START, fn) },
  onPause(fn) { this.on(this.Events.PAUSE, fn) },
  onStop(fn) { this.on(this.Events.STOP, fn) },
  onFinish(fn) { this.on(this.Events.FINISH, fn) },
  onTick(fn) { this.on(this.Events.TICK, fn) },
  onLevelUpdate(fn) { this.on(this.Events.LEVEL_UPDATE, fn) },
  onSeek(fn) { this.on(this.Events.SEEK, fn) },

  fire(event, ...args) { this.timerEventBus.fire(event, ...args) },

  init: function initTimer(program) {
    this.mainEvent = program;
    this.currentTime = 0;
    this.eventStack = newEventStack(program);
    this.timerEventBus = createEventBus();
    this.markStopped();
    return this;
  },

  start: function startTimer() {
    if (this.running) return;

    if (this.stopped) {
      this.startTime = Date.now();
      this.launch();
    } else if (this.paused) {
      this.startTime += Date.now() - this.pauseTime;
      this.msLeftoverOnPauseTimeoutId = setTimeout(() => {
        this.tick();
        if (!this.stopped) {
          this.launch();
        }
      }, this.msLeftoversOnPause);
    }
    this.markRunning();
    this.fire(this.Events.START);
  },
  launch: function launchTimer() {
    this.intervalId = setInterval(this.tick.bind(this), 1000);
  },
  tick: function tickTimer() {
    this.currentTime += 1000;
    this.fire(this.Events.TICK, this.currentTime);

    if (this.currentTime >= this.eventStack.head().event.endTime) {
      this.eventStack.head().event.callback();

      let stackBefore = this.eventStack.snapshot();
      this.eventStack.next();
      let stackAfter = this.eventStack.snapshot();

      this.fire(this.Events.LEVEL_UPDATE, calculateStackDiff(stackBefore, stackAfter));

      if (this.eventStack.empty()) {
        this.stop();
        this.fire(this.Events.FINISH);
      }
    }
  },
  seek: function seekTimer(time) {
    if (this.running) {
      clearTimeout(this.msLeftoverOnPauseTimeoutId);
      clearInterval(this.intervalId);
    }
    let stackBeforeSeeking = this.eventStack.snapshot();
    seekEventStackByTime(this.eventStack, time, this.mainEvent);

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

    this.fire(this.Events.SEEK, time, calculateStackDiff(stackBeforeSeeking, this.eventStack.snapshot()));
  },
  pause: function pauseTimer() {
    if (!this.running) return;

    this.pauseTime = Date.now();
    this.msLeftoversOnPause = 1000 - (this.pauseTime - this.startTime) % 1000;
    clearTimeout(this.msLeftoverOnPauseTimeoutId);
    clearInterval(this.intervalId);
    this.markPaused();
    this.fire(this.Events.PAUSE);
    // log.trace({msLeftoversOnPause: this.msLeftoversOnPause, currentTime: this.currentTime});
  },
  stop: function stopTimer() {
    if (this.stopped) return;

    clearTimeout(this.msLeftoverOnPauseTimeoutId);
    clearInterval(this.intervalId);
    this.currentTime = 0;
    this.eventStack.reset();
    this.markStopped();
    this.fire(this.Events.STOP);
  },
  currentEvents: function getCurrentEvents() {
    return this.eventStack.snapshot().map((it) => { return it.event });
  },
  time: function getCurrentTime() {
    return this.currentTime;
  }
};
function newTimer(mainEvent) {
  return Object.create(Timer).init(mainEvent);
}

import * as TreeUtils from '../utils/TreeUtils';
function seekEventStackByTime(stack, time, mainEvent) {
  let matchingElements = TreeUtils.flatten(mainEvent).filter(event => event.startTime <= time && event.endTime > time);
  if (matchingElements.length == 0) {
      throw new Error(`Can not seek to '${time}', it is out of bounds`);
  }
  let closestMatch = matchingElements.reduce((a, b) => time - a.startTime > time - b.startTime ? b : a);
  stack.reset();
  stack.seek(it => it.event.id == closestMatch.id);
}

function calculateStackDiff(before, after) {
  function diffElem(sign, elem, level) {
    return {sign, elem, level};
  }

  let diff = [];
  after.forEach(function(afterElem, i) {
    let beforeElem = before[i];
    if (!beforeElem) {
      diff.push(diffElem("+", afterElem, i));
    } else if (afterElem.event.id != beforeElem.event.id) {
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

export { newTimerEvent, newTimer, States as TimerStates };