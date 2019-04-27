import { log } from "../../utils/Logging";
import { newTimerEvent } from "./Timer";

import ConverterRegistry, { Converters } from "../../program_model_converters/ConverterRegistry";
const timerIterableConverter = ConverterRegistry.get(Converters.timerIterable);


export default function inst(program) {
  return Object.freeze({
    [Symbol.iterator](startFrom) {
      return programPathIterator(timerIterableConverter.serialize(program.mainEvent), startFrom);
    }
  });
}


function *programPathIterator(root, startFrom = 1) {
  let path = [];

  root.id = "0";
  yield *iterator(root, 0, normalizeDirection(startFrom));

  function *iterator(node, startTime, direction) {
    if (!node.isTransparent()) {
      path.push(toTimerEvent(node, startTime));
    }

    let child;
    if (direction === 1) {
      node.reset();
      child = node.nextChild();
    } else {
      node.skipToAfterLastChild();
      child = node.previousChild();
      startTime += node.duration - (child ? child.duration : 0);
    }

    while (child) {
      child.id = node.id + child.id;
      direction = yield *iterator(child, startTime, direction);
      if (direction === 1) {
        startTime += child.duration;
        child = node.nextChild();
      } else {
        child = node.previousChild();
        startTime -= child ? child.duration : 0;
      }
    }

    if (!node.isTransparent()) {
      if (node.isLeaf()) {
        direction = normalizeDirection(yield path);
      }
      path.pop();
    }

    return direction;
  }

  function normalizeDirection(direction) {
    return (direction && direction < 0) ? -1 : 1;
  }
}

function toTimerEvent(programEvent, startTime) {
  let name = programEvent.name;
  if (programEvent.hasOwnProperty("iteration")) {
    name = name.replace("{i}", programEvent.iteration + 1);
  }
  return newTimerEvent(
    programEvent.id,
    name,
    startTime,
    programEvent.duration,
    programEvent.callback
  );
}