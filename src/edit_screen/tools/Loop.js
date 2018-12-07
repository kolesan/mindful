import { createComponent, focusOnTouch, iconCmp } from "../../utils/HtmlUtils";
import { ToolNames } from "./Tools";

const LOOP_ICON = "fas fa-undo-alt";

function create(iterations) {
  let loop = createComponent("div", `program__element program__element__loop`);
  loop.appendChild(loopHeadingCmp(iterations));
  loop.dataset.element = ToolNames.loop;
  return loop;
}

function loopHeadingCmp(iterations) {
  let heading = createComponent("div", "pel__heading");
  heading.appendChild(iconCmp(LOOP_ICON));
  heading.appendChild(loopIterationsInputCmp(iterations));
  return heading;
}

function loopIterationsInputCmp(iterations = 2) {
  let input = createComponent("input", "text_input peh__iterations_input");
  input.setAttribute("type", "number");
  input.setAttribute("name", "iterationsInput");
  input.value = iterations;
  input.addEventListener("mousedown", event => event.stopPropagation());

  focusOnTouch(input);

  let label = createComponent("label", "", "x");
  label.appendChild(input);
  return label;
}

export { create };