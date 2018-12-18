import * as Component from "../../utils/Component";
import { createElement, iconCmp } from "../../utils/HtmlUtils";
import { log } from "../../utils/Logging";

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

export { create };