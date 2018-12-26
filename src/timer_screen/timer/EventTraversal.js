import { log } from "../../utils/Logging";
import { last } from "../../utils/Utils";

export default function inst(iterable) {
  let iterator, head, path, _diff, finished;
  init();

  return Object.freeze({
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (finished) {
        return {done: true};
      }
      let pathBefore = path;
      let iteration = iterator.next();
      path = iteration.value;
      finished = iteration.done;
      head = last(path);
      _diff = calculateDiff(pathBefore, path);
      // log("Next called:", iteration);
      return iteration;
    },
    return() {
      iterator.return && iterator.return();
      finished = true;
    },
    reset() {
      this.return();
      init();
    },
    seek(time) {
      let predicate = (head) => (head.startTime <= time) && (head.endTime >= time);

      let traversal = inst(iterable);
      for(let iteration of traversal) {
        if (predicate(last(iteration))) {
          return traversal;
        }
      }
      return inst(iterable);
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
  }

  function calculateDiff(before, after) {
    if (!before || !after) {
      return diff();
    }
    //Skip the 'root' that did not change
    let i = 0;
    while(before[i] && after[i] && before[i].id == after[i].id) {
      i++;
    }
    return diff(after.slice(i), before.slice(i));

    function diff(added = [], removed = []) {
      return Object.freeze({added, removed});
    }
  }
}

// import * as TreeUtils from '../../utils/TreeUtils';
// function seekEventStackByTime(stack, time, mainEvent) {
//   let matchingElements = TreeUtils.flatten(mainEvent).filter(event => event.startTime <= time && event.endTime > time);
//   if (matchingElements.length == 0) {
//     throw new Error(`Can not seek to '${time}', it is out of bounds`);
//   }
//   let closestMatch = matchingElements.reduce((a, b) => time - a.startTime > time - b.startTime ? b : a);
//   stack.reset();
//   stack.seek(it => it.event.id == closestMatch.id);
// }