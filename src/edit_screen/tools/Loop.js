import { log } from "../../utils/Logging";
import { createElement, element, text } from "../../utils/HtmlUtils";
import ToolNames from "./ToolNames";
import { create as createTool, loopDuration, programElemChildren } from "./ToolComponent";
import * as EventBus from "../../utils/EventBus";
import { DURATION_CHANGED_EVENT } from "../../utils/Events";
import { Tools } from "./Tools";

const LOOP_ICON = "fas fa-undo-alt";

function fromElement(element, afterCreationCb) {
  let cmp = create({
    iterations: getIterationsInput(element).value,
  });

  programElemChildren(element)
    .map(childElement => Tools.fromElement(childElement, afterCreationCb))
    .forEach(childCmp => cmp.element.appendChild(childCmp.element));

  afterCreationCb(cmp);
  return cmp;
}

function create({iterations} = {}) {
  let durationDisplay = durationDisplayCmp(0);
  let iterationsInput = loopIterationsInputCmp(iterations);

  let cmp = createTool(LOOP_ICON, ToolNames.loop, loopHeadingCmp(iterationsInput, durationDisplay));
  //Shadow dom input values are not cloned with cloneNode() call for some reason
  cmp.onDrag = draggable => writeValuesTo(draggable.image.node);
  cmp.copy = afterCopyCb => fromElement(cmp.element, afterCopyCb);

  durationDisplay.onDurationChange(() => {
    EventBus.globalInstance.fire(DURATION_CHANGED_EVENT, cmp.element);
  });
  iterationsInput.onInput(() => {
    durationDisplay.value = loopDuration(cmp.element);
  });
  initChildMutationCallbacks(cmp.element, durationDisplay);

  return cmp;

  function writeValuesTo(targetElement) {
    let targetDurationInput = getDurationDisplay(targetElement);
    let targetIterationsInput = getIterationsInput(targetElement);

    if (targetDurationInput && targetIterationsInput) {
      targetDurationInput.value = durationDisplay.value;
      targetIterationsInput.value = iterationsInput.value;
      return;
    }

    throw Error(`Can not copy loop field values to`, targetElement);
  }
}

function initChildMutationCallbacks(element, durationDisplay) {
  let observer = new MutationObserver(() => {
    durationDisplay.value = loopDuration(element);
  });
  observer.observe(element, {childList: true});
}

function getDurationDisplay(target) {
  return target.querySelector("[name=durationDisplay]")
}
function getIterationsInput(target) {
  return target.querySelector("[name=iterationsInput]");
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
      name: "durationDisplay",
      disabled: true,
      title: "Loop duration"
    },
    value: 0
  });
}

export { create, fromElement };