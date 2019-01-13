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

const Events = {
  START: "TIMER_STARTED",
  PAUSE: "TIMER_PAUSED",
  FINISH: "TIMER_FINISHED",
  TICK: "TIMER_TICK",
  LEVEL_UPDATE: "TIMER_LEVEL_UPDATE",
  SEEK: "TIMER_SEEK_UPDATE",
};

function newTimer(timeKeeper, eventTraversal) {
  return Object.create(Timer).init(timeKeeper, eventTraversal);
}
let Timer = {
  get running() { return this._timeKeeper.running},
  get paused() { return this._timeKeeper.paused},
  get stopped() { return this._timeKeeper.stopped},

  onStart(fn)       { this._timerEventBus.bindListener(Events.START, fn)        },
  onPause(fn)       { this._timerEventBus.bindListener(Events.PAUSE, fn)        },
  onFinish(fn)      { this._timerEventBus.bindListener(Events.FINISH, fn)       },
  onTick(fn)        { this._timerEventBus.bindListener(Events.TICK, fn)         },
  onLevelUpdate(fn) { this._timerEventBus.bindListener(Events.LEVEL_UPDATE, fn) },
  onSeek(fn)        { this._timerEventBus.bindListener(Events.SEEK, fn)         },

  init: function initTimer(timeKeeper, eventTraversal) {
    this._eventTraversal = eventTraversal;
    this._timerEventBus = createEventBus();
    this._timeKeeper = timeKeeper.onProc(tick.bind(this));
    return this;
  },

  start: function startTimer() {
    if (this.running) return;

    this._timeKeeper.start();
    fire.call(this, Events.START);
  },
  pause: function pauseTimer() {
    if (!this.running) return;

    this._timeKeeper.pause();
    fire.call(this, Events.PAUSE);
  },
  stop: function stopTimer() {
    if (this.stopped) return;

    finish.call(this);
  },
  seek: function seekTimer(time) {
    this._eventTraversal.seek(time);

    if (this._eventTraversal.finished) {
      finish.call(this);
      return;
    }

    this._timeKeeper.seek(time);
    fire.call(this, Events.SEEK, time, this._eventTraversal.diff);
  },

  get currentEvents() {
    return this._eventTraversal.path;
  },
};

function tick(time) {
  fire.call(this, Events.TICK, time);

  while (time >= this._eventTraversal.head.endTime) {
    this._eventTraversal.head.callback();

    this._eventTraversal.next();

    fire.call(this, Events.LEVEL_UPDATE, this._eventTraversal.diff);

    if (this._eventTraversal.finished) {
      finish.call(this);
      return;
    }
  }
}

function finish() {
  this._timeKeeper.stop();
  this._eventTraversal.reset();
  fire.call(this, Events.FINISH);
}

function fire(event, ...args) {
  this._timerEventBus.fire(event, ...args)
}

export { newTimerEvent, newTimer };