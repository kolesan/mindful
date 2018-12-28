import * as Component from "../../utils/Component";
import { children, createElement, iconElem, setChildIcon } from "../../utils/HtmlUtils";
import { log } from "../../utils/Logging";
import ToolNames from "./ToolNames";

function create(toolIcon, toolName, toolHeading) {
  let iconElement = iconElem(toolIcon + " pe_icon");
  let elem = createElement("div", `program__element program__element__${toolName}`);
  elem.appendChild(createHeading(iconElement, toolHeading));
  elem.dataset.element = toolName;

  return Component.create([elem], {
    setIcon(icon) {
      icon.classList.add("pe_icon");
      iconElement.parentNode.replaceChild(icon, iconElement);
      iconElement = icon;
    },
    getIcon() { return iconElement }
  });
}

function createHeading(iconElement, toolHeading) {
  let heading = createElement("div", "pe__heading");
  heading.appendChild(iconElement);
  heading.appendChild(toolHeading);
  heading.appendChild(dragAnchor());
  return heading;
}

function dragAnchor() {
  let dragAnchor = iconElem("pe__drag_anchor fas fa-hand-pointer");
  dragAnchor.setAttribute("name", "dragAnchor");
  return dragAnchor;
}

export function programElemChildren(elem) {
  return children(elem).filter(isProgramElement);
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
  // log("Duration input value of", loop, elemDurationSum(programElemChildren(loop)) * iterationsInputOf(loop).value);
  return elemDurationSum(programElemChildren(loop)) * iterationsInputOf(loop).value;
}
export function eventDuration(event) {
  // log("Duration input value of", event, durationInputOf(event).value);
  let children = programElemChildren(event);
  return children.length > 0 ? elemDurationSum(children) : durationInputOf(event).value;
}
export function isProgramElement(elem) {
  // log("Is tool component?", elem, elem && elem.dataset && elem.dataset.element);
  return elem && elem.dataset && elem.dataset.element;
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