import * as Component from "../../utils/Component";
import { children, createElement, iconCmp } from "../../utils/HtmlUtils";
import { log } from "../../utils/Logging";
import { ToolNames } from "./Tools";

function create(toolIcon, toolName, toolHeading) {
  let elem = createElement("div", `program__element program__element__${toolName}`);
  elem.appendChild(createHeading(toolIcon, toolHeading));
  elem.dataset.element = toolName;

  return Component.create([elem]);
}

function createHeading(toolIcon, toolHeading) {
  let heading = createElement("div", "pe__heading");
  heading.appendChild(iconCmp(toolIcon + " pe_icon"));
  heading.appendChild(toolHeading);
  heading.appendChild(dragAnchor());
  return heading;
}

function dragAnchor() {
  let dragAnchor = iconCmp("pe__drag_anchor fas fa-hand-pointer");
  dragAnchor.setAttribute("name", "dragAnchor");
  return dragAnchor;
}

export function isToolComponentElement(elem) {
  log("Is tool component?", elem, elem && elem.dataset && elem.dataset.element);
  return elem && elem.dataset && elem.dataset.element;
}

export function programElemChildren(elem) {
  return children(elem).filter(isToolComponentElement);
}
export function elemDurationSum(children) {
  return children.reduce((duration, child) => duration + elemDuration(child), 0);
}
export function elemDuration(elem) {
  if (isEvent(elem)) {
    return eventDuration(elem);
  } else if (isLoop(elem)) {
    return loopDuration(elem);
  }
  log(elem);
  throw Error("WHAT THE FUCK MAN, ONLY LOOPS AND EVENTS ALLOWED AND YOU GIVE ME THIS SHIT ^");
  return 0;
}
export function loopDuration(loop) {
  log("Duration input value of", loop, elemDurationSum(programElemChildren(loop)) * iterationsInputOf(loop).value);
  return elemDurationSum(programElemChildren(loop)) * iterationsInputOf(loop).value;
}
export function eventDuration(event) {
  log("Duration input value of", event, durationInputOf(event).value);
  return durationInputOf(event).value;
}
export function isEvent(elem) {
  return elem && elem.dataset && elem.dataset.element == ToolNames.event;
}
export function isLoop(elem) {
  return elem && elem.dataset && elem.dataset.element == ToolNames.loop;
}
export function durationInputOf(event) {
  return event.querySelector("duration-input");
}
export function iterationsInputOf(loop) {
  return loop.querySelector("[name=iterationsInput]");
}

export { create };