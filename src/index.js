import './style.css';
import loudGongFileName from '../resources/long-loud-gong.mp3';
import fastGongFileName from '../resources/short-fast-gong.mp3';

function sgong(){
  new Audio(loudGongFileName).play();
}

function fgong(){
  new Audio(fastGongFileName).play();
}

function start() {
  let duration = parseTime(document.getElementById("mainTimer").value);
  let interval = document.getElementById("timerInput").value;
  let durationElem = document.getElementById("duration");
  let timerElem = document.getElementById("timerOutput");

  window.myKoLeTimer = Object.create(Timer);
  myKoLeTimer.init(timerElem, durationElem, sgong, [{duration: 1}, {duration: 2}]);
  myKoLeTimer.start();
}

function pause() {
  myKoLeTimer.pause();
}

function unpause() {
  myKoLeTimer.unpause();
}

let TimerEvent = {
  init: function initTimerEvent(name, duration, callback) {
    this.name = name;
    this.duration = duration;
    this.callback = callback;
  }
};

let Timer = {
  init: function initTimer(timerElem, durationElem, callback, events) {
    this.timerElem = timerElem;
    this.durationElem = durationElem;
    this.initiated = true;

    this.callback = callback;

    this.events = events || [];
    this.duration = (function sumEvents(events) {
      let reduced = events.reduce(function reducer(a, b) {
        let da = a.duration || 0;
        let db = b.duration || 0;
        return {duration: da + db};
      });
      return reduced.duration;
    })(this.events);
  },
  start: function startTimer() {
    if (!this.initiated) {
      throw new Error("Timer has to be initiated prior to starting it");
    }

    this.currentTime = 0;

    this.timerElem.innerHTML = formatTime(0);
    this.durationElem.innerHTML = formatTime(this.duration);

    if (this.duration > 0) {
      this.launch();
    } else {
      this.callback();
    }
  },
  launch: function launchTimer() {
    this.intervalId = setInterval(this.tick.bind(this), 1000);
  },
  tick: function tickTimer() {
    this.currentTime += 1000;

    if (this.currentTime >= this.duration) {
      this.callback();
      clearInterval(this.intervalId);
    }
    this.timerElem.innerHTML = formatTime(this.currentTime);
  },
  pause: function pauseTimer() {
    clearInterval(this.intervalId);

    this.timerStringValue = this.timerElem.innerHTML;
    this.timerElem.innerHTML += " PAUSED"
  },
  unpause: function unpauseTimer() {
    this.timerElem.innerHTML = this.timerStringValue;
    this.launch();
  },
  stop: function() {

  }
};

function formatTime(timestamp) {
  const sd = 1000;
  const md = sd*60;
  const hd = md*60;

  function div(a, b) {
    return Math.floor(a / b);
  }

  function format(num) {
    let prefix = "";
    if (num < 10) {
      prefix = "0";
    }
    return prefix + num;
  }

  let h = div(timestamp, hd);
  timestamp -= h*hd;

  let m = div(timestamp, md);
  timestamp -= m*md;

  let s = div(timestamp, sd);

  return `${format(h)}:${format(m)}:${format(s)}`;
}

function parseTime(timeString) {
  let timeArray = timeString.split(":");
  let h = Number(timeArray[0]) || 0;
  let m = Number(timeArray[1]) || 0;
  let s = Number(timeArray[2]) || 0;
  return h*1000*60*60 + m*1000*60 + s*1000;
}



export { Timer, start, pause, unpause, fgong, sgong };