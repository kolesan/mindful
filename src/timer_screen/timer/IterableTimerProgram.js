import { log } from "../../utils/Logging";
import ToolNames from "../../edit_screen/tools/ToolNames";
import { newTimerEvent } from "./Timer";
import { callbackDictionary } from '../../EventCallbacks';
import programEvent from "../../program/ProgramEvent";
import programLoop from "../../program/ProgramLoop";

export default function inst(program) {
  return Object.freeze({
    [Symbol.iterator]() {
      return programPathIterator(toProgramElementTree(program.mainEvent));
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

function *programPathIterator(root) {
  let path = [];

  yield *iterator(root, 0);

  function *iterator(node, startTime) {
    if (isEvent(node)) {
      path.push(toTimerEvent(node, startTime));
    }
    let child;
    while (child = node.nextChild()) {
      yield *iterator(child, startTime);
      startTime += child.duration;
    }
    node.reset();
    if (isEvent(node)) {
      yield path;
      path.pop();
    }
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
    name,
    startTime,
    programEvent.duration,
    callbackDictionary.get(programEvent.callback)
  );
}