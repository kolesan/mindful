import { createElement, focusOnTouch, iconCmp } from "../../utils/HtmlUtils";
import { ToolNames } from "./Tools";
import * as Component from "../../utils/Component";

const LOOP_ICON = "fas fa-undo-alt";

function create({iterations} = {}) {
  let elem = createElement("div", `program__element program__element__loop`);
  elem.appendChild(loopHeadingCmp(iterations));
  elem.dataset.element = ToolNames.loop;

  return Component.create([elem]);
}

function loopHeadingCmp(iterations) {
  let heading = createElement("div", "pel__heading");
  heading.appendChild(iconCmp(LOOP_ICON));
  heading.appendChild(loopIterationsInputCmp(iterations));
  return heading;
}

function loopIterationsInputCmp(iterations = 2) {
  let input = createElement("input", "text_input peh__iterations_input");
  input.setAttribute("type", "number");
  input.setAttribute("name", "iterationsInput");
  input.value = iterations;
  input.addEventListener("mousedown", event => event.stopPropagation());

  focusOnTouch(input);

  let label = createElement("label", "", "x");
  label.appendChild(input);
  return label;
}

export { create };