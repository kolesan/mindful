import { createElement, disable, enable } from "../../utils/HtmlUtils";
import { alphanumericValidation, markInvalid, markValid } from "../../Validation";
import { ToolNames } from "./Tools";
import * as InputValidator from "../../text_input/InputValidator";
import { copyValuesOfCustomElements } from "../../utils/CustomElementsUtils";
import { log } from "../../utils/Logging";
import * as EventBus from "../../utils/EventBus";
import { DURATION_CHANGED_EVENT } from "../../utils/Events";
import * as ToolComponent from "./ToolComponent";
import { programElemChildren } from "./ToolComponent";
import { eventDuration } from "./ToolComponent";

const EVENT_ICON = "fas fa-bell";

function create({name, duration} = {}) {
  let durationInput = durationInputCmp(duration);

  let cmp = ToolComponent.create(EVENT_ICON, ToolNames.event, eventHeadingCmp(name, durationInput));
  //Shadow dom values are not cloned with cloneNode() call for some reason
  cmp.onDrag = (dragged, elem) => copyValuesOfCustomElements(elem, dragged.dragImage);

  durationInput.onDurationChange(() => EventBus.globalInstance.fire(DURATION_CHANGED_EVENT, cmp.element));

  initChildMutationCallbacks(cmp.element, durationInput);

  return cmp;
}

function initChildMutationCallbacks(element, durationInput) {
  let observer = new MutationObserver(() => {
    let children = programElemChildren(element);
    if (children.length > 0) {
      disable(durationInput);
      durationInput.value = eventDuration(element);
    } else {
      enable(durationInput);
    }
  });
  observer.observe(element, {childList: true});
}

// function reactToChildElements(mutations) {
//   let sortedMutations = sortMutations(mutations);
//   log("Mutations detected in:", cmp.element, sortedMutations);
//   let childElems = children(cmp.element).filter(ToolComponent.isProgramElement);
//   if (childElems.length > 0) {
//     disable(durationInput);
//   }
// }

// function sortMutations(mutations) {
//   let added = [];
//   let removed = [];
//   mutations.forEach(mutation => {
//     added.push(arr(mutation.addedNodes).filter(ToolComponent.isProgramElement));
//     removed.push(arr(mutation.removedNodes).filter(ToolComponent.isProgramElement));
//   });
//   return {added, removed};
// }

function eventHeadingCmp(name, durationInput) {
  let heading = createElement("div", "pee__heading");
  heading.appendChild(nameInputCmp(name));
  heading.appendChild(durationInput);
  return heading;
}

function nameInputCmp(name = `TimerEvent`) {
  let input = createElement("dynamic-size-input", "text_input peh__name_input");
  input.setAttribute("type", "text");
  input.setAttribute("spellcheck", "false");
  input.setAttribute("name", "eventNameInput");
  input.value = name;

  InputValidator.inst(input)
    .bindValidation(alphanumericValidation)
    .onFail(markInvalid)
    .onSuccess(markValid)
    .triggerOn("input");

  return input;
}

function durationInputCmp(duration = 0) {
  let input = createElement("duration-input", "text_input peeh__duration_input");
  input.setAttribute("name", "eventDurationInput");
  input.value = duration;
  log("CREATED INPUT OF TYPE: ",  typeof input, input, Object.getPrototypeOf(input), Object.keys(input));
  return input;
}

function calculateDuration(eventElement) {
}

export { create, calculateDuration };