import { createElement, disable, enable, iconElem } from "../../utils/HtmlUtils";
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
const EVENT_ICON_MUTED = "fas fa-bell-slash";

function create({name, duration} = {}) {
  let durationInput = durationInputCmp(duration);

  let cmp = ToolComponent.create(EVENT_ICON, ToolNames.event, eventHeadingCmp(name, durationInput));
  //Shadow dom values are not cloned with cloneNode() call for some reason
  cmp.onDrag = (dragged, elem) => copyValuesOfCustomElements(elem, dragged.dragImage);

  durationInput.onDurationChange(() => EventBus.globalInstance.fire(DURATION_CHANGED_EVENT, cmp.element));

  initChildMutationCallbacks();

  return cmp;

  function initChildMutationCallbacks() {
    let childElementsObserver = new MutationObserver(() => {
      let children = programElemChildren(cmp.element);
      if (children.length > 0) {
        disable(durationInput);
        durationInput.value = eventDuration(cmp.element);
        //TODO should create custom component for icon and extract disable/enable || mute/unmute logic into it
        cmp.setIcon(iconElem(EVENT_ICON_MUTED));
        cmp.getIcon().style.opacity = 0.6;
        cmp.getIcon().title = "Events with children are muted";
        cmp.element.dataset.muted = "true";
      } else {
        enable(durationInput);
        cmp.setIcon(iconElem(EVENT_ICON));
        cmp.getIcon().style.opacity = "";
        cmp.getIcon().title = "Event completion sound";
        cmp.element.dataset.muted = "false";
      }
    });
    childElementsObserver.observe(cmp.element, {childList: true});
  }
}

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
  return input;
}

function calculateDuration(eventElement) {
}

export { create, calculateDuration };