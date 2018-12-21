import { createElement } from "../../utils/HtmlUtils";
import { alphanumericValidation, markInvalid, markValid } from "../../Validation";
import { ToolNames } from "./Tools";
import * as InputValidator from "../../text_input/InputValidator";
import { copyValuesOfCustomElements } from "../../utils/CustomElementsUtils";
import { log } from "../../utils/Logging";
import * as EventBus from "../../utils/EventBus";
import { DURATION_CHANGED_EVENT } from "../../utils/Events";
import * as ToolComponent from "./ToolComponent";
import { arr } from "../../utils/Utils";

const EVENT_ICON = "fas fa-bell";

function create({name, duration} = {}) {
  let durationInput = durationInputCmp(duration);

  let cmp = ToolComponent.create(EVENT_ICON, ToolNames.event, eventHeadingCmp(name, durationInput));
  //Shadow dom values are not cloned with cloneNode() call for some reason
  cmp.onDrag = (dragged, elem) => copyValuesOfCustomElements(elem, dragged.dragImage);

  durationInput.onDurationChange(() => EventBus.globalInstance.fire(DURATION_CHANGED_EVENT, cmp.element));

  // new MutationObserver(reactToChildElements).observe(cmp.element, {childList: true});

  return cmp;

  // function reactToChildElements(mutations) {
  //   let sortedMutations = sortMutations(mutations);
  //   log("Mutations detected in:", cmp.element, sortedMutations);
  //   let childElems = children(cmp.element).filter(ToolComponent.isToolComponentElement);
  //   if (childElems.length > 0) {
  //     disable(durationInput);
  //   }
  // }
}

// function sortMutations(mutations) {
//   let added = [];
//   let removed = [];
//   mutations.forEach(mutation => {
//     added.push(arr(mutation.addedNodes).filter(ToolComponent.isToolComponentElement));
//     removed.push(arr(mutation.removedNodes).filter(ToolComponent.isToolComponentElement));
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