import { log } from "../../utils/Logging";
import { last } from "../../utils/Utils";

export default function inst(iterable) {
  let iterator, head, path, _diff, finished;
  init();

  return Object.freeze({
    next,
    return() {
      iterator.return && iterator.return();
      finished = true;
    },
    reset() {
      this.return();
      init();
    },
    seek(time) {
      // log("Event traversal seeking time", time);
      if (typeof time != "number" || Number.isNaN(time) || !Number.isFinite(time) || time < 0) {
        throw Error(`Can not seek to time ${time}`);
      }

      let timeDuringEvent = (event) => (time >= event.startTime) && (time < event.endTime);

      if (finished || time < head.startTime) {
        this.reset();
      }

      if (timeDuringEvent(head)) {
        _diff = diffObj();
        return this;
      }

      let pathBeforeSeeking = path;
      while(!finished && !timeDuringEvent(head)) {
        next();
      }
      _diff = calculateDiff(pathBeforeSeeking, path);

      return this;
    },
    get head() { return head; },
    get path() { return path; },
    get diff() { return _diff; },
    get finished() { return finished; }
  });

  function init() {
    iterator = iterable[Symbol.iterator]();
    head = null;
    path = [];
    _diff = null;
    finished = false;
    next();
  }

  function next() {
    if (finished) {
      return {done: true};
    }
    let pathBefore = path;
    let iteration = iterator.next();
    path = iteration.value || [];
    finished = iteration.done;
    head = last(path);
    _diff = calculateDiff(pathBefore, path);
    return iteration;
  }

  function calculateDiff(before, after) {
    //Skip the 'root' that did not change
    let i = 0;
    while(before[i] && after[i] && before[i].id == after[i].id) {
      i++;
    }
    return diffObj(after.slice(i), before.slice(i));
  }

  function diffObj(added = [], removed = []) {
    return Object.freeze({added, removed});
  }
}