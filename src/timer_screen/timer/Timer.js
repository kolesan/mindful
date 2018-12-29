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

let Timer = {
  Events: Object.freeze({
    START: "TIMER_STARTED",
    PAUSE: "TIMER_PAUSED",
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
  onFinish(fn) { this.on(this.Events.FINISH, fn) },
  onTick(fn) { this.on(this.Events.TICK, fn) },
  onLevelUpdate(fn) { this.on(this.Events.LEVEL_UPDATE, fn) },
  onSeek(fn) { this.on(this.Events.SEEK, fn) },

  fire(event, ...args) { this.timerEventBus.fire(event, ...args) },

  init: function initTimer(eventTraversal) {
    this.eventTraversal = eventTraversal;
    this.currentTime = 0;
    this.timerEventBus = createEventBus();
    this.markStopped();
    return this;
  },

  start: function startTimer() {
    if (this.running) return;

    if (this.stopped) {
      this.startTime = Date.now();
      this.msUntilNextTick = 1000;
    } else {
      this.startTime += Date.now() - this.pauseTime;
    }

    this._startUp();

    this.markRunning();
    this.fire(this.Events.START);
  },
  launch: function launchTimer() {
    this.intervalId = setInterval(this.tick.bind(this), 1000);
  },
  tick: function tickTimer() {
    this.currentTime += 1000;
    this.fire(this.Events.TICK, this.currentTime);

    while (this.currentTime >= this.eventTraversal.head.endTime) {
      this.eventTraversal.head.callback();

      this.eventTraversal.next();

      this.fire(this.Events.LEVEL_UPDATE, this.eventTraversal.diff);

      if (this.eventTraversal.finished) {
        this._clearCounters();
        this._finish();
        break;
      }
    }
  },
  seek: function seekTimer(time) {
    this._clearCounters();
    this.eventTraversal.seek(time);
    this.fire(this.Events.SEEK, time, this.eventTraversal.diff);

    if (this.eventTraversal.finished) {
      this._finish();
      return;
    }

    let msLeftovers = time % 1000;
    this.currentTime = time - msLeftovers;
    this.startTime = Date.now() - time;
    this.pauseTime = Date.now();
    this.msUntilNextTick = msLeftovers === 0 && time > 0 ? 0 : 1000 - msLeftovers;

    if (this.running) {
      this._startUp();
    } else if (this.stopped) {
      this.markPaused();
    }
  },
  pause: function pauseTimer() {
    if (!this.running) return;

    this.pauseTime = Date.now();
    this.msUntilNextTick = 1000 - (this.pauseTime - this.startTime) % 1000;
    this._clearCounters();
    this.markPaused();
    this.fire(this.Events.PAUSE);
  },
  stop: function stopTimer() {
    if (this.stopped) return;

    this._clearCounters();
    this._finish();
  },

  currentEvents: function getCurrentEvents() {
    return this.eventTraversal.path;
  },

  _startUp: function startUpTimerPRIVATE() {
    this.tickAndLaunchTimeoutId = setTimeout(() => {
      this.tick();
      if (!this.stopped) {
        this.launch();
      }
    }, this.msUntilNextTick);
  },
  _finish: function finishTimerPRIVATE() {
    this.currentTime = 0;
    this.eventTraversal.reset();
    this.markStopped();
    this.fire(this.Events.FINISH);
  },
  _clearCounters: function clearCountersPRIVATE() {
    clearTimeout(this.tickAndLaunchTimeoutId);
    clearInterval(this.intervalId);
  }
};
function newTimer(eventTraversal) {
  return Object.create(Timer).init(eventTraversal);
}

export { newTimerEvent, newTimer, States as TimerStates };