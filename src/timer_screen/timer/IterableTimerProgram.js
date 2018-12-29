import { log } from "../../utils/Logging";
import ToolNames from "../../edit_screen/tools/ToolNames";
import { newTimerEvent } from "./Timer";
import { callbackDictionary } from '../../EventCallbacks';
import programEvent from "../../program/ProgramEvent";
import programLoop from "../../program/ProgramLoop";
import * as TreeUtils from "../../utils/TreeUtils";

export default function inst(program) {
  return Object.freeze({
    [Symbol.iterator]() {
      return programIterator(program);
    }
  });
}

function toProgramElement(elem) {
  switch(elem.element) {
    case ToolNames.event:
      let event = Object.create(programEvent);
      event.init(elem.name, elem.startTime, elem.children, elem.duration);
      return event;
    case ToolNames.loop:
      let loop = Object.create(programLoop);
      loop.init(elem.iterations, elem.startTime, elem.children, elem.duration);
      return loop;
  }
}

//TODO awesome name, brah
function *specialnijGeneratorSoStakom(root) {
  let stack = [];

  yield *specialnijGenerator(root);

  function *specialnijGenerator(node) {
    let child;
    if (isEvent(node)) {
      stack.push(toTimerEvent(node));
    }
    while (child = node.nextChild()) {
      yield *specialnijGenerator(child);
    }
    if (isEvent(node)) {
      yield stack;
      stack.pop();
    }
  }
}

function isEvent(node) {
  return programEvent.isPrototypeOf(node);
}

function toTimerEvent(programEvent) {
  let name = programEvent.name;
  if (programEvent.hasOwnProperty("iteration")) {
    name = name.replace("{i}", programEvent.iteration + 1);
  }
  //TODO remove children from timerEvent obj prototype (no longer needed)
  return newTimerEvent(
    name,
    programEvent.startTime,
    programEvent.duration,
    callbackDictionary.get(programEvent.callback)
  );
}

function setStartTime(node, startTime) {
  node.startTime = startTime;
  let childStartTime = startTime;
  for(let child of node.children) {
    setStartTime(child, childStartTime);
    childStartTime += child.duration;
  }
}

//TODO probably do not need whole program, only main event
function programIterator(program) {
  setStartTime(program.mainEvent, 0);
  let root = TreeUtils.map(program.mainEvent, toProgramElement);
  return specialnijGeneratorSoStakom(root);
}