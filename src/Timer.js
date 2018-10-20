let TimerEvent = {
  init: function initTimerEvent(name, duration, callback) {
    this.name = name;
    this.duration = duration;
    this.callback = callback;

    return this;
  }
};

let Timer = {
  init: function initTimer(onTick, onPause, onUnpause, events) {
    this.onTick = onTick;
    this.onPause = onPause;
    this.onUnpause = onUnpause;
    this.events = events || [];

    this.currentTime = 0;
    this.currentEventIndex = 0;
    this.durationOffset = events[0].duration;

    this.initiated = true;

    this.duration = (function calculateDuration(events) {
      return events.reduce(function reducer(a, b) {
        return a + (b.duration || 0);
      }, 0);
    })(this.events);

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
    this.onTick(this.currentTime);

    if (this.currentTime >= this.durationOffset) {
      this.events[this.currentEventIndex].callback();

      this.currentEventIndex++;
      if (this.currentEventIndex == this.events.length) {
        clearInterval(this.intervalId);
      } else {
        this.durationOffset += this.events[this.currentEventIndex].duration;
      }
    }
  },
  pause: function pauseTimer() {
    this.onPause();
    clearInterval(this.intervalId);
  },
  unpause: function unpauseTimer() {
    this.onUnpause();
    this.launch();
  }
};

export { TimerEvent, Timer };