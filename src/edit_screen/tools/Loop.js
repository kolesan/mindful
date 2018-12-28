import { log } from "../../utils/Logging";
import { createElement, element, text } from "../../utils/HtmlUtils";
import ToolNames from "./ToolNames";
import { create as createTool, loopDuration } from "./ToolComponent";
import { copyValuesOfCustomElements } from "../../utils/CustomElementsUtils";
import * as EventBus from "../../utils/EventBus";
import { DURATION_CHANGED_EVENT } from "../../utils/Events";

const LOOP_ICON = "fas fa-undo-alt";

function create({iterations} = {}) {
  let durationDisplay = durationDisplayCmp(0);
  let iterationsInput = loopIterationsInputCmp(iterations);

  let cmp = createTool(LOOP_ICON, ToolNames.loop, loopHeadingCmp(iterationsInput, durationDisplay));
  //Shadow dom values are not cloned with cloneNode() call for some reason
  cmp.onDrag = (dragged, elem) => copyValuesOfCustomElements(elem, dragged.dragImage);

  durationDisplay.onDurationChange(() => {
    EventBus.globalInstance.fire(DURATION_CHANGED_EVENT, cmp.element);
  });
  iterationsInput.onInput(() => {
    durationDisplay.value = loopDuration(cmp.element);
  });
  initChildMutationCallbacks(cmp.element, durationDisplay);

  return cmp;
}

function initChildMutationCallbacks(element, durationDisplay) {
  let observer = new MutationObserver(() => {
    durationDisplay.value = loopDuration(element);
  });
  observer.observe(element, {childList: true});
}

function loopHeadingCmp(iterationsInput, durationDisplay) {
  let heading = createElement("div", "pel__heading");
  heading.appendChild(iterationsInput);
  heading.appendChild(durationDisplay);
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
      minsize: 1,
      maxsize: 3,
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

function durationDisplayCmp() {
  return element({
    tag: "duration-input",
    classes: "text_input peeh__duration_input",
    attributes: {
      name: "eventDurationInput",
      disabled: true,
      title: "Loop duration"
    },
    value: 0
  });
}

export { create };