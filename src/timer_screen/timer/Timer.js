import { log } from '../../utils/Logging';
import { instantiate as createEventBus } from '../../utils/EventBus';

let TimerEvent = {
  init: function initTimerEvent(id, name, startTime, duration, callback) {
    this.id = id;
    this.name = name;
    this.duration = duration;
    this.startTime = startTime;
    this.endTime = startTime + duration;
    this.callback = callback;

    return this;
  }
};
function newTimerEvent(id, name, startTime, duration, callback) {
  return Object.create(TimerEvent).init(id, name, startTime, duration, callback);
}

const States = {
  running: "running",
  paused: "paused",
  stopped: "stopped",
};
const Events = {
  START: "TIMER_STARTED",
  PAUSE: "TIMER_PAUSED",
  FINISH: "TIMER_FINISHED",
  TICK: "TIMER_TICK",
  LEVEL_UPDATE: "TIMER_LEVEL_UPDATE",
  SEEK: "TIMER_SEEK_UPDATE",
};

let Timer = {
  get running() { return this._state == States.running},
  get paused() { return this._state == States.paused},
  get stopped() { return this._state == States.stopped},

  onStart(fn) { on.call(this, Events.START, fn) },
  onPause(fn) { on.call(this, Events.PAUSE, fn) },
  onFinish(fn) { on.call(this, Events.FINISH, fn) },
  onTick(fn) { on.call(this, Events.TICK, fn) },
  onLevelUpdate(fn) { on.call(this, Events.LEVEL_UPDATE, fn) },
  onSeek(fn) { on.call(this, Events.SEEK, fn) },

  init: function initTimer(eventTraversal) {
    this._eventTraversal = eventTraversal;
    this._timerEventBus = createEventBus();
    this._currentTime = 0;
    this._startTime = 0;
    this._msUntilNextTick = 0;
    this._pauseTime = 0;
    this._intervalId = 0;
    this._tickAndLaunchTimeoutId = 0;
    this._state = null;
    markStopped.call(this);
    return this;
  },

  start: function startTimer() {
    if (this.running) return;

    if (this.stopped) {
      this._startTime = Date.now();
      this._msUntilNextTick = 1000;
    } else {
      this._startTime += Date.now() - this._pauseTime;
    }

    startUp.call(this);

    markRunning.call(this);
    fire.call(this, Events.START);
  },
  seek: function seekTimer(time) {
    clearCounters.call(this);
    this._eventTraversal.seek(time);
    fire.call(this, Events.SEEK, time, this._eventTraversal.diff);

    if (this._eventTraversal.finished) {
      finish.call(this);
      return;
    }

    let msLeftovers = time % 1000;
    this._currentTime = time - msLeftovers;
    this._startTime = Date.now() - time;
    this._pauseTime = Date.now();
    this._msUntilNextTick = msLeftovers === 0 && time > 0 ? 0 : 1000 - msLeftovers;

    if (this.running) {
      startUp.call(this);
    } else if (this.stopped) {
      markPaused.call(this);
    }
  },
  pause: function pauseTimer() {
    if (!this.running) return;

    this._pauseTime = Date.now();
    this._msUntilNextTick = 1000 - (this._pauseTime - this._startTime) % 1000;
    clearCounters.call(this);
    markPaused.call(this);
    fire.call(this, Events.PAUSE);
  },
  stop: function stopTimer() {
    if (this.stopped) return;

    clearCounters.call(this);
    finish.call(this);
  },

  get currentEvents() {
    return this._eventTraversal.path;
  },
};
function newTimer(eventTraversal) {
  return Object.create(Timer).init(eventTraversal);
}

function launch() {
  this._intervalId = setInterval(tick.bind(this), 1000);
}
function tick() {
  this._currentTime += 1000;
  fire.call(this, Events.TICK, this._currentTime);

  while (this._currentTime >= this._eventTraversal.head.endTime) {
    this._eventTraversal.head.callback();

    this._eventTraversal.next();

    fire.call(this, Events.LEVEL_UPDATE, this._eventTraversal.diff);

    if (this._eventTraversal.finished) {
      clearCounters.call(this);
      finish.call(this);
      break;
    }
  }
}

function startUp() {
  this._tickAndLaunchTimeoutId = setTimeout(() => {
    tick.call(this);
    if (!this.stopped) {
      launch.call(this);
    }
  }, this._msUntilNextTick);
}
function finish() {
  this._currentTime = 0;
  this._eventTraversal.reset();
  markStopped.call(this);
  fire.call(this, Events.FINISH);
}
function clearCounters() {
  clearTimeout(this._tickAndLaunchTimeoutId);
  clearInterval(this._intervalId);
}

function markRunning() {
  this._state = States.running;
}
function markPaused() {
  this._state = States.paused;
}
function markStopped() {
  this._state = States.stopped;
}

function on(event, fn) {
  this._timerEventBus.bindListener(event, fn);
}

function fire(event, ...args) {
  this._timerEventBus.fire(event, ...args)
}

export { newTimerEvent, newTimer };