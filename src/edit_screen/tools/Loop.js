import { createElement, element, text } from "../../utils/HtmlUtils";
import { ToolNames } from "./Tools";
import * as ToolComponent from "./ToolComponent";
import { log } from "../../utils/Logging";
import { copyValuesOfCustomElements } from "../../utils/CustomElementsUtils";

const LOOP_ICON = "fas fa-undo-alt";

function create({iterations} = {}) {
  let cmp = ToolComponent.create(LOOP_ICON, ToolNames.loop, loopHeadingCmp(iterations));
  //Shadow dom values are not cloned with cloneNode() call for some reason
  cmp.onDrag = (dragged, elem) => copyValuesOfCustomElements(elem, dragged.dragImage);
  return cmp;
}

function loopHeadingCmp(iterations) {
  let heading = createElement("div", "pel__heading");
  heading.appendChild(loopIterationsInputCmp(iterations));
  return heading;
}

function loopIterationsInputCmp(iterations = 2) {
  let label = element({
    tag: "span",
    attributes: {
      slot: "left"
    },
    children: [text("x")]
  });

  return element({
    tag: "dynamic-size-input",
    classes: "text_input peh__iterations_input",
    attributes: {
      type: "number",
      maxsize: 4,
      name: "iterationsInput",
      min: 0,
      max: 999
    },
    value: iterations,
    children: [
      label
    ]
  });
}

export { create };