import { log } from '../../utils/Logging';
import { noop } from "../../utils/Utils";

export default function TimeKeeper(procInterval = 1000, nowKeeper = Date) {
  const States = {
    running: "running",
    paused: "paused",
    stopped: "stopped",
  };

  let onProcCb = noop;

  let currentTime = 0;
  let startTime = 0;
  let msUntilNextProc = 0;
  let pauseTime = 0;
  let intervalId = 0;
  let procAndLaunchTimeoutId = 0;
  let state = null;
  markStopped();

  return Object.freeze({
    onProc(cb) {
      onProcCb = cb;
      return this;
    },

    get running() { return isRunning()},
    get paused() { return isPaused()},
    get stopped() { return isStopped()},

    start() {
      if (isRunning()) return;

      if (isStopped()) {
        msUntilNextProc = procInterval;
        startTime = nowKeeper.now();
      } else {
        //(pauseTime - startTime) is the time that passed while timer was running
        msUntilNextProc = procInterval - (pauseTime - startTime) % procInterval;
        //(now - pauseTime) is the time that passed while the timer was paused
        //for future (pauseTime - startTime) calculations we need to move startTime forward by the time during pause
        startTime += nowKeeper.now() - pauseTime;
      }

      startUp();
      markRunning();
    },
    pause() {
      if (!isRunning()) return;

      pauseTime = nowKeeper.now();

      clearCounters();
      markPaused();
    },
    stop() {
      if (isStopped()) return;

      currentTime = 0;

      clearCounters();
      markStopped();
    },
    seek(time) {
      clearCounters();

      let msLeftovers = time % procInterval;
      currentTime = time - msLeftovers;
      startTime = nowKeeper.now() - time;
      pauseTime = nowKeeper.now();
      msUntilNextProc = msLeftovers === 0 && time > 0 ? 0 : procInterval - msLeftovers;

      if (isRunning()) {
        startUp();
      } else if (isStopped()) {
        markPaused();
      }
    },
  });

  function startUp() {
    procAndLaunchTimeoutId = setTimeout(() => {
      proc();
      //Proc callback could potentially stop the TimeSeeker, if for example the timer is exhausted by this last proc
      if (!isStopped()) {
        intervalId = setInterval(proc, procInterval);
      }
    }, msUntilNextProc);
  }
  function proc() {
    currentTime += procInterval;
    onProcCb(currentTime);
  }

  function clearCounters() {
    clearTimeout(procAndLaunchTimeoutId);
    clearInterval(intervalId);
  }

  function isRunning() { return state === States.running}
  function isPaused() { return state === States.paused}
  function isStopped() { return state === States.stopped}
  function markRunning() { state = States.running }
  function markPaused() { state = States.paused }
  function markStopped() { state = States.stopped }
}