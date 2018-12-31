import { log } from "../../utils/Logging";
import ToolNames from "../../edit_screen/tools/ToolNames";
import { newTimerEvent } from "./Timer";
import { callbackDictionary } from '../../EventCallbacks';
import programEvent from "../../program/ProgramEvent";
import programLoop from "../../program/ProgramLoop";

export default function inst(program) {
  return Object.freeze({
    [Symbol.iterator](startFrom) {
      return programPathIterator(toProgramElementTree(program.mainEvent), startFrom);
    }
  });
}

function toProgramElementTree(node) {
  let children = [];
  for(let child of node.children) {
    children.push(toProgramElementTree(child));
  }

  let programElement = toProgramElement(node);
  programElement.children = children;
  return programElement;
}

function toProgramElement(node) {
  switch(node.element) {
    case ToolNames.event:
      let event = Object.create(programEvent);
      event.init(node.name, node.children, node.duration, node.callback);
      return event;
    case ToolNames.loop:
      let loop = Object.create(programLoop);
      loop.init(node.iterations, node.children, node.duration, node.callback);
      return loop;
  }
}

function *programPathIterator(root, startFrom = 1) {
  let path = [];

  root.id = "0";
  yield *iterator(root, 0, normalizeDirection(startFrom));

  function *iterator(node, startTime, direction) {
    if (isEvent(node)) {
      path.push(toTimerEvent(node, startTime));
      if (direction === -1) {
        direction = normalizeDirection(yield path);
        if (direction === 1) {
          path.pop();
          return direction;
        }
      }
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

    if (isEvent(node)) {
      if (direction === 1) {
        direction = normalizeDirection(yield path);
      }
      path.pop();
    }

    return direction;
  }

  function normalizeDirection(direction) {
    return (direction && direction < 0) ? -1 : 1;
  }
  function isEvent(node) {
    return programEvent.isPrototypeOf(node);
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
    callbackDictionary.get(programEvent.callback)
  );
}