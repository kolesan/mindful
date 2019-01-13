import { log } from '../../utils/Logging';
import { noop } from "../../utils/Utils";

export default function TimeKeeper(procInterval) {
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
        startTime = Date.now();
        msUntilNextProc = 1000;
      } else {
        startTime += Date.now() - pauseTime;
      }

      startUp();

      markRunning();
    },
    pause() {
      if (!isRunning()) return;

      pauseTime = Date.now();
      msUntilNextProc = 1000 - (pauseTime - startTime) % 1000;

      clearCounters();
      markPaused();
    },
    stop() {
      if (isStopped()) return;

      clearCounters();

      currentTime = 0;
      markStopped();
    },
    seek(time) {
      clearCounters();

      let msLeftovers = time % 1000;
      currentTime = time - msLeftovers;
      startTime = Date.now() - time;
      pauseTime = Date.now();
      msUntilNextProc = msLeftovers === 0 && time > 0 ? 0 : 1000 - msLeftovers;

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
    console.log("proc called", currentTime);
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