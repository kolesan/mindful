import { newEventStack } from "./Stack";

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
  init: function initTimer(onTick, onPause, onUnpause, onStackUpdate, mainEvent) {
    this.onTick = onTick;
    this.onPause = onPause;
    this.onUnpause = onUnpause;
    this.onStackUpdate = onStackUpdate;

    this.currentTime = 0;
    this.duration = mainEvent.duration;

    this.eventStack = newEventStack(mainEvent);

    this.initiated = true;

    return this;
  },
  start: function startTimer() {
    if (!this.initiated) {
      throw new Error("Timer has to be initiated prior to starting it");
    }
    this.launch();
  },
  launch: function launchTimer() {
    this.intervalId = setInterval(this.tick.bind(this), 1000);
  },
  tick: function tickTimer() {
    this.currentTime += 1000;
    this.onTick(this);

    if (this.currentTime >= this.eventStack.head().event.endTime) {
      this.eventStack.head().event.callback();

      let stackBefore = this.eventStack.snapshot();
      this.eventStack.next();
      let stackAfter = this.eventStack.snapshot();

      if (this.eventStack.empty()) {
        clearInterval(this.intervalId);
      }

      this.onStackUpdate(calculateStackDiff(stackBefore, stackAfter));
    }
  },
  pause: function pauseTimer() {
    this.onPause();
    clearInterval(this.intervalId);
  },
  unpause: function unpauseTimer() {
    this.onUnpause();
    this.launch();
  },
  finished: function isTimerFinished() {
    return this.stack.empty();
  }
};
function newTimer(onTick, onPause, onUnpause, onStackUpdate, mainEvent) {
  return Object.create(Timer).init(onTick, onPause, onUnpause, onStackUpdate, mainEvent);
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
  return {sign: sign, elem: elem, level: level};
}

export { newTimerEvent, newTimer };