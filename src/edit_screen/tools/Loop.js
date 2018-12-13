import { createElement } from "../../utils/HtmlUtils";
import { ToolNames } from "./Tools";
import * as ToolComponent from "./ToolComponent";

const LOOP_ICON = "fas fa-undo-alt";

function create({iterations} = {}) {
  return ToolComponent.create(LOOP_ICON, ToolNames.loop, loopHeadingCmp(iterations));
}

function loopHeadingCmp(iterations) {
  let heading = createElement("div", "pel__heading");
  heading.appendChild(loopIterationsInputCmp(iterations));
  return heading;
}

function loopIterationsInputCmp(iterations = 2) {
  let input = createElement("input", "text_input peh__iterations_input");
  input.setAttribute("type", "number");
  input.setAttribute("name", "iterationsInput");
  input.value = iterations;

  let label = createElement("label", "", "x");
  label.appendChild(input);
  return label;
}

export { create };